// Importation des modules nécessaires
const express = require("express"); // Framework pour créer des applications web
const mysql = require("mysql"); // Module pour interagir avec MySQL
const cors = require("cors"); // Middleware pour gérer les autorisations CORS
const bodyParser = require("body-parser"); // Middleware pour parser les corps de requête en JSON
const cookieParser = require("cookie-parser"); // Middleware pour gérer les cookies
const path = require('path');


// Importation des routes personnalisées
const clientRoutes = require("./client.js"); // Routes liées aux clients
const cartRoutes = require("./cart.js"); // Routes liées au panier
const adoptPetRoutes = require('./adoptPet');
const lostPetRoutes = require('./lostPet');


// Création de l'application Express
const app = express();

// Activation du middleware pour lire les cookies
app.use(cookieParser());

// Activation du middleware pour lire le JSON dans les requêtes
app.use(bodyParser.json());

// Configuration du CORS pour autoriser les requêtes depuis le frontend Angular (localhost:4200)
app.use(cors({
  origin: "http://localhost:4200", // Origine autorisée
  credentials: true, // Autoriser les cookies / sessions
}));

// Configuration du pool de connexions MySQL
const pool = mysql.createPool({
  host: "localhost", 
  port: 3306, 
  user: "root", 
  password: "admin", 
  database: "pawpals", 
});

// Middleware pour attacher le pool MySQL à chaque requête
app.use((req, res, next) => {
  req.pool = pool; // Ajout du pool à l'objet `req`
  next(); // Continuer au middleware suivant
});

// Route GET pour récupérer toutes les catégories
app.get("/categorie", (req, res) => {
  pool.query(`SELECT * FROM Categorie`, (err, results) => {
    if (err) {
      console.error("Erreur lors de la récupération des catégories :", err);
      return res.status(500).json({ error: "Échec de la requête à la base de données" });
    } else {
      res.status(200).json(results); // Retourner la liste des catégories
    }
  });
});

// Route GET pour récupérer les détails d'un produit par ID
app.get("/produit/:id", (req, res) => {
  const productId = req.params.id; // Récupération de l'ID du produit depuis les paramètres d'URL

  // Requête SQL pour récupérer les infos du produit ainsi que le nom de sa catégorie
  const sql = `SELECT produit.*, Categorie.nom 
               FROM produit 
               LEFT JOIN Categorie ON produit.categorieID = Categorie.categorieID
               WHERE produitID = ?`;

  pool.query(sql, [productId], (err, results) => {
    if (err) {
      console.error("Erreur lors de la récupération du produit :", err);
      return res.status(500).json({ error: "Erreur de la base de données" });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "Produit non trouvé" });
    }
    res.status(200).json(results[0]); // Retourner le produit trouvé
  });
});

// Route GET pour récupérer la fiche technique d’un produit
app.get('/fiche-technique/:id', (req, res) => {
  const productId = req.params.id; // Récupération de l'ID du produit

  // Requête SQL pour récupérer les spécifications techniques du produit
  req.pool.query(
    'SELECT specKey, specValue FROM fiche_technique WHERE produitID = ?', productId,
    (err, results) => {
      if (err) {
        console.error('Erreur lors de la récupération des spécifications :', err);
        return res.status(500).json({ error: 'Échec lors de la récupération des spécifications' });
      } else {
        res.status(200).json(results); // Retourner les spécifications techniques
      }
    }
  );
});

// Route GET pour récupérer des produits avec des filtres optionnels (catégorie, prix max)
app.get('/produit', (req, res) => {
  const categoryID = req.query.categoryID; // Récupérer la catégorie depuis les paramètres de requête
  const maxPrice = req.query.maxPrice; // Récupérer le prix max depuis les paramètres de requête

  let query = 'SELECT * FROM produit WHERE 1=1'; // Base de la requête (toujours vraie)
  const params = []; // Tableau pour les paramètres de la requête préparée

  // Si une catégorie est spécifiée, l’ajouter à la requête
  if (categoryID) {
    query += ' AND categorieID = ?';
    params.push(categoryID);
  }

  // Si un prix max est spécifié, l’ajouter à la requête
  if (maxPrice) {
    query += ' AND prix <= ?';
    params.push(maxPrice);
  }
  
  // Exécuter la requête avec les paramètres
  pool.query(query, params, (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des produits :', err);
      return res.status(500).json({ error: 'Échec lors de la récupération des produits' });
    }
    res.status(200).json(results); // Retourner la liste des produits trouvés
  });
});

// Enregistrement des routes personnalisées pour les clients et le panier
app.use("/Client", clientRoutes); 
app.use("/Cart", cartRoutes); 
app.use('/adoptPet', adoptPetRoutes);
app.use('/lostPet', lostPetRoutes);
app.use('/assets/uploads', express.static(path.join(__dirname, 'assets', 'uploads')));  // Serve static files from back/assets/uploads
app.use('/assets/uploadslost', express.static(path.join(__dirname, 'assets', 'uploadslost')));  // Serve static files from back/assets/uploads





// Démarrage du serveur sur le port 5000
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
