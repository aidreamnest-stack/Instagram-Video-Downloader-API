const express = require("express");
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.json({ message: "Test Server Running!" });
});

app.listen(port, () => {
  console.log(`Test server is running at http://localhost:${port}`);
});
