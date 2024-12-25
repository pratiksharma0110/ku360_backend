const pool = require("../database/postgres");

const cheerio = require("cheerio");
const axios = require("axios");

const url = process.env.EXAM_NOTICE_URL;
const examNotices = []; //(post notices to database and query from there)

const getExamPDFLink = async (link) => {
  try {
    const { data } = await axios.get(link);
    const $ = cheerio.load(data);
    const pdfLink = $("main#main .entry-content p a").attr("href");
    return pdfLink;
  } catch (error) {
    console.error(`Error fetching real link from ${link}:`, error.message);
    return null;
  }
};

const getExamNotices = async (req, res) => {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const promises = [];
    $(".archive-content-wrapper").each((index, element) => {
      const content = $(element);

      const title = content.find("h2.entry-title a").text().trim();
      const date = content
        .find("time.entry-date.published.updated")
        .text()
        .trim();
      const noticeLink = content.find("h2.entry-title a").attr("href");
      promises.push(
        getExamPDFLink(noticeLink).then((response) => {
          examNotices.push({
            title,
            link: response,
            date,
          });
        }),
      );
    });

    await Promise.all(promises);
    return res.status(200).json(examNotices);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  getExamNotices,
};
