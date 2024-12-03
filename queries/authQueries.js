const register =
  "INSERT INTO Users(firstname,lastname,email,hashedPassword) VALUES ($1,$2,$3,$4)";
const userExistence =
  " SELECT email,hashedPassword FROM Users WHERE email = $1";
const userId = "SELECT user_id FROM Users WHERE email = $1";

module.exports = {
  register,
  userExistence,
  userId,
};
