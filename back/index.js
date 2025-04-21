// Importing required modules
const express = require("express"); // Framework to create web applications
const mysql = require("mysql"); // Module to interact with MySQL
const cors = require("cors"); // Middleware to handle CORS
const bodyParser = require("body-parser"); // Middleware to parse JSON request bodies
const cookieParser = require("cookie-parser"); // Middleware to handle cookies
const path = require('path');

// Importing custom routes
const clientRoutes = require("./client.js"); // Routes related to clients
const cartRoutes = require("./cart.js"); // Routes related to the cart
const adoptPetRoutes = require('./adoptPet');
const lostPetRoutes = require('./lostPet');

// Creating the Express app
const app = express();

// Enable middleware to read cookies
app.use(cookieParser());

// Enable middleware to read JSON from requests
app.use(bodyParser.json());

// CORS configuration to allow requests from Angular frontend (localhost:4200)
app.use(cors({
  origin: "http://localhost:4200", // Allowed origin
  credentials: true, // Allow cookies/sessions
}));

// MySQL connection pool configuration
const pool = mysql.createPool({
  host: "localhost", 
  port: 3306, 
  user: "root", 
  password: "admin", 
  database: "pawpals", 
});

// Middleware to attach the MySQL pool to each request
app.use((req, res, next) => {
  req.pool = pool; // Add the pool to the `req` object
  next(); // Continue to the next middleware
});

// GET route to fetch all categories
app.get("/categorie", (req, res) => {
  pool.query(`SELECT * FROM Categorie`, (err, results) => {
    if (err) {
      console.error("Error fetching categories:", err);
      return res.status(500).json({ error: "Database request failed" });
    } else {
      res.status(200).json(results); // Return the list of categories
    }
  });
});

// GET route to fetch product details by ID
app.get("/produit/:id", (req, res) => {
  const productId = req.params.id; // Get product ID from URL parameters

  // SQL query to fetch product info and its category name
  const sql = `SELECT produit.*, Categorie.nom 
               FROM produit 
               LEFT JOIN Categorie ON produit.categorieID = Categorie.categorieID
               WHERE produitID = ?`;

  pool.query(sql, [productId], (err, results) => {
    if (err) {
      console.error("Error fetching product:", err);
      return res.status(500).json({ error: "Database error" });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json(results[0]); // Return the found product
  });
});

// GET route to fetch the technical sheet of a product
app.get('/fiche-technique/:id', (req, res) => {
  const productId = req.params.id; // Get product ID

  // SQL query to fetch product specifications
  req.pool.query(
    'SELECT specKey, specValue FROM fiche_technique WHERE produitID = ?', productId,
    (err, results) => {
      if (err) {
        console.error('Error fetching specifications:', err);
        return res.status(500).json({ error: 'Failed to fetch specifications' });
      } else {
        res.status(200).json(results); // Return the specifications
      }
    }
  );
});

// GET route to fetch products with optional filters (category, max price)
app.get('/produit', (req, res) => {
  const categoryID = req.query.categoryID; // Get category from query params
  const maxPrice = req.query.maxPrice; // Get max price from query params

  let query = 'SELECT * FROM produit WHERE 1=1'; // Base query (always true)
  const params = []; // Parameters for prepared statement

  // If category is specified, add it to the query
  if (categoryID) {
    query += ' AND categorieID = ?';
    params.push(categoryID);
  }

  // If max price is specified, add it to the query
  if (maxPrice) {
    query += ' AND prix <= ?';
    params.push(maxPrice);
  }
  
  // Execute the query with parameters
  pool.query(query, params, (err, results) => {
    if (err) {
      console.error('Error fetching products:', err);
      return res.status(500).json({ error: 'Failed to fetch products' });
    }
    res.status(200).json(results); // Return the found products
  });
});

// Register custom routes for client and cart
app.use("/Client", clientRoutes); 
app.use("/Cart", cartRoutes); 
app.use('/adoptPet', adoptPetRoutes);
app.use('/lostPet', lostPetRoutes);
app.use('/assets/uploads', express.static(path.join(__dirname, 'assets', 'uploads')));  // Serve static files from back/assets/uploads
app.use('/assets/uploadslost', express.static(path.join(__dirname, 'assets', 'uploadslost')));  // Serve static files from back/assets/uploadslost

// Start the server on port 5000
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
