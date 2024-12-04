const instertIntoProfile =
  "INSERT INTO UserProfiles (user_id, school,department, batch) VALUES ($1, $2, $3, $4)";

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
module.exports = { instertIntoProfile, getUserDetails };
