// Importation des modules nécessaires
const express = require('express');
const cartRoutes = express.Router();
const jwt = require('jsonwebtoken');
require('dotenv').config(); //Charge les variables d'environnement (comme la clé secrète JWT)

//Récupérer le panier d'un client 
cartRoutes.get('/fetch', async (req, res) => {
    const pool = req.pool; 
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1]; 
    const decoded = jwt.verify(token, process.env.JWT_SECRET); 
    const clientID = decoded.client.clientID; 

    if (!token) {
        return res.status(401).json({ error: "Access denied, missing token." }); 
    }

    try {
        // Vérifie que l'utilisateur accède bien à son propre panier
        if (decoded.client.clientID !== parseInt(clientID)) {
            return res.status(403).json({ error: "Access denied." });
        }

        // Requête SQL pour récupérer les produits du panier
        const cartQuery = `
            SELECT pp.produitID, p.nom, p.prix, pp.quantite, 
                   (p.prix * pp.quantite) as total_ligne,
                   p.imageUrl
            FROM Panier_Produit pp
            JOIN Produit p ON pp.produitID = p.produitID
            JOIN Panier pa ON pp.panierID = pa.panierID
            WHERE pa.clientID = ?
        `;

        // Exécution de la requête avec promise
        const cartProducts = await new Promise((resolve, reject) => {
            pool.query(cartQuery, [clientID], (error, results) => {
                if (error) reject(error);
                else resolve(results);
            });
        });

        // Calcul du total du panier
        const totalCart = cartProducts.reduce((sum, item) => sum + item.total_ligne, 0);

        // Envoi des données du panier
        res.status(200).json({
            produits: cartProducts,
            total: totalCart
        });

    } catch (error) {
        console.error('Error retrieving cart:', error);

        // Gestion des erreurs liées au token
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: "Token invalid." });
        }

        // Erreur serveur
        res.status(500).json({ error: "An error occurred while retrieving the cart." });
    }
});

// Ajouter un produit au panier 
cartRoutes.post('/add', async (req, res) => {
    const pool = req.pool;
    const { produitID, quantite } = req.body; // Récupération des données envoyées dans le corps de la requête
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: "Access denied, missing token." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const clientID = decoded.client.clientID;

        // Vérifie si le panier existe déjà pour ce client
        const cartRows = await new Promise((resolve, reject) => {
            pool.query("SELECT panierID FROM Panier WHERE clientID = ?", [clientID], (error, rows) => {
                if (error) reject(error);
                else resolve(rows);
            });
        });

        let panierID = cartRows[0].panierID;

        // Vérifie si le produit est déjà présent dans le panier
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
            // Mise à jour de la quantité si le produit est déjà dans le panier
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
            // Insertion du produit s'il n'existe pas encore dans le panier
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

        res.status(200).json({ message: "Product added to cart" });
    } catch (error) {
        console.error("Error adding to cart:", error);

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: "Token invalid." });
        }

        res.status(500).json({ error: "An error occurred while adding the product to the cart." });
    }
});

//  Mettre à jour la quantité d’un produit
cartRoutes.put('/update', async (req, res) => {
    const pool = req.pool;
    const { produitID, quantite } = req.body;
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: "Acces denied,missing token." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const clientID = decoded.client.clientID;

        // Récupération du panier lié au client
        const cartRows = await new Promise((resolve, reject) => {
            pool.query("SELECT panierID FROM Panier WHERE clientID = ?", [clientID], (error, rows) => {
                if (error) reject(error);
                else resolve(rows);
            });
        });

        if (cartRows.length === 0) {
            return res.status(404).json({ error: "Cart not found." });
        }

        const panierID = cartRows[0].panierID;

        // Vérifie la quantité actuelle dans le panier
        const currentQuantityQuery = "SELECT quantite FROM Panier_Produit WHERE panierID = ? AND produitID = ?";
        const currentQuantityResult = await new Promise((resolve, reject) => {
            pool.query(currentQuantityQuery, [panierID, produitID], (error, rows) => {
                if (error) reject(error);
                else if (rows.length === 0) reject(new Error('Product not found in cart'));
                else resolve(rows[0].quantite);
            });
        });

        // Si la quantité est la même, ne rien changer
        if (quantite === currentQuantityResult) {
            await new Promise((resolve, reject) => {
                pool.query(
                    "UPDATE Panier_Produit SET quantite = ? WHERE panierID = ? AND produitID = ?",
                    [quantite, panierID, produitID],
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
            });
            return res.status(200).json({ message: "Quantity updated successfully." });
        }

        // Vérifie le stock disponible pour ce produit
        const stockQuery = "SELECT stock FROM Produit WHERE produitID = ?";
        const stockResult = await new Promise((resolve, reject) => {
            pool.query(stockQuery, [produitID], (error, rows) => {
                if (error) reject(error);
                else resolve(rows[0].stock);
            });
        });

        if (quantite > stockResult) {
            return res.status(400).json({ error: "The quantity requested is more than what we have in stock." });
        }

        // Mise à jour de la quantité dans le panier
        await new Promise((resolve, reject) => {
            pool.query(
                "UPDATE Panier_Produit SET quantite = ? WHERE panierID = ? AND produitID = ?",
                [quantite, panierID, produitID],
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
        });

        res.status(200).json({ message: "Quantity updated and stock adjusted." });
    } catch (error) {
        console.error("Error updating quantity.", error);

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: "Token invalid." });
        }

        res.status(500).json({ error: "An error occured while updating the quantity" });
    }
});

