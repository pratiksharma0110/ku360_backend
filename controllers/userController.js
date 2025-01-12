const pool = require("../database/postgres");
const bcrypt = require("bcrypt");
const userQueries = require("../queries/userQueries");
const getDayOfWeek = require("../utils/day");
const fetchHelper = require("../utils/fetchHelper");
const course = require("../utils/course");
const chapter = require("../utils/chapter");
const searchHelper = require("../utils/searchHelper");

const checkOnboardingStatus = async (req, res) => {
  try {
    const userId = req.user;
    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Missing user ID." });
    }

    const result = await pool.query(userQueries.getProfileByUserId, [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        on_boarding: false,
        message: "User profile not found.",
      });
    }

    const onBoardingStatus = result.rows[0].has_onboarded;

    return res.status(200).json({
      on_boarding: onBoardingStatus,
    });
  } catch (error) {
    console.error("Error checking onboarding status:", error);
    res.status(500).json({
      message: "Error checking onboarding status.",
    });
  }
};

const userDetails = async (req, res) => {
  try {
    const userId = req.user;
    if (!userId) {
      return res.status(401).json({
        message: "Please log in to continue",
      });
    }

    const userInformation = await pool.query(userQueries.getUserDetails, [
      userId,
    ]);
    if (!userInformation.rows.length) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json(userInformation.rows[0]);
  } catch (err) {
    console.log(`Internal Server Error: ${err.message}`);
    res.sendStatus(500);
  }
};

const editUserProfile = async (req, res) => {
  try {
    const userId = req.user;
    if (!userId) {
      return res.sendStatus(401);
    }

    const { firstname, lastname, password, newPassword } = req.body;
    const validFields = ["firstname", "lastname", "password", "newPassword"];

    const invalidFields = Object.keys(req.body).filter(
      (field) => !validFields.includes(field),
    );

    if (invalidFields.length > 0) {
      return res
        .status(400)
        .json({ message: `Invalid field(s): ${invalidFields.join(", ")}` });
    }

    if (firstname) {
      const updatedUser = [firstname, userId];
      await pool.query(userQueries.updateFirstname, updatedUser);
    }
    if (lastname) {
      const updatedUser = [lastname, userId];
      await pool.query(userQueries.updateLastname, updatedUser);
    }
    if (password && newPassword) {
      const currentPasswordResult = await pool.query(
        userQueries.extractPassword,
        [userId],
      );

      if (currentPasswordResult.rowCount === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      const currentHashedPassword =
        currentPasswordResult.rows[0].hashedpassword;

      const currentPasswordMatch = await bcrypt.compare(
        password,
        currentHashedPassword,
      );

      if (!currentPasswordMatch) {
        return res.status(403).json({ message: "Incorrect current password" });
      }

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

      const updatedUser = [hashedPassword, userId];
      await pool.query(userQueries.updatePassword, updatedUser);
    }
    return res.status(200).json({
      message: "Changes made to user",
    });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

// Helper function to convert an integer to Roman numeral
const toRoman = (num) => {
  const romanNumerals = [
    { value: 1000, symbol: "M" },
    { value: 900, symbol: "CM" },
    { value: 500, symbol: "D" },
    { value: 400, symbol: "CD" },
    { value: 100, symbol: "C" },
    { value: 90, symbol: "XC" },
    { value: 50, symbol: "L" },
    { value: 40, symbol: "XL" },
    { value: 10, symbol: "X" },
    { value: 9, symbol: "IX" },
    { value: 5, symbol: "V" },
    { value: 4, symbol: "IV" },
    { value: 1, symbol: "I" },
  ];

  let result = "";
  for (const { value, symbol } of romanNumerals) {
    while (num >= value) {
      result += symbol;
      num -= value;
    }
  }
  return result;
};

const getCourses = async (req, res) => {
  const { year_id, semester_id, department_id } = req.query;

  if (!year_id || !semester_id || !department_id) {
    return res.status(400).json({
      success: false,
      message: "Bad Request: year_id, semester_id, and department_id are required",
    });
  }

  const year = parseInt(year_id);
  const semester = parseInt(semester_id);
  const department = parseInt(department_id);

  if (isNaN(year) || isNaN(semester) || isNaN(department)) {
    return res.status(400).json({
      success: false,
      message: "Bad Request: year_id, semester_id, and department_id must be valid integers",
    });
  }

  const romanYear = toRoman(year);
  const romanSemester = toRoman(semester);

  try {
    const initialFetch = await pool.query(userQueries.fetchCourse, [
      romanYear, romanSemester, department
    ]);
    //console.log(initialFetch.rows);
    if (initialFetch.rowCount === 0) {
      console.log("No data found in the database. Fetching course catalog...");
      await course.fetchCourseCatalog(department_id);
      
      return await fetchHelper(
        userQueries.fetchCourse,
        [romanYear, romanSemester, department],
        res,
        "No courses found even after catalog update",
        "Courses fetched successfully"
      );
    }

    return res.status(200).json({
      success: true,
      data: initialFetch.rows,
      message: "Courses fetched successfully"
    });

  } catch (error) {
    console.error("Error in getCourses:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};

const getChapters = async (req, res) => {
  const { course_id, pdf_link } = req.query;

  // Log the input parameters for debugging purposes
  console.log("Course ID:", course_id, "PDF Link:", pdf_link);

  // Validate query parameters
  if (!course_id || !pdf_link) {
    return res.status(400).json({ 
      success: false, 
      error: "Missing parameters: 'course_id' and 'pdf_link' are required" 
    });
  }

  try {
    const initialFetch = await pool.query(userQueries.fetchChapter, [course_id]);

    if (initialFetch.rowCount === 0) {
      console.log("No data found in the database. Fetching chapters...");
      await chapter.fetchChapters(course_id, pdf_link);

      // Fetch data again after external fetch
      return fetchHelper(
        userQueries.fetchChapter, 
        [course_id], 
        res, 
        "No chapters found after fetching.", 
        "Chapters fetched successfully."
      );
    }

    // Data exists, return the data using fetchHelper
    return fetchHelper(
      userQueries.fetchChapter, 
      [course_id], 
      res, 
      "No chapters found.", 
      "Chapters fetched successfully."
    );

  } catch (error) {
    console.error("Error in getChapters:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const search = async (req, res) => {
  const { chapter_name, course_name } = req.query;
  console.log(req.query);
  searchFor = chapter_name + "for" + course_name;
  searchHelper.giveResults(searchFor, res);
} 

const getRoutine = async (req, res) => {
  const { year_id, semester_id, department_id } = req.query;
  const day = getDayOfWeek();

  if (!year_id || !semester_id || !department_id) {
    return res.status(400).send({
      message: "Bad Request: year_id and semester_id are required",
    });
  }

  const department = parseInt(department_id);

  if (day != 7) {
    await fetchHelper(
      userQueries.fetchRoutine,
      [year_id, semester_id, day, department],
      res,
      "No routine found",
      "Routine fetched successfully",
    );
  }
  res.status(200).json({
    data: [],
    message: "Saturday. Enjoy your Holiday",
  });
};

module.exports = {
  checkOnboardingStatus,
  userDetails,
  editUserProfile,
  getCourses,
  getChapters,
  getRoutine,
  search,
};