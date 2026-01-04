const express = require("express");
const app = express();
const snapsave = require("./snapsave-downloader/src/index");
const port = 3000;

console.log("=".repeat(50));
console.log("Instagram Video Downloader API");
console.log("=".repeat(50));

app.get("/", (req, res) => {
  console.log("GET / - Root endpoint accessed");
  res.json({
    message: "Instagram Video Downloader API is running!",
    endpoints: {
      download: "/igdl?url=<instagram_url>"
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
    console.error("Stack trace:", err.stack);
    res.status(500).json({ error: "Internal Server Error", details: err.message });
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
