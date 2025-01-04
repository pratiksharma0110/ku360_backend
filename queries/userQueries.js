const instertIntoProfile =
  "INSERT INTO userprofiles (user_id, school,department, year,semester,profile_image) VALUES ($1, $2, $3, $4,$5,$6)";

const getProfileByUserId = `
  SELECT * FROM userprofiles WHERE user_id = $1;
`;
const getUserDetails = `
      SELECT 
        u.firstname || ' ' || u.lastname AS full_name,
        u.email,
        up.department,
        up.year,
        up.semester
      FROM users u
      JOIN userprofiles up ON u.user_id = up.user_id
      WHERE u.user_id = $1;
    `;
const extractPassword = "SELECT hashedpassword FROM users WHERE user_id = $1";
const updateFirstname = "UPDATE users SET firstname = $1 WHERE user_id = $2";
const updateLastname = "UPDATE users SET lastname = $1 WHERE user_id = $2";
const updatePassword =
  "UPDATE users SET hashedpassword = $1 WHERE user_id = $2";

module.exports = {
  instertIntoProfile,
  getUserDetails,
  getProfileByUserId,
  extractPassword,
  updateFirstname,
  updateLastname,
  updatePassword,
};
