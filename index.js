const express = require("express");
const app = express();
const snapsave = require("./snapsave-downloader/src/index");
const port = 3000;
const path = require("path");

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Add CORS headers for API requests
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});


console.log("=".repeat(50));
console.log("Instagram Video Downloader API");
console.log("=".repeat(50));

app.get("/api", (req, res) => {
  console.log("GET /api - API info endpoint accessed");
  res.json({
    message: "Instagram Video Downloader API is running!",
    version: "2.0.0",
    endpoints: {
      web: "/",
      download: "/igdl?url=<instagram_url>",
      api_info: "/api"
    }
  });
});

app.get("/igdl", async (req, res) => {
  try {
    const url = req.query.url;
    console.log(`GET /igdl - Request received for URL: ${url}`);

    if (!url) {
      console.log("Error: URL parameter is missing");
      return res.status(400).json({ error: "URL parameter is missing" });
    }

    console.log("Processing download request...");
    const downloadedURL = await snapsave(url);
    console.log("Download successful!");
    res.json({ url: downloadedURL });
  } catch (err) {
    console.error("Error occurred:", err.message);

    // Fallback Code
    try {
      console.log("Attempting fallback with instagram-url-direct...");
      const instagramGetUrl = require("instagram-url-direct");
      const results = await instagramGetUrl(url);
      if (results.url_list.length > 0) {
        console.log("Fallback successful!");
        return res.json({ url: results.url_list[0] });
      }
    } catch (fallbackErr) {
      console.error("Fallback failed:", fallbackErr.message);
    }

    console.error("Stack trace:", err.stack);
    // Return the actual error message to the client for debugging
    res.status(500).json({ error: err.message || "Internal Server Error", details: err.stack });
  }
});

app.listen(port, () => {
  console.log("");
  console.log("✓ Server started successfully!");
  console.log(`✓ Server is running at http://localhost:${port}`);
  console.log("✓ API endpoint: GET /igdl?url=<instagram_url>");
  console.log("");
  console.log("Server is ready to accept requests...");
  console.log("Press Ctrl+C to stop the server");
  console.log("=".repeat(50));
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
