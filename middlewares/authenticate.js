const jwt = require("jsonwebtoken");

const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader)
      return res.status(401).json({
        message: "Access denied",
      });
    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({
          message: "Invalid or expired token.",
        });
      }
      req.user = decoded.userId;
      next();
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal Sever Error",
    });
  }
};

module.exports = authenticateUser;
