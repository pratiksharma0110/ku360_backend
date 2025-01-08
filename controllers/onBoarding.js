const pool = require("../database/postgres");
const userQueries = require("../queries/userQueries");
//this is only called once;
const onBoarding = async (req, res) => {
  try {
    const userId = req.user;
    if (!userId) {
      return res.status(400).json({
        message: "User ID is missing. Please log in again.",
      });
    }

    const existingProfile = await pool.query(userQueries.getProfileByUserId, [
      userId,
    ]);

    if (existingProfile.rows.length > 0) {
      return res.status(400).json({
        message: "Onboarding already completed.",
      });
    }

    const { school, department, year, semester, profile_image } = req.body;

    if (!school || !department || !year || !semester) {
      return res.status(400).json({
        message: "Please provide all details",
      });
    }
    const userProfile = [
      userId,
      school,
      department,
      year,
      semester,
      profile_image || process.env.DEFAULT_PIC,
    ];
    await pool.query(userQueries.instertIntoProfile, userProfile);

    res.status(200).json({
      message: "Onboarding completed successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: `Error completing onboarding: ${err.message}`,
    });
  }
};

module.exports = onBoarding;
