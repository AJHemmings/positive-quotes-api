export default function handler(req, res) {
  try {
    if (req.method !== "GET") {
      return res.status(405).json({
        error: "Method not allowed",
        message: "This endpoint only supports GET requests",
      });
    }

    const { author, limit = 1, format = "json" } = req.query;

    let filteredQuotes = quotes;
    if (author) {
      filteredQuotes = quotes.filter((quote) =>
        quote.author.toLowerCase().includes(author.toLowerCase())
      );

      if (filteredQuotes.length === 0) {
        return res.status(404).json({
          error: "Not found",
          message: `No quotes found for author: ${author}`,
        });
      }
    }

    const numQuotes = Math.min(parseInt(limit, 10) || 1, filteredQuotes.length);

    let result;
    if (numQuotes === 1) {
      const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
      result = filteredQuotes[randomIndex];
    } else {
      result = getMultipleRandomQuotes(filteredQuotes, numQuotes);
    }

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate");

    if (format === "text" && numQuotes === 1) {
      res.setHeader("Content-Type", "text/plain");
      return res.status(200).send(`"${result.quote}" - ${result.author}`);
    } else {
      res.setHeader("Content-Type", "application/json");
      return res.status(200).json({
        count: numQuotes === 1 ? 1 : result.length,
        data: result,
      });
    }
  } catch (error) {
    console.error("Error processing quote request:", error);
    return res.status(500).json({
      error: "Server error",
      message: "An unexpected error occurred",
    });
  }
}

/**
 * Get multiple random quotes without duplicates
 * @param {Array} quotes - Array of quote objects
 * @param {Number} count - Number of quotes to return
 * @return {Array} Array of random quotes
 */
function getMultipleRandomQuotes(quotes, count) {
  // Create a copy to avoid modifying the original array
  const quotesCopy = [...quotes];
  const result = [];

  // Get random quotes until we have enough or run out
  const numToSelect = Math.min(count, quotesCopy.length);

  for (let i = 0; i < numToSelect; i++) {
    // Get a random index from remaining quotes
    const randomIndex = Math.floor(Math.random() * quotesCopy.length);
    // Add the quote to results and remove it from the copy
    result.push(quotesCopy[randomIndex]);
    quotesCopy.splice(randomIndex, 1);
  }

  return result;
}
