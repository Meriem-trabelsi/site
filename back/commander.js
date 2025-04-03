const express = require('express');
const commanderRoutes = express.Router();
const jwt = require('jsonwebtoken');
const pool = require('./index'); // Assurez-vous que ce fichier exporte bien la connexion MySQL
const bcrypt = require('bcrypt');

// Middleware d'authentification
const verifyAuth = (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: "Accès refusé. Vous devez être connecté pour passer une commande." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.clientID = decoded.client.clientID; // Stocker l'ID du client dans la requête
    next();
  } catch (error) {
    return res.status(403).json({ error: "Session invalide ou expirée. Veuillez vous reconnecter." });
  }
};

// Route pour tester la connexion
commanderRoutes.post("/", (req, res) => {
  console.log("Réception d'une commande:", req.body);
  res.json({ message: "Commande reçue !" });
});

// Route pour passer une commande (seulement si l'utilisateur est authentifié)
commanderRoutes.post('/commander', verifyAuth, async (req, res) => {
  const clientID = req.clientID;

  try {
    // Vérifier que le client existe
    const [clientRows] = await pool.promise().query(
      "SELECT * FROM Client WHERE clientID = ?;",
      [clientID]
    );

    if (clientRows.length === 0) {
      return res.status(404).json({ error: "Client non trouvé. Vérifiez votre compte." });
    }

    // Mise à jour des infos client (pas de fname ici, juste lname, adresse, telephone, region)
    const { lname, adresse, telephone, region } = req.body.client;
    await pool.promise().query(
      "UPDATE Client SET nom = ?, adresse = ?, telephone = ?, region = ? WHERE clientID = ?;",
      [lname, adresse, telephone, region, clientID]
    );

    // Récupération du panier du client
    const [cartRows] = await pool.promise().query(
      "SELECT panierID FROM Panier WHERE clientID = ?;",
      [clientID]
    );

    if (cartRows.length === 0) {
      return res.status(404).json({ error: "Votre panier est vide." });
    }

    const panierID = cartRows[0].panierID;

    // Création de la commande
    const [orderResult] = await pool.promise().query(
      "INSERT INTO Commande (clientID, dateCommande, statut, total) VALUES (?, NOW(), 'en attente', 0);",
      [clientID]
    );

    const orderID = orderResult.insertId;

    // Récupération des produits du panier
    const [cartProducts] = await pool.promise().query(
      `SELECT pp.produitID, pp.quantite, p.prix 
       FROM Panier_Produit pp
       JOIN Produit p ON pp.produitID = p.produitID
       WHERE pp.panierID = ? AND p.clientID = ?;`,
      [panierID, clientID]
    );

    if (cartProducts.length === 0) {
      return res.status(404).json({ error: "Aucun produit trouvé dans le panier." });
    }

    let total = 0;
    const orderProductsQuery = `INSERT INTO Commande_Produit (commandeID, produitID, quantite) VALUES ?;`;
    const orderProductsValues = cartProducts.map(product => {
      total += product.prix * product.quantite;
      return [orderID, product.produitID, product.quantite];
    });

    // Insertion des produits commandés
    await pool.promise().query(orderProductsQuery, [orderProductsValues]);

    // Mise à jour du total de la commande
    await pool.promise().query(
      "UPDATE Commande SET total = ? WHERE commandeID = ?;",
      [total, orderID]
    );

    // Mise à jour du stock des produits
    await pool.promise().query(
      `UPDATE Produit p
       JOIN Panier_Produit pp ON p.produitID = pp.produitID
       SET p.stock = p.stock - pp.quantite
       WHERE pp.panierID = ?;`,
      [panierID]
    );

    // Suppression des produits du panier après validation
    await pool.promise().query("DELETE FROM Panier_Produit WHERE panierID = ?;", [panierID]);

    res.status(200).json({
      message: "Commande validée avec succès !",
      orderID
    });

  } catch (error) {
    console.error("Erreur lors du passage de commande:", error);
    res.status(500).json({ error: "Une erreur est survenue lors du traitement de la commande." });
  }
});

module.exports = commanderRoutes;
