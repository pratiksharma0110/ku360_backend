const jwt = require("jsonwebtoken");

const verifyToken = (req, res) => {
  try {
    return res.status(200).json({ valid: true, user: req.user });
  } catch (error) {
    return res
      .status(401)
      .json({ valid: false, message: "Invalid or expired token" });
  }
};

module.exports = verifyToken;
