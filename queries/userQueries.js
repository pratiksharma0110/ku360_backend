const instertIntoProfile =
  "INSERT INTO userprofiles (user_id, school,department_id, year_id,semester_id,profile_image,has_onboarded) VALUES ($1, $2, $3, $4,$5,$6,$7)";

const getProfileByUserId = `
  SELECT * FROM userprofiles WHERE user_id = $1;
`;
const getUserDetails = `
  SELECT 
    u.firstname || ' ' || u.lastname AS full_name,
    u.email,
    up.school,
    up.profile_image,
    up.department_id,
    d.name AS department,
    y.name AS year_name,     
    s.name AS semester_name 
  FROM users u
  JOIN userprofiles up ON u.user_id = up.user_id
  JOIN years y ON up.year_id = y.id           
  JOIN semesters s ON up.semester_id = s.id 
  JOIN departments d ON up.department_id = d.id
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
  course_semesters cs ON c.sub_code = cs.sub_code
JOIN 
  years y ON cs.year_id = y.id
JOIN 
  semesters s ON cs.semester_id = s.id
WHERE 
  y.id = $1  
  AND s.id = $2;
`;
const fetchRoutine = `
SELECT 
  r.sub_code,
  c.sub_name,
  COALESCE(t.title || ' ', '') || t.firstname || ' ' || t.lastname AS instructor_name,
  r.time 
FROM routines r
JOIN teachers t ON r.teacher_id = t.teacher_id
JOIN courses c ON r.sub_code = c.sub_code
WHERE r.years_id = $1
  AND r.semester_id = $2 
  AND r.day = $3
  AND r.department_id = $4;
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
