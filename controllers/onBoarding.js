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

    const { department, year, semester } = req.body;

    if (!department || !year || !semester) {
      return res.status(400).json({
        message: "Please provide all details",
      });
    }
    const userProfile = [userId, department, year, semester];
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
