const instertIntoProfile =
  "INSERT INTO userprofiles (user_id, school,department, year_id,semester_id,profile_image) VALUES ($1, $2, $3, $4,$5,$6)";

const getProfileByUserId = `
  SELECT * FROM userprofiles WHERE user_id = $1;
`;
const getUserDetails = `
  SELECT 
    u.firstname || ' ' || u.lastname AS full_name,
    u.email,
    up.school,
    up.profile_image,
    up.department,
    y.name AS year_name,     
    s.name AS semester_name 
  FROM users u
  JOIN userprofiles up ON u.user_id = up.user_id
  JOIN years y ON up.year_id = y.id           
  JOIN semesters s ON up.semester_id = s.id  
  WHERE u.user_id = $1;
`;

const extractPassword = "SELECT hashedpassword FROM users WHERE user_id = $1";
const updateFirstname = "UPDATE users SET firstname = $1 WHERE user_id = $2";
const updateLastname = "UPDATE users SET lastname = $1 WHERE user_id = $2";
const updatePassword =
  "UPDATE users SET hashedpassword = $1 WHERE user_id = $2";

const fetchCourse = `
SELECT 
  c.sub_code, 
  c.sub_name, 
  c.pdf_link, 
  c.sub_credit

FROM 
  courses c
JOIN 
  course_semesters cs ON c.id = cs.course_id
JOIN 
  years y ON cs.year_id = y.id
JOIN 
  semesters s ON cs.semester_id = s.id
WHERE 
  y.id = $1  
  AND s.id = $2;
`;
const fetchRoutine = `
Select r.time,c.sub_code,c.sub_name
from routines r
JOIN courses c on r.course_id = c.id
WHERE day = $1

`;

module.exports = {
  instertIntoProfile,
  getUserDetails,
  getProfileByUserId,
  extractPassword,
  updateFirstname,
  updateLastname,
  updatePassword,
  fetchCourse,
  fetchRoutine,
};
