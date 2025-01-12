const fetch = require('node-fetch');
const pdfParse = require('pdf-parse');
const pool = require('../database/postgres');
const userQueries = require('../queries/userQueries');
const userController = require('../controllers/userController');

const fetchChapters = async (subjectId, pdf_link) => {
    const url = pdf_link;
  
    if (!url) {
      throw new Error("Invalid PDF link");
    }
  
    try {
      const response = await fetch(url);
      const pdfBuffer = await response.buffer();
      const pdfData = await pdfParse(pdfBuffer);
      const syllabusText = pdfData.text;
  
      console.log("Extracted Syllabus Text:", syllabusText);
  
      // Extract numbered chapters with detailed content
      const extractDetailedChapters = (text) => {
        // Updated pattern to match chapter number, title, and content
        const chapterPattern = /(\d+)\.\s+([^\n(]+)\s*\(?\d*\)?\s*(?:●[^●\d]*(?:\n|$))*\s*/g;
        const chapters = [];
        let match;

        while ((match = chapterPattern.exec(text)) !== null) {
          // Extract just the chapter number and title
          const chapterNum = match[1];
          const chapterTitle = match[2].trim();
          const fullChapter = `${chapterNum}. ${chapterTitle}`;
          chapters.push(fullChapter);
        }

        return chapters;
      };
      
      // Extract numbered chapters (simpler fallback)
      const extractNumberedChapters = (text) => {
        const chapterPattern = /(\d+)\.\s+([^\n(]+)/gm;
        const chapters = [];
        let match;

        while ((match = chapterPattern.exec(text)) !== null) {
          const chapter = match[0].trim();
          chapters.push(chapter);
        }

        return chapters;
      };

      // Try detailed extraction first
      let chapters = extractDetailedChapters(syllabusText);
      
      // If detailed extraction fails, fall back to simpler pattern
      if (chapters.length === 0) {
        console.log("Falling back to simple numbered chapter extraction");
        chapters = extractNumberedChapters(syllabusText);
      }

      // Filter out chapters based on the conditions
      const filteredChapters = chapters.filter(chapter => {
        const unwantedWords = [
          'subject', 'level', 'description', 'TEXT BOOKS', 'content', 'references'
        ];
        const isValid = unwantedWords.every(word => !chapter.toLowerCase().includes(word.toLowerCase()));
        return isValid;
      });

      console.log("Filtered Chapter Names:", filteredChapters);

      // Insert chapters into the database
      const insertChapters = async (chapters) => {
        try {
          for (let chapter of chapters) {
            const values = [chapter, subjectId];
            await pool.query(userQueries.enterChapter, values);
          }
          console.log("Chapters successfully inserted into the database");
        } catch (err) {
          console.error("Error inserting chapters into database:", err);
        }
      };

      await insertChapters(filteredChapters);

      return {
        subjectId,
        chapters: filteredChapters,
      };
    } catch (error) {
      console.error("Error fetching or parsing PDF:", error);
      throw new Error("Failed to fetch or parse PDF");
    }
};

module.exports = {fetchChapters};