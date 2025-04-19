// Importation des modules nécessaires
const express = require('express');
const clientRoutes = express.Router(); // Création du routeur pour les routes client
const bcrypt = require('bcrypt'); // Pour le hachage des mots de passe
const jwt = require('jsonwebtoken'); // Pour la génération et la vérification des tokens JWT
const nodemailer = require('nodemailer'); // Pour l'envoi d'e-mails
require('dotenv').config(); // Chargement des variables d'environnement

// Configuration du transporteur pour l'envoi d'e-mails via Gmail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL,
        pass: process.env.PASS
    }
});

// Fonction pour générer un code de vérification aléatoire à 8 chiffres
function generateVerificationCode() {
    return Math.floor(10000000 + Math.random() * 90000000);
}

// Route d'inscription d'un nouveau client
clientRoutes.post('/registerClient', async (req, res) => {
    const pool = req.pool; // Récupération de la connexion à la base de données
    const { name, email, password, address, tel, region } = req.body; // Données du corps de la requête

    try {
        // Hachage du mot de passe avec bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);

        // Requête SQL pour insérer le client dans la base de données
        const sql = 'INSERT INTO Client (nom, email, motdepasse, adresse, tel, region) VALUES (?, ?, ?, ?, ?, ?)';
        const values = [name, email, hashedPassword, address, tel, region];

        // Exécution de la requête
        pool.query(sql, values, (error, result) => {
            if (error) {
                console.error('Erreur lors de l\'inscription du client :  ' + error);
                return res.status(500).json({ error: 'Une erreur est survenue lors de l\'inscription du client.' });
            }

            // Création d’un panier associé au client nouvellement inscrit
            pool.query("INSERT INTO Panier (clientID) VALUES (?)", [result.insertId], (error, result) => {
                if (error) reject(error);
            });

            // Envoi d’un e-mail de bienvenue
            transporter.sendMail({
                from: process.env.JWT_MAIL,
                to: email,
                subject: 'Bienvenue chez Techshop',
                text: 'Merci pour votre inscription à notre site !'
            }, (error, info) => {
                if (error) {
                    console.error('Erreur lors de l\'envoi de l\'email :', error);
                } else {
                    console.log('Email envoyé :', info.response);
                }
            });

            // Réponse succès
            return res.status(201).json({ message: 'Client inscrit avec succès', clientId: result.insertId });
        });
    } catch (error) {
        console.error('Erreur lors du hachage du mot de passe :', error);
        return res.status(500).json({ error: 'Une erreur est survenue lors du hachage du mot de passe.' });
    }
});

// Route de connexion d’un client
clientRoutes.post('/loginClient', async (req, res) => {
    const pool = req.pool;
    const { email, password, rememberme } = req.body;

    try {
        // Recherche du client par email
        const query = 'SELECT * FROM Client WHERE email = ?';
        pool.query(query, [email], async (error, results) => {
            if (error) {
                console.error('Erreur lors de la recherche du client :', error);
                return res.status(500).json({ error: 'Erreur dans la base de données' });
            }

            // Vérification si le client existe
            if (results.length === 0) {
                return res.status(404).json({ error: 'Client non trouvé.' });
            }

            const client = results[0];

            // Comparaison du mot de passe haché
            const passwordMatch = await bcrypt.compare(password, client.motdepasse);
            if (!passwordMatch) {
                return res.status(401).json({ error: 'Mot de passe invalide.' });
            }

            // Création d’un token JWT
            const expiresIn = rememberme ? '30d' : '1d'; // Durée de validité du token
            const token = jwt.sign({ client: client }, process.env.JWT_SECRET, { expiresIn });

            // Envoi du token dans un cookie sécurisé
            res.cookie('token', token, {
                httpOnly: true,
                maxAge: rememberme ? 30 * 24 * 60 * 60 * 1000 : undefined
            });

            // Réponse succès
            res.status(200).json({ message: 'Connexion réussie', token: token });
        });
    } catch (error) {
        console.error('Erreur lors de la connexion :', error);
        return res.status(500).json({ error: 'Une erreur est survenue lors de la connexion.' });
    }
});

// Route pour mot de passe oublié
clientRoutes.post('/forgotpassword', async (req, res) => {
    const pool = req.pool;
    const { email } = req.body;

    try {
        // Vérifie si l'e-mail existe
        const query = 'SELECT * FROM Client WHERE email = ?';
        pool.query(query, [email], async (error, results) => {
            if (error) {
                console.error('Erreur lors de la recherche du client :', error);
                return res.status(500).json({ error: 'Erreur interne.' });
            }

            if (results.length === 0) {
                return res.status(404).json({ error: 'Client non trouvé.' });
            }

            // Génère un code de vérification et l'envoie par mail
            const verificationCode = generateVerificationCode();
            transporter.sendMail({
                from: process.env.JWT_MAIL,
                to: email,
                subject: 'Demande de changement de mot de passe',
                text: `Votre code de vérification est: ${verificationCode}`
            }, (error, info) => {
                if (error) {
                    console.error('Erreur lors de l\'envoi de l\'email :', error);
                    return res.status(500).json({ error: 'Erreur lors de l\'envoi du code.' });
                } else {
                    console.log('Email envoyé :', info.response);
                    return res.status(200).json({ code: verificationCode });
                }
            });
        });
    } catch (error) {
        console.error('Erreur globale :', error);
        return res.status(500).json({ error: 'Erreur lors du processus de mot de passe oublié.' });
    }
});

// Route pour changer le mot de passe
clientRoutes.post('/changepass', async (req, res) => {
    const pool = req.pool;
    const { email, newPassword } = req.body;

    try {
        // Vérifie si l'utilisateur existe
        const query = 'SELECT * FROM Client WHERE email = ?';
        pool.query(query, [email], async (error, results) => {
            if (error) {
                console.error('Erreur lors de la recherche du client :', error);
                return res.status(500).json({ error: 'Erreur interne.' });
            }

            if (results.length === 0) {
                return res.status(404).json({ error: 'Client non trouvé.' });
            }

            // Hachage du nouveau mot de passe
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            // Mise à jour du mot de passe
            const updateQuery = 'UPDATE Client SET motdepasse = ? WHERE email = ?';
            pool.query(updateQuery, [hashedPassword, email], (error, result) => {
                if (error) {
                    console.error('Erreur lors de la mise à jour du mot de passe :', error);
                    return res.status(500).json({ error: 'Erreur lors du changement.' });
                }

                // Envoi d’un mail de confirmation
                transporter.sendMail({
                    from: process.env.JWT_MAIL,
                    to: email,
                    subject: 'Votre mot de passe a été changé',
                    text: 'Votre mot de passe a été changé avec succès !'
                }, (error, info) => {
                    if (error) console.error('Erreur lors de l\'envoi de l\'email :', error);
                    else console.log('Email envoyé :', info.response);
                });

                res.status(200).json({ message: 'Mot de passe changé avec succès' });
            });
        });
    } catch (error) {
        console.error('Erreur globale :', error);
        return res.status(500).json({ error: 'Erreur lors du changement du mot de passe.' });
    }
});

// Route pour vérifier si le client est authentifié
clientRoutes.get('/checkAuth', async (req, res) => {
    const token = req.cookies.token; // Récupération du token depuis les cookies

    if (!token) {
        return res.status(401).json({ error: 'Aucun token fourni, authentification requise.' });
    }

    try {
        // Vérification du token
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({ error: 'Token invalide ou expiré.' });
            }

            const client = decoded.client;
            res.status(200).json({ message: 'Client authentifié', client });
        });
    } catch (error) {
        console.error('Erreur de vérification :', error);
        return res.status(500).json({ error: 'Erreur lors de la vérification du token.' });
    }
});

// Route pour déconnexion
clientRoutes.post('/logout', async (req, res) => {
    res.clearCookie('token'); // Suppression du cookie de session
    res.status(200).json({ message: 'Déconnexion réussie' });
});

// Route pour récupérer les infos du client
clientRoutes.get('/getClientInfo', async (req, res) => {
    const pool = req.pool;
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ error: 'Token requis pour accéder à ces données.' });
    }

    try {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({ error: 'Token invalide ou expiré.' });
            }

            const clientID = decoded.client.clientID;
            const query = 'SELECT nom, region, adresse, tel, email FROM Client WHERE clientID = ?';

            pool.query(query, [clientID], (error, results) => {
                if (error) {
                    console.error('Erreur lors de la récupération :', error);
                    return res.status(500).json({ error: 'Erreur lors de la récupération des données.' });
                }

                if (results.length === 0) {
                    return res.status(404).json({ error: 'Client non trouvé.' });
                }

                res.status(200).json(results[0]);
            });
        });
    } catch (error) {
        console.error('Erreur globale :', error);
        return res.status(500).json({ error: 'Erreur de vérification.' });
    }
});


// Route pour mettre à jour les infos du client
clientRoutes.put('/updateClientInfo', async (req, res) => {
    const pool = req.pool;
    const token = req.cookies.token;
    const { nom, region, adresse, tel } = req.body;

    if (!token) {
        return res.status(401).json({ error: 'Token requis pour mise à jour.' });
    }

    try {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({ error: 'Token invalide ou expiré.' });
            }

            const clientID = decoded.client.clientID;
            const query = 'UPDATE Client SET nom = ?, region = ?, adresse = ?, tel = ? WHERE clientID = ?';

            pool.query(query, [nom, region, adresse, tel, clientID], (error, result) => {
                if (error) {
                    console.error('Erreur lors de la mise à jour :', error);
                    return res.status(500).json({ error: 'Erreur lors de la mise à jour.' });
                }

                if (result.affectedRows === 0) {
                    return res.status(404).json({ error: 'Client non trouvé ou aucune modification.' });
                }

                res.status(200).json({ message: 'Mise à jour réussie.' });
            });
        });
    } catch (error) {
        console.error('Erreur globale :', error);
        return res.status(500).json({ error: 'Erreur lors de la mise à jour.' });
    }
});

// Exportation du routeur client
module.exports = clientRoutes;
