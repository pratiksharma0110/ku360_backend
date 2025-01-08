const pool = require("../database/postgres");
const bcrypt = require("bcrypt");
const userQueries = require("../queries/userQueries");
const getDayOfWeek = require("../utils/day");
const fetchHelper = require("../utils/fetchHelper");

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
const getCourses = async (req, res) => {
  const { year_id, semester_id } = req.query;

  if (!year_id || !semester_id) {
    return res.status(400).send({
      message: "Bad Request: year_id and semester_id are required",
    });
  }

  await fetchHelper(
    userQueries.fetchCourse,
    [year_id, semester_id],
    res,
    "No courses found for the specified year and semester",
    "Courses fetched successfully",
  );
};

const getRoutine = async (req, res) => {
  const today = getDayOfWeek();

  await fetchHelper(
    userQueries.fetchRoutine,
    [today],
    res,
    "No routine found",
    "Routine fetched successfully",
  );
};

module.exports = {
  userDetails,
  editUserProfile,
  getCourses,
  getRoutine,
};
