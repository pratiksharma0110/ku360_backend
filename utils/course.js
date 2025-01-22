const axios = require('axios');
const cheerio = require('cheerio');
const pool = require('../database/postgres');
const userQueries = require('../queries/userQueries');

const getCourseUrlByDepartmentId = (departmentId) => {
  switch (departmentId) {
    case '1':
      return 'https://comp.ku.edu.np/static-page/course-catalog-bsc-computer-science';
    case '2':
      return 'https://comp.ku.edu.np/static-page/course-catalog-be-computer-engineering';
    default:
      return null;
  }
};

const fetchCourseCatalog = async (departmentId, res) => {
  console.log("Fetching courses for department:", departmentId);

  const url = getCourseUrlByDepartmentId(departmentId);

  if (!url) {
    return res.status(400).json({ message: 'Invalid department_id' });
  }

  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const promises = [];

    $('h3').each((_, semesterHeader) => {
      const semesterText = $(semesterHeader).text().trim();
      const semesterMatch = semesterText.match(/Year\/ Semester \( (\w+)\/(\w+) \)/);

      if (semesterMatch) {
        const year = semesterMatch[1];
        const semester = semesterMatch[2];
        const table = $(semesterHeader).next('table');

        table.find('tbody tr').each((_, row) => {
          const columns = $(row).find('td');
          if (columns.length >= 3) {
            const code = $(columns[0]).text().trim();
            const subject = $(columns[1]).text().trim();
            const credit = $(columns[2]).text().trim();
            const syllabusLink = $(columns[1]).find('a').attr('href');

            if (code && subject && credit && syllabusLink) {
              const subjectData = [
                year,
                semester,
                code,
                subject,
                syllabusLink,
                credit,
                departmentId,
              ];

              // Push each database query as a promise
              promises.push(
                pool.query(userQueries.enterSubjects, subjectData)
                  .then(() => {
                    console.log(`Inserted: ${code} - ${subject}`);
                  })
                  .catch((error) => {
                    console.error('Error inserting subject:', error.message);
                  })
              );
            }
          }
        });
      }
    });

    await Promise.all(promises);

    res.status(200).json({ message: 'Courses fetched and inserted successfully' });
  } catch (error) {
    console.error('Error fetching or processing data:', error.message);
    res.status(500).json({ message: error.message });
  }
};


module.exports = { fetchCourseCatalog };

