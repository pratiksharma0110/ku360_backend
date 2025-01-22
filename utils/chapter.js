require("dotenv").config();
const { OpenAI } = require("openai");
const fetch = globalThis.fetch;
const pdfParse = require("pdf-parse");
const pool = require('../database/postgres');
const userQueries = require('../queries/userQueries');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const insertChaptersAndSubtopics = async (chapters, subjectId) => {
  try {
    for (let chapter of chapters) {
      const chapterValues = [chapter.name, subjectId]; 
      const chapterResult = await pool.query(userQueries.enterChapter, chapterValues);
      const chapterId = chapterResult.rows[0].id;
      if (chapter.subtopics && chapter.subtopics.length > 0) {
        for (let subtopic of chapter.subtopics) {
          const subtopicValues = [subtopic, chapterId]; 
          await pool.query('INSERT INTO topics (topic, chapter) VALUES ($1, $2)', subtopicValues);
        }
      }
    }
    console.log("Chapters and subtopics inserted successfully.");
  } catch (error) {
    console.error("Error inserting chapters and subtopics:", error);
    throw new Error("Failed to insert chapters or subtopics into the database");
  }
};

const fetchChapters = async (subjectId, pdf_link) => {
  try {
    if (!pdf_link) throw new Error("Invalid PDF link");

    // Fetch and parse the PDF
    const response = await fetch(pdf_link);
    const pdfBuffer = Buffer.from(await response.arrayBuffer());
    const { text: syllabusText } = await pdfParse(pdfBuffer);
    console.log("Extracted Syllabus Text:", syllabusText);

    const prompt = `
      Extract all chapter names and their numbers and must list in numbers (Eg 1. Kinetic Energy)
      For each chapter, list its subtopics as bullet points (e.g., "- Area between curves"). If subtopics are separated by commas or listed in paragraph form, convert them into a bulleted list.
      Ensure chapter names and subtopics are understandable and properly formatted. Resolve any inconsistencies in the text.
      If no chapters or subtopics are found, return "No chapters" or "No subtopics" as appropriate.
      Ignore sections such as "References" or "Textbooks" or any unrelated content.
      Maintain a clear and consistent structure in the output.
      Text: ${syllabusText}
      Extracted Chapters and Subtopics:
    `;
  
    const aiResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1500,
    });

    const extractedData = aiResponse.choices[0].message.content.trim();
    console.log("Extracted Data:", extractedData);

    const chapterRegex = /(\d+\.\s*.+)/gm;
    const subtopicRegex = /^\s*-+\s*(.+)$/gm;

    const chapters = [];
    let currentChapter = null;

    const lines = extractedData.split("\n");
    for (const line of lines) {
      const chapterMatch = line.match(chapterRegex);
      if (chapterMatch) {
        if (currentChapter) chapters.push(currentChapter);
        const chapterName = chapterMatch[0].trim();
        currentChapter = { name: chapterName, subtopics: [] };
      } else if (currentChapter) {
        const subtopicMatch = line.match(/^\s*-\s*(.+)$/);

        if (subtopicMatch && subtopicMatch[1]) {
          const cleanedSubtopic = subtopicMatch[1].trim();
          currentChapter.subtopics.push(cleanedSubtopic);
        }
      }
    }
    if (currentChapter) chapters.push(currentChapter);

    console.log("Parsed Chapters:");
    chapters.forEach((chapter) => {
      console.log(`${chapter.name}`);
      if (chapter.subtopics.length > 0) {
        console.log("  Subtopics:");
        chapter.subtopics.forEach((subtopic) => {
          console.log(`    ${subtopic}`);
        });
      } else {
        console.log("  No subtopics found.");
      }
    });

    await insertChaptersAndSubtopics(chapters, subjectId);

    return { subjectId, chapters };
  } catch (error) {
    console.error("Error:", error);
    throw new Error("No chapter to fetch from the PDF");
  }
};

module.exports = { fetchChapters };