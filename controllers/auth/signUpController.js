const pool = require("../../database/postgres");
const authQueries = require("../../queries/authQueries");
const bcrypt = require("bcrypt");

const signUp = async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;

    if (!firstname || !lastname || !email || !password) {
      return res.status(400).json({
        message: "Please provide all details",
      });
    }

    const duplicateUser = await pool.query(authQueries.userId, [email]);

    if (duplicateUser.rows.length) {
      return res.status(409).json({ message: "Email already in use." });
    }

    const saltRounds = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = [firstname, lastname, email, hashedPassword];

    await pool.query(authQueries.register, user);

    res.status(200).json({
      message: `User ${email} Registered successfully`,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      message: `${err.message}`,
    });
  }
};

module.exports = signUp;
