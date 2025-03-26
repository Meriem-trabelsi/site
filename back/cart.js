const express = require('express');
const cartRoutes = express.Router();

// Helper function to get panierID for a client
async function getPanierID(pool, clientID) {
    const [panier] = await pool.query("SELECT panierID FROM Panier WHERE clientID = ?", [clientID]);
    if (panier.length === 0) {
        const [result] = await pool.query("INSERT INTO Panier (clientID) VALUES (?)", [clientID]);
        return result.insertId;
    }
    return panier[0].panierID;
}

// ✅ Récupérer le panier d'un client
cartRoutes.get('/:clientID', async (req, res) => {
    const pool = req.pool;
    const clientID = req.params.clientID;

    try {
        const [rows] = await pool.query(`
            SELECT p.produitID, p.nom, p.description, p.prix, p.imageURL, pp.quantite 
            FROM Panier_Produit pp
            JOIN Produit p ON pp.produitID = p.produitID
            JOIN Panier pan ON pp.panierID = pan.panierID
            WHERE pan.clientID = ?
        `, [clientID]);

        res.status(200).json({ panier: rows });
    } catch (error) {
        console.error("Erreur lors de la récupération du panier :", error);
        res.status(500).json({ error: "Erreur lors de la récupération du panier." });
    }
});

// ✅ Ajouter un produit au panier
cartRoutes.post('/add', async (req, res) => {
    const pool = req.pool;
    const { clientID, produitID, quantite } = req.body;

    try {
        // Vérifier si le panier existe
        let [panier] = await pool.query("SELECT panierID FROM Panier WHERE clientID = ?", [clientID]);

        let panierID;
        if (panier.length === 0) {
            const [result] = await pool.query("INSERT INTO Panier (clientID) VALUES (?)", [clientID]);
            panierID = result.insertId;
        } else {
            panierID = panier[0].panierID;
        }

        // Vérifier si le produit est déjà dans le panier
        let [existingProduct] = await pool.query("SELECT quantite FROM Panier_Produit WHERE panierID = ? AND produitID = ?", [panierID, produitID]);

        if (existingProduct.length > 0) {
            await pool.query("UPDATE Panier_Produit SET quantite = quantite + ? WHERE panierID = ? AND produitID = ?", [quantite, panierID, produitID]);
        } else {
            await pool.query("INSERT INTO Panier_Produit (panierID, produitID, quantite) VALUES (?, ?, ?)", [panierID, produitID, quantite]);
        }

        res.status(200).json({ message: "Produit ajouté au panier" });
    } catch (error) {
        console.error("Erreur lors de l'ajout au panier :", error);
        res.status(500).json({ error: "Erreur lors de l'ajout au panier." });
    }
});

//  Modifier la quantité d'un produit dans le panier
cartRoutes.put('/update', async (req, res) => {
    const pool = req.pool;
    const { clientID, produitID, quantite } = req.body;

    try {
        let [panier] = await pool.query("SELECT panierID FROM Panier WHERE clientID = ?", [clientID]);
        if (panier.length === 0) return res.status(404).json({ error: "Panier non trouvé." });

        await pool.query("UPDATE Panier_Produit SET quantite = ? WHERE panierID = ? AND produitID = ?", [quantite, panier[0].panierID, produitID]);

        res.status(200).json({ message: "Quantité mise à jour" });
    } catch (error) {
        console.error("Erreur lors de la mise à jour du panier :", error);
        res.status(500).json({ error: "Erreur lors de la mise à jour du panier." });
    }
});

// Supprimer un produit du panier
cartRoutes.delete('/remove', async (req, res) => {
    const pool = req.pool;
    const { clientID, produitID } = req.body;

    try {
        let [panier] = await pool.query("SELECT panierID FROM Panier WHERE clientID = ?", [clientID]);
        if (panier.length === 0) return res.status(404).json({ error: "Panier non trouvé." });

        await pool.query("DELETE FROM Panier_Produit WHERE panierID = ? AND produitID = ?", [panier[0].panierID, produitID]);

        res.status(200).json({ message: "Produit retiré du panier" });
    } catch (error) {
        console.error("Erreur lors de la suppression du produit :", error);
        res.status(500).json({ error: "Erreur lors de la suppression du produit." });
    }
});

module.exports = cartRoutes;
