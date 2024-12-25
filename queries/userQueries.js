const instertIntoProfile =
  "INSERT INTO userprofiles (user_id, school,department, year,semester) VALUES ($1, $2, $3, $4,$5)";

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
module.exports = { instertIntoProfile, getUserDetails, getProfileByUserId };