// Supprimer un produit du panier 
cartRoutes.delete('/remove', async (req, res) => {
    const pool = req.pool;
    const { produitID } = req.body;
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: "Acces denied, token missing." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const clientID = decoded.client.clientID;

        // Récupère le panier du client
        const cartRows = await new Promise((resolve, reject) => {
            pool.query("SELECT panierID FROM Panier WHERE clientID = ?", [clientID], (error, rows) => {
                if (error) reject(error);
                else resolve(rows);
            });
        });

        const panierID = cartRows[0].panierID;

        // Suppression du produit du panier
        await new Promise((resolve, reject) => {
            pool.query(
                "DELETE FROM Panier_Produit WHERE panierID = ? AND produitID = ?",
                [panierID, produitID],
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
        });

        res.status(200).json({ message: "Product deleted from cart successfully" });
    } catch (error) {
        console.error("Error deleting product:", error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: "Token invalid." });
        }
        res.status(500).json({ error: "An error occured while deleting the product" });
    }
});

// Passer commande 
cartRoutes.post('/commander', async (req, res) => {
    const pool = req.pool;
    const token = req.cookies.token; // Récupère le token depuis les cookies

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const clientID = decoded.client.clientID;

        // Vérifie si le client a un panier
        const cartRows = await new Promise((resolve, reject) => {
            pool.query("SELECT panierID FROM Panier WHERE clientID = ?", [clientID], (error, rows) => {
                if (error) reject(error);
                else resolve(rows);
            });
        });

        const panierID = cartRows[0].panierID;

        // Récupère les produits dans le panier
        const cartProducts = await new Promise((resolve, reject) => {
            pool.query(
                "SELECT produitID, quantite FROM Panier_Produit WHERE panierID = ?",
                [panierID],
                (error, rows) => {
                    if (error) reject(error);
                    else resolve(rows);
                }
            );
        });

        if (cartProducts.length === 0) {
            return res.status(400).json({ error: "Your cart is empty" });
        }

        // Calcul du total de la commande
        const totalCommande = await new Promise((resolve, reject) => {
            pool.query(
                `SELECT SUM(p.prix * pp.quantite) AS total 
                 FROM Panier_Produit pp 
                 JOIN Produit p ON pp.produitID = p.produitID 
                 WHERE pp.panierID = ?`,
                [panierID],
                (error, results) => {
                    if (error) reject(error);
                    else resolve(results[0].total);
                }
            );
        });

        // Insertion de la commande
        const commandeResult = await new Promise((resolve, reject) => {
            pool.query(
                "INSERT INTO Commande (clientID, dateCommande, statut, total) VALUES (?, NOW(), 'En attente', ?)",
                [clientID, totalCommande],
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
        });

        const commandeID = commandeResult.insertId;

        // Insertion des produits dans la commande + mise à jour du stock
        for (const item of cartProducts) {
            await new Promise((resolve, reject) => {
                pool.query(
                    "INSERT INTO Commande_Produit (commandeID, produitID, quantite) VALUES (?, ?, ?)",
                    [commandeID, item.produitID, item.quantite],
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
            });

            await new Promise((resolve, reject) => {
                pool.query(
                    "UPDATE Produit SET stock = stock - ? WHERE produitID = ?",
                    [item.quantite, item.produitID],
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
            });
        }

        // Vider le panier
        await new Promise((resolve, reject) => {
            pool.query(
                "DELETE FROM Panier_Produit WHERE panierID = ?",
                [panierID],
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
        });

        res.status(200).json({ message: "Your order has been placed successfully", commandeID });
    } catch (error) {
        console.error("Error while placing the order:", error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: "Token invalid." });
        }
        res.status(500).json({ error: "An error occurred while placing the order." });
    }
});

module.exports = cartRoutes; // Exportation des routes pour les utiliser ailleurs dans l'application
