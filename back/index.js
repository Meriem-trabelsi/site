const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const clientRoutes = require("./client.js");
const cartRoutes = require("./cart.js");

const app = express();
app.use(cookieParser());
app.use(bodyParser.json());

const corsOptions = {
  origin: "http://localhost:4200",
  credentials: true,
};
app.use(cors(corsOptions));

// Pool configuration
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "admin",
  database: "techshop",
});

// Attach pool to request object
app.use((req, res, next) => {
  req.pool = pool;
  next();
});

// Use API Routes
app.use("/Client", clientRoutes);
app.use("/Cart", cartRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
