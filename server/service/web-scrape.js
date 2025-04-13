import axios from "axios";
import { load } from "cheerio";
import { htmlToText } from 'html-to-text'; // Import the library

const extractReadableText = async (url) => {
  try {
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/110 Safari/537.36",
      },
    });

    const $ = load(data);

    // --- Keep title extraction ---
    const title = $("title").text().trim();

    // --- Remove unwanted tags BEFORE selecting main content ---
    // Note: Removing them first can sometimes simplify selection
    $("script, style, noscript, iframe, nav, footer, header, aside, form").remove();

    // --- Select the main content area (as a Cheerio object) ---
    // Find the container first, don't get .text() yet
    let mainContentContainer =
      $("main").first() ||
      $('[role="main"]').first() ||
      $(".content, .post, .article, article").first() ||
      $('[id*="content"], [class*="content"]').first();

    // If no specific container is found, fall back to body
    if (!mainContentContainer || mainContentContainer.length === 0) {
        mainContentContainer = $("body");
    }

    // Check if we found *any* container
    if (!mainContentContainer || mainContentContainer.length === 0) {
       console.warn("Could not find main content container.");
       return { title, text: "" }; // Return title with empty text maybe?
    }

    // --- Get the HTML of the selected container ---
    const mainHtml = mainContentContainer.html();

    if (!mainHtml) {
        console.warn("Main content container was empty.");
        return { title, text: "" };
    }

    // --- Convert HTML to formatted text ---
    const formattedText = htmlToText(mainHtml, {
      wordwrap: 100, // Optional: wrap lines at 100 characters
      selectors: [
        // Optional: Define how specific tags are handled
        // { selector: 'a', options: { ignoreHref: true } }, // Example: ignore link URLs
        // { selector: 'img', format: 'skip' }, // Example: skip images
      ],
      // Add more options as needed: https://www.npmjs.com/package/html-to-text#options
    });

    // --- Clean up potential excessive whitespace from conversion (optional) ---
    const cleanedText = formattedText
        .replace(/\n{3,}/g, '\n\n') // Reduce 3+ newlines to 2
        .trim();

    return { title, text: cleanedText };

  } catch (error) {
    // Consider logging the specific URL that failed
    console.error(`Error processing URL ${url}:`, error.message);
    // Check for specific Axios errors if needed
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Headers:', error.response.headers);
    } else if (error.request) {
      console.error('No response received:', error.request);
    }
    return null; // Indicate failure
  }
};

export default extractReadableText;