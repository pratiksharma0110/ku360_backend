require("dotenv").config();
const axios = require('axios');

/**
 * Function to get search results from Google Custom Search API
 * @param {string} query
 * @returns {Promise<Object[]>}
 */
const getGoogleSearchResults = async (query) => {
    const API_KEY = process.env.API_KEY; // your API key here
    const SEARCH_ENGINE_ID = process.env.SEARCH_ENGINE_ID; // your Search Engine ID here

    const apiUrl = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&key=${API_KEY}&cx=${SEARCH_ENGINE_ID}`;
    console.log(`Fetching search results for query: ${query}`);
    console.log(apiUrl);
    let allResults = [];
    let startIndex = 1;

    try {
        // Fetching the first page of results
        const response = await axios.get(apiUrl + `&start=${startIndex}`);

        if (response.data.items) {
            console.log(`Found ${response.data.items.length} results for query starting at index ${startIndex}`);
            
            const results = response.data.items
                .map((item) => {
                    const title = item.title.toLowerCase();
                    const link = item.link.toLowerCase();
                    const snippet = item.snippet;

                    const unwantedKeywords = ["catalog", "university", "Syllabus", "Course Desciptions"];
                    if (
                        unwantedKeywords.some((keyword) => 
                            title.includes(keyword) || link.includes(keyword)
                        )
                    ) {
                        return null; 
                    }

                    return {
                        title: item.title,
                        link: item.link,
                        snippet,
                    };
                })
                .filter((result) => result !== null); // Remove null values

            allResults = allResults.concat(results);
        } else {
            console.log("No results found.");
        }

        // Returning results
        return allResults;
    } catch (error) {
        console.error(`Error fetching Google search results: ${error.message}`);
        return [];
    }
};

const giveResults = async (topic, res) => {
    const results = await getGoogleSearchResults(topic);

    console.log(`Top search results for "${topic}":`);
    if (results.length === 0) {
        console.log("No relevant results found.");
    } else {
        results.forEach((result, index) => {
            console.log(`${index + 1}. ${result.title}: ${result.link}`);
        });
    }
    res.json(results);
};

module.exports = { giveResults };
