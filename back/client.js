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
                console.error('Error during client registration: ' + error);
                return res.status(500).json({ error: 'An error occured during your signup' });
            }

            // Création d’un panier associé au client nouvellement inscrit
            pool.query("INSERT INTO Panier (clientID) VALUES (?)", [result.insertId], (error, result) => {
                if (error) reject(error);
            });

            // Envoi d’un e-mail de bienvenue
            transporter.sendMail({
                from: process.env.JWT_MAIL,
                to: email,
                subject: 'Welcome to PawPals',
                text: 'Thank you for signing up on our website!'
            }, (error, info) => {
                if (error) {
                    console.error('Email sending error', error);
                } else {
                    console.log('Email sent successfully:', info.response);
                }
            });

            // Réponse succès
            return res.status(201).json({ message: 'Client sign up successfull', clientId: result.insertId });
        });
    } catch (error) {
        console.error('Error during password hashing:', error);
        return res.status(500).json({ error: 'An error occurred while hashing the password.' });
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
                console.error('Error while searching for client:', error);
                return res.status(500).json({ error: 'Database error' });
            }

            // Vérification si le client existe
            if (results.length === 0) {
                return res.status(404).json({ error: 'Client not found.' });
            }

            const client = results[0];

            // Comparaison du mot de passe haché
            const passwordMatch = await bcrypt.compare(password, client.motdepasse);
            if (!passwordMatch) {
                return res.status(401).json({ error: 'Invalid password.' });
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
            res.status(200).json({ message: 'Login successful', token: token });
        });
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ error: 'An error occurred during login.' });
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
                console.error('Error while searching for client:', error);
                return res.status(500).json({ error: 'Internal error.' });
            }

            if (results.length === 0) {
                return res.status(404).json({ error: 'Client not found.' });
            }

            // Génère un code de vérification et l'envoie par mail
            const verificationCode = generateVerificationCode();
            transporter.sendMail({
                from: process.env.JWT_MAIL,
                to: email,
                subject: 'Password change request',
                text: `Your verification code is: ${verificationCode}`
            }, (error, info) => {
                if (error) {
                    console.error('Error sending email:', error);
                    return res.status(500).json({ error: 'Error sending code:' });
                } else {
                    console.log('Email sent:', info.response);
                    return res.status(200).json({ code: verificationCode });
                }
            });
        });
    } catch (error) {
        console.error('Global error', error);
        return res.status(500).json({ error: 'Error during forgot password process.' });
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
                console.error('Error while searching for client:', error);
                return res.status(500).json({ error: 'Internal error.' });
            }

            if (results.length === 0) {
                return res.status(404).json({ error: 'Client not found.' });
            }

            // Hachage du nouveau mot de passe
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            // Mise à jour du mot de passe
            const updateQuery = 'UPDATE Client SET motdepasse = ? WHERE email = ?';
            pool.query(updateQuery, [hashedPassword, email], (error, result) => {
                if (error) {
                    console.error('Error updating password', error);
                    return res.status(500).json({ error: 'Error during password change.' });
                }

                // Envoi d’un mail de confirmation
                transporter.sendMail({
                    from: process.env.JWT_MAIL,
                    to: email,
                    subject: 'Your password has been changed',
                    text: 'Your password was successfully changed!'
                }, (error, info) => {
                    if (error) console.error('Error sending email:', error);
                    else console.log('Email sent :', info.response);
                });

                res.status(200).json({ message: 'Password changed successfully' });
            });
        });
    } catch (error) {
        console.error('Global error:', error);
        return res.status(500).json({ error: 'Error during password change.' });
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
                return res.status(401).json({ error: 'Invalid or expired token.' });
            }

            const client = decoded.client;
            res.status(200).json({ message: 'Client authenticated', client });
        });
    } catch (error) {
        console.error('Verification error:', error);
        return res.status(500).json({ error: 'Error verifying token.' });
    }
});

// Route pour déconnexion
clientRoutes.post('/logout', async (req, res) => {
    res.clearCookie('token'); // Suppression du cookie de session
    res.status(200).json({ message: 'Logout successful' });
});

// Route pour récupérer les infos du client
clientRoutes.get('/getClientInfo', async (req, res) => {
    const pool = req.pool;
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ error: 'Token required to access this data.' });
    }

    try {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({ error: 'Invalid or expired token.' });
            }

            const clientID = decoded.client.clientID;
            const query = 'SELECT nom, region, adresse, tel, email FROM Client WHERE clientID = ?';

            pool.query(query, [clientID], (error, results) => {
                if (error) {
                    console.error('Error retrieving data:', error);
                    return res.status(500).json({ error: 'Error retrieving data.' });
                }

                if (results.length === 0) {
                    return res.status(404).json({ error: 'Client not found' });
                }

                res.status(200).json(results[0]);
            });
        });
    } catch (error) {
        console.error('global error :', error);
        return res.status(500).json({ error: 'Verification error' });
    }
});


// Route pour mettre à jour les infos du client
clientRoutes.put('/updateClientInfo', async (req, res) => {
    const pool = req.pool;
    const token = req.cookies.token;
    const { nom, region, adresse, tel } = req.body;

    if (!token) {
        return res.status(401).json({ error: 'Token required for update.' });
    }

    try {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({ error: 'Invalid or expired token.' });
            }

            const clientID = decoded.client.clientID;
            const query = 'UPDATE Client SET nom = ?, region = ?, adresse = ?, tel = ? WHERE clientID = ?';

            pool.query(query, [nom, region, adresse, tel, clientID], (error, result) => {
                if (error) {
                    console.error('Error during update:', error);
                    return res.status(500).json({ error: 'Error during update' });
                }

                if (result.affectedRows === 0) {
                    return res.status(404).json({ error: 'Client not found or no changes made.' });
                }

                res.status(200).json({ message: 'Update successful.' });
            });
        });
    } catch (error) {
        console.error('Global error', error);
        return res.status(500).json({ error: 'Error during update.' });
    }
});

// Exportation du routeur client
module.exports = clientRoutes;
