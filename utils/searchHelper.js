require("dotenv").config();
const axios = require('axios');

/**
 * Function to get search results from Google Custom Search API
 * @param {string} query 
 * @returns {Promise<Object[]>} 
 */
const getGoogleSearchResults = async (query) => {
    const API_KEY = process.env.API_KEY;
    const SEARCH_ENGINE_ID = process.env.SEARCH_ENGINE_ID;
    
    const apiUrl = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&key=${API_KEY}&cx=${SEARCH_ENGINE_ID}`;
    console.log(`Fetching search results for query: ${query}`);

    let allResults = [];
    let startIndex = 1; // Google Custom Search API returns a maximum of 10 results per request, start with index 1
    
    try {
        // Loop to fetch multiple pages of results if needed
        while (allResults.length < 10) {
            const response = await axios.get(apiUrl + `&start=${startIndex}`);
            
            if (response.data.items) {
                console.log(`Found ${response.data.items.length} results for query starting at index ${startIndex}`);
                const results = await Promise.all(response.data.items.map(async (item) => {
                    const title = item.title;
                    const link = item.link;
                    const snippet = item.snippet;  // Short description of the page
                    const thumbnail = item.pagemap?.cse_image?.[0]?.src || '';  // Extract thumbnail if available
                    const isVideo = isYouTubeVideo(link); // Check if it's a YouTube video using the URL
                    
                    // Filter results based on keywords in title or snippet (like tutorial, course, guide, etc.)
                    const isRelevant = filterEducationalContent(title, snippet);

                    if (isRelevant) {
                        return {
                            title,
                            link,
                            snippet,
                            thumbnail, // No favicon logic here
                            isVideo,
                            titleScore: calculateTitleScore(title) // Calculate score based on keywords in title
                        };
                    }
                    return null; // Skip irrelevant results
                }));

                // Filter out null values and add to the final list of all results
                allResults = allResults.concat(results.filter(result => result !== null));

                // If there are fewer than 10 results, fetch the next page
                if (allResults.length < 10) {
                    startIndex += 10; // Move to the next set of results
                }
            } else {
                console.log('No results found.');
                break; // Exit if no more results are available
            }
        }

        // Sort results based on titleScore
        return allResults.sort((a, b) => b.titleScore - a.titleScore).slice(0, 10); // Return the top 10 results
    } catch (error) {
        console.error(`Error fetching Google search results: ${error.message}`);
        return [];
    }
};

/**
 * Function to check if a given URL is a YouTube video
 * @param {string} url - The URL to check
 * @returns {boolean} - Returns true if it's a YouTube video link, false otherwise
 */
const isYouTubeVideo = (url) => {
    return url.includes("youtube.com") || url.includes("youtu.be");
};

/**
 * Function to calculate score based on keywords in the title
 * @param {string} title - The title of the search result
 * @returns {number} - Returns a score based on how many relevant keywords are found in the title
 */
const calculateTitleScore = (title) => {
    const relevantKeywords = ['youtube', 'tutorial', 'course', 'guide', 'lesson', 'video', 'introduction', 'learning', 'lecture', 'exam', 'study', 'tutorial video'];
    let score = 0;

    // Convert title to lowercase and count relevant keywords
    const lowerCaseTitle = title.toLowerCase();

    relevantKeywords.forEach(keyword => {
        if (lowerCaseTitle.includes(keyword)) {
            score += 1;  // Increase score for each relevant keyword found in the title
        }
    });

    return score;
};

/**
 * Function to filter results to only include educational content, excluding course catalogs or university descriptions
 * @param {string} title - The title of the search result
 * @param {string} snippet - The snippet/description of the result
 * @returns {boolean} - Returns true if the result is educational, false otherwise
 */
const filterEducationalContent = (title, snippet) => {
    const relevantKeywords = [
        'tutorial', 'course', 'guide', 'lesson', 'lecture', 'study', 
        'exam', 'learning', 'video', 'introduction'
    ];

    const excludedKeywords = [
        'course catalog', 'university', 'degree', 'college course', 'program', 'online course', 'admissions', 'campus', 'scholarship', 'study abroad'
    ];

    // Convert title and snippet to lowercase and check for relevant and excluded keywords
    const combinedText = (title + " " + snippet).toLowerCase();

    // Check if any excluded keywords are present in the text
    const isExcluded = excludedKeywords.some(keyword => combinedText.includes(keyword));

    // Only return true if the result is relevant and not excluded
    return relevantKeywords.some(keyword => combinedText.includes(keyword)) && !isExcluded;
};

/**
 * Function to give results with detailed data (including title, link, thumbnail, etc.)
 * @param {string} topic - Search topic
 * @param {Object} res - Response object to send results
 */
const giveResults = async (topic, res) => {
    const results = await getGoogleSearchResults(topic);
    
    console.log(`Top search results for "${topic}":`);
    if (results.length === 0) {
        console.log('No relevant results found.');
    } else {
        results.forEach((result, index) => {
            console.log(`${index + 1}. ${result.title}: ${result.link}`);
        });
    }

    // Send the results back to the Flutter app
    res.json(results);
};

module.exports = { giveResults };
