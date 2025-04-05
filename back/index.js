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

app.use(cors({
  origin: "http://localhost:4200",
  credentials: true,
}));

// Pool configuration
const pool = mysql.createPool({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "admin",
  database: "techshop",
});

// Attach pool to request object
app.use((req, res, next) => {
  req.pool = pool;
  next();
});

// Route to Fetch All categories
app.get("/categorie", (req, res) => {
  pool.query(`SELECT * FROM Categorie`, (err, results) => {
    if (err) {
      console.error("Error fetching categories:", err);
      return res.status(500).json({ error: "Database query failed" });
    } else {
      res.status(200).json(results);
    }
  });
});

app.get("/produit/:id", (req, res) => {
  const productId = req.params.id;
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
    res.status(200).json(results[0]);
  });
});

app.get('/fiche-technique/:id', (req, res) => {
  const productId = req.params.id;
  req.pool.query(
    'SELECT specKey, specValue FROM fiche_technique WHERE produitID = ?', productId,
    (err, results) => {
      if (err) {
        console.error('Error fetching specifications:', err);
        return res.status(500).json({ error: 'Failed to fetch specifications' });
      } else {
        res.status(200).json(results);
      }
    }
  );
});

app.get('/produit', (req, res) => {
  const categoryID = req.query.categoryID;
  const maxPrice = req.query.maxPrice;
  let query = 'SELECT * FROM produit WHERE 1=1';
  const params = [];

  if (categoryID) {
    query += ' AND categorieID = ?';
    params.push(categoryID);
  }

  if (maxPrice) {
    query += ' AND prix <= ?';
    params.push(maxPrice);
  }
  
  pool.query(query, params, (err, results) => {
    if (err) {
      console.error('Error fetching products:', err);
      return res.status(500).json({ error: 'Failed to fetch products' });
    }
    res.status(200).json(results);
  });
});

// Use API Routes
app.use("/Client", clientRoutes);
app.use("/Cart", cartRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
