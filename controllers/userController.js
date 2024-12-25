const pool = require("../database/postgres");
const userQueries = require("../queries/userQueries");

const userDetails = async (req, res) => {
  try {
    const userId = req.user;
    if (!userId) {
      return res.status(400).json({
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

const editUserProfile = async (req, res) => { };

module.exports = {
  userDetails,
};
