const express = require('express');
const cartRoutes = express.Router();
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Récupérer le panier d'un client
cartRoutes.get('/fetch', async (req, res) => {
    const pool = req.pool;
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, 'mariem');
    const clientID = decoded.client.clientID;

    if (!token) {
        return res.status(401).json({ error: "Accès refusé, token manquant." });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Ensure the user is accessing their own cart
        if (decoded.client.clientID !== parseInt(clientID)) {
            return res.status(403).json({ error: "Accès non autorisé." });
        }

        // Fetch the cart and its products
        const cartQuery = `
            SELECT pp.produitID, p.nom, p.prix, pp.quantite, 
                   (p.prix * pp.quantite) as total_ligne
            FROM Panier_Produit pp
            JOIN Produit p ON pp.produitID = p.produitID
            JOIN Panier pa ON pp.panierID = pa.panierID
            WHERE pa.clientID = ?
        `;

        const cartProducts = await new Promise((resolve, reject) => {
            pool.query(cartQuery, [clientID], (error, results) => {
                if (error) reject(error);
                else resolve(results);
            });
        });
        // Calculate total cart value
        const totalCart = cartProducts.reduce((sum, item) => sum + item.total_ligne, 0);

        res.status(200).json({
            produits: cartProducts,
            total: totalCart
        });
    } catch (error) {
        console.error('Erreur lors de la récupération du panier:', error);
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: "Token invalide." });
        }
        
        res.status(500).json({ error: "Une erreur est survenue lors de la récupération du panier." });
    }
});

// ✅ Ajouter un produit au panier
cartRoutes.post('/add', async (req, res) => {
    const pool = req.pool;
    const { produitID, quantite } = req.body;
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: "Accès refusé, token manquant." });
    }

    try {
        // Extract clientID from token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const clientID = decoded.client.clientID;

        // Check if the cart exists
        const cartRows = await new Promise((resolve, reject) => {
            pool.query("SELECT panierID FROM Panier WHERE clientID = ?", [clientID], (error, rows) => {
                if (error) reject(error);
                else resolve(rows);
            });
        });

        let panierID;
        if (cartRows.length === 0) {
            // Create a new cart
            const cartResult = await new Promise((resolve, reject) => {
                pool.query("INSERT INTO Panier (clientID) VALUES (?)", [clientID], (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                });
            });
            panierID = cartResult.insertId;
        } else {
            panierID = cartRows[0].panierID;
        }        

        // Check if the product is already in the cart
        const existingProductRows = await new Promise((resolve, reject) => {
            pool.query(
                "SELECT quantite FROM Panier_Produit WHERE panierID = ? AND produitID = ?",
                [panierID, produitID],
                (error, rows) => {
                    if (error) reject(error);
                    else resolve(rows);
                }
            );
        });

        if (existingProductRows.length > 0) {
            // Update existing product quantity
            await new Promise((resolve, reject) => {
                pool.query(
                    "UPDATE Panier_Produit SET quantite = quantite + ? WHERE panierID = ? AND produitID = ?",
                    [quantite, panierID, produitID],
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
            });
        } else {
            // Insert new product to cart
            await new Promise((resolve, reject) => {
                pool.query(
                    "INSERT INTO Panier_Produit (panierID, produitID, quantite) VALUES (?, ?, ?)",
                    [panierID, produitID, quantite],
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
            });
        }

        res.status(200).json({ message: "Produit ajouté au panier" });
    } catch (error) {
        console.error('Erreur lors de l\'ajout au panier:', error);
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: "Token invalide." });
        }
        
        res.status(500).json({ error: "Une erreur est survenue lors de l'ajout du produit au panier." });
    }
});

// Modifier la quantité d'un produit dans le panier
cartRoutes.put('/update', async (req, res) => {
    const pool = req.pool;
    const { produitID, quantite } = req.body;
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: "Accès refusé, token manquant." });
    }

    try {
        // Verify token and get client ID
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const clientID = decoded.client.clientID;

        // Find the cart for this client
        const cartRows = await new Promise((resolve, reject) => {
            pool.query("SELECT panierID FROM Panier WHERE clientID = ?", [clientID], (error, rows) => {
                if (error) reject(error);
                else resolve(rows);
            });
        });

        if (cartRows.length === 0) {
            return res.status(404).json({ error: "Panier non trouvé." });
        }

        const panierID = cartRows[0].panierID;

        // Update product quantity in cart
        await new Promise((resolve, reject) => {
            pool.query(
                "UPDATE Panier_Produit SET quantite = ? WHERE panierID = ? AND produitID = ?",
                [quantite, panierID, produitID],
                (error, result) => {
                    if (error) reject(error);
                    else if (result.affectedRows === 0) reject(new Error('Produit non trouvé dans le panier'));
                    else resolve(result);
                }
            );
        });

        res.status(200).json({ message: "Quantité mise à jour avec succès" });
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la quantité:', error);
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: "Token invalide." });
        }
        
        res.status(500).json({ error: "Une erreur est survenue lors de la mise à jour de la quantité." });
    }
});

// Supprimer un produit du panier
cartRoutes.delete('/remove', async (req, res) => {
    const pool = req.pool;
    const { produitID } = req.body;
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: "Accès refusé, token manquant." });
    }

    try {
        // Verify token and get client ID
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const clientID = decoded.client.clientID;

        // Find the cart for this client
        const cartRows = await new Promise((resolve, reject) => {
            pool.query("SELECT panierID FROM Panier WHERE clientID = ?", [clientID], (error, rows) => {
                if (error) reject(error);
                else resolve(rows);
            });
        });

        if (cartRows.length === 0) {
            return res.status(404).json({ error: "Panier non trouvé." });
        }

        const panierID = cartRows[0].panierID;

        // Remove product from cart
        await new Promise((resolve, reject) => {
            pool.query(
                "DELETE FROM Panier_Produit WHERE panierID = ? AND produitID = ?",
                [panierID, produitID],
                (error, result) => {
                    if (error) reject(error);
                    else if (result.affectedRows === 0) reject(new Error('Produit non trouvé dans le panier'));
                    else resolve(result);
                }
            );
        });

        res.status(200).json({ message: "Produit supprimé du panier avec succès" });
    } catch (error) {
        console.error('Erreur lors de la suppression du produit:', error);
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: "Token invalide." });
        }
        
        res.status(500).json({ error: "Une erreur est survenue lors de la suppression du produit." });
    }
});

module.exports = cartRoutes;