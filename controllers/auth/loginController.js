const pool = require("../../database/postgres");
const authQueries = require("../../queries/authQueries");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({
        message: "Please provide all details",
      });

    const userExistence = await pool.query(authQueries.userExistence, [email]);

    if (!userExistence.rows.length)
      return res.status(400).json({
        message: `${email} not registered.`,
      });

    const hashedPassword = userExistence.rows[0].hashedpassword;
    const passwordMatch = await bcrypt.compare(password, hashedPassword);

    if (!passwordMatch)
      return res.status(400).json({ message: "Invalid Password" });

    const userIdresult = await pool.query(authQueries.userId, [email]);
    const userId = userIdresult.rows[0].user_id;

    //note to myself: implement accessToken and refreshToken

    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_LIFE,
    });
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.status(200).send("Logged in successfully!");
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = login;
