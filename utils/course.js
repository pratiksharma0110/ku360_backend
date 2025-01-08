const cheerio = require("cheerio");
const axios = require("axios");

const url =
  "https://comp.ku.edu.np/static-page/course-catalog-bsc-computer-science";

const courseContents = [];

const courseContent = async () => {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const tableRows = $("table tbody tr");
    tableRows.slice(1).each((index, element) => {
      const content = $(element);
      const subCode = content.find("td").eq(0).text().trim();
      const subName = content.find("td").eq(1).text().trim();
      const pdfLink = content.find("td").eq(1).find("a").attr("href");
      const subCredit = content.find("td").eq(2).text().trim();

      if (subCode != "") {
        courseContents.push({
          subCode,
          subName,
          pdfLink,
          subCredit,
        });
      }
    });
    console.log(courseContents);
  } catch (error) {
    console.error("Error fetching or processing data:", error.message);
  }
};

courseContent();
