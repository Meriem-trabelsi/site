const express = require("express");
const app = express();

app.use(express.json()); // Middleware for JSON parsing

app.get("/", (req, res) => {
  res.send("Hello, Express Backend!");
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});