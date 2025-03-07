const express = require("express");
const mysql = require("mysql");
const cors = require('cors');
const app = express();


app.use(bodyParser.json());
const corsOptions = {
  origin: 'http://localhost:4200/',
  credentials: true,
};
app.use(cors(corsOptions));


// Pool configuration
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'techshop'
});


app.get("/", (req, res) => {
  res.send("Hello, Express Backend!");
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});