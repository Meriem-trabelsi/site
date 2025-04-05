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
  password: /*"admin"*/ "eE3cm77A71i23z" ,
  database: "techshop",
});

// Attach pool to request object
app.use((req, res, next) => {
  req.pool = pool;
  next();
});

// Route to Fetch All products
app.get("/produit", (req, res) => {
  const categoryID = req.query.categoryID;
  let sql = `SELECT produit.*, Categorie.nom 
              FROM produit
              LEFT JOIN Categorie ON produit.categorieID = Categorie.categorieID`;

  const params = [];
  if (categoryID) {
    sql += ` WHERE produit.categorieID = ?`;
    params.push(categoryID);
  }

  pool.query(sql, params, (err, results) => {
    if (err) {
      console.error("Error fetching products:", err);
      return res.status(500).json({ error: "Database query failed" });
    } else {
      console.log(results)
      res.status(200).json(results);
    }
  });
});

// Route to Fetch All categories
app.get("/categorie", (req, res) => {
  pool.query(`SELECT * FROM Categorie`, (err, results) => {
    if (err) {
      console.error("Error fetching categories:", err);
      return res.status(500).json({ error: "Database query failed" });
    } else {
      console.log(results)
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

app.get('/fiche-technique/:productId', (req, res) => {
    const {productId} = req.params;
    const specs = pool.query(
      'SELECT specKey, specValue FROM fiche_technique WHERE produitID = ?',
      [productId]);
    res.json(specs);
});

// Use API Routes
app.use("/Client", clientRoutes);
app.use("/Cart", cartRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
