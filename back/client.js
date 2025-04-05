const express = require('express');
const clientRoutes = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL,
        pass: process.env.PASS
    }
  });

  function generateVerificationCode() {
    return Math.floor(10000000 + Math.random() * 90000000);
}

clientRoutes.post('/registerClient', async (req, res) => {
    const pool = req.pool;
    const { name, email, password, address, tel, region } = req.body;
    
    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = 'INSERT INTO Client (nom, email, motdepasse, adresse, tel, region) VALUES (?, ?, ?, ?, ?, ?)';
        const values = [name, email, hashedPassword, address, tel, region];

        pool.query(sql, values, (error, result) => {
            if (error) {
                console.error('Erreur lors de l\'inscription du client :  ' + error);
                return res.status(500).json({ error: 'Une erreur est survenue lors de l\'inscription du client.' });
            }
            // Create a new cart
            pool.query("INSERT INTO Panier (clientID) VALUES (?)", [result.insertId], (error, result) => {
                if (error) reject(error);
            });
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
            return res.status(201).json({ message: 'Client inscrit avec succès', clientId: result.insertId });
        });
    } catch (error) {
        console.error('Erreur lors du hachage du mot de passe :', error);
        return res.status(500).json({ error: 'An error occurred while hashing the password.' });
    }
});

// Route to login client
clientRoutes.post('/loginClient', async (req, res) => {
    const pool = req.pool;
    const { email, password, rememberme } = req.body;

    try {
        const query = 'SELECT * FROM Client WHERE email = ?';
        pool.query(query, [email], async (error, results) => {
            if (error) {
                console.error('Erreur lors de la recherche du client :', error);
                return res.status(500).json({ error: 'Erreur dans la base de données' });
            }

            if (results.length === 0) {
                return res.status(404).json({ error: 'Client non trouvé.' });
            }

            const client = results[0];

            // 🔹 Compare passwords safely
            const passwordMatch = await bcrypt.compare(password, client.motdepasse);
            if (!passwordMatch) {
                return res.status(401).json({ error: 'Mot de passe invalide.' });
            }

            // 🔹 Generate JWT token
            const expiresIn = rememberme ? '30d' : '1d';
            const token = jwt.sign({ client: client}, process.env.JWT_SECRET, { expiresIn });            
            res.cookie('token', token, { httpOnly: true, maxAge: rememberme ? 30 * 24 * 60 * 60 * 1000 : undefined });
            res.status(200).json({ message: 'Connexion réussie', token: token });

        });
    } catch (error) {
        console.error('Erreur lors de la connexion :', error);
        return res.status(500).json({ error: 'Une erreur est survenue lors de la connexion.' });
    }
});

clientRoutes.post('/forgotpassword', async (req, res) => {
    const pool = req.pool;
    const { email } = req.body;

    try {
        const query = 'SELECT * FROM Client WHERE email = ?';
        pool.query(query, [email], async (error, results) => {
            if (error) {
                console.error('Erreur lors de la recherche du client :', error);
                return res.status(500).json({ error: 'Une erreur est survenue lors du changement du mot de passe.' });
            }

            if (results.length === 0) {
                return res.status(404).json({ error: 'Client non trouvé.' });
            }

            const verificationCode = generateVerificationCode();
            transporter.sendMail({
                from: process.env.JWT_MAIL,
                to: email,
                subject: 'Demande de changement de mot de passe',
                text: `Votre code de vérification est: ${verificationCode}`
            }, (error, info) => {
                if (error) {
                    console.error('Erreur lors de l\'envoi de l\'email :', error);
                    return res.status(500).json({ error: 'Une erreur est survenue lors de l\'envoi du code de vérification.' });
                } else {
                    console.log('Email envoyé :', info.response);
                    return res.status(200).json({ code: verificationCode });
                }
            });
        });
    } catch (error) {
        console.error('Erreur lors du changement de mot de passe :', error);
        return res.status(500).json({ error: 'Une erreur est survenue lors du changement du mot de passe.' });
    }
});


clientRoutes.post('/changepass', async (req, res) => {
    const pool = req.pool;
    const { email, newPassword } = req.body;

    try {
        const query = 'SELECT * FROM Client WHERE email = ?';
        pool.query(query, [email], async (error, results) => {
            if (error) {
                console.error('Erreur lors de la recherche du client :', error);
                return res.status(500).json({ error: 'Une erreur est survenue lors du changement du mot de passe.' });
            }

            if (results.length === 0) {
                // Client not found
                return res.status(404).json({ error: 'Client non trouvé.' });
            }

            // Hash the new password
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            // Update the client's password in the database
            const updateQuery = 'UPDATE Client SET motdepasse = ? WHERE email = ?';
            pool.query(updateQuery, [hashedPassword, email], (error, result) => {
                if (error) {
                    console.error('Erreur lors de la mise à jour du mot de passe :', error);
                    return res.status(500).json({ error: 'Une erreur est survenue lors du changement du mot de passe.' });
                }
                console.log('Mot de passe changé avec succès');
                transporter.sendMail({
                    from: process.env.JWT_MAIL,
                    to: email,
                    subject: 'Votre mot de passe a été changé',
                    text: 'Votre mot de passe a été changé avec succès !'
                }, (error, info) => {
                    if (error) {
                        console.error('Erreur lors de l\'envoi de l\'email :', error);
                    } else {
                        console.log('Email envoyé :', info.response);
                    }
                });
                res.status(200).json({ message: 'Mot de passe changé avec succès' });
            });
        });
    } catch (error) {
        console.error('Erreur lors du changement de mot de passe :', error);
        return res.status(500).json({ error: 'Une erreur est survenue lors du changement du mot de passe.' });
    }
});

// Route to check if the client is authenticated
clientRoutes.get('/checkAuth', async (req, res) => {
    const token = req.cookies.token;  // Get the token from cookies
    
    if (!token) {
        return res.status(401).json({ error: 'Aucun token fourni, l\'authentification est requise.' });
    }

    try {
        // 🔹 Verify the JWT token
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({ error: 'Token invalide ou expiré.' });
            }
            // Token is valid, send back client data
            const client = decoded.client;  // Get client info from token
            res.status(200).json({ message: 'Client authentifié', client });
        });
    } catch (error) {
        console.error('Erreur lors de la vérification de l\'authentification :', error);
        return res.status(500).json({ error: 'Une erreur est survenue lors de la vérification de l\'authentification.' });
    }
});

clientRoutes.post('/logout', async (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Déconnexion réussie' });
});


clientRoutes.get('/getClientInfo', async (req, res) => {
    const pool = req.pool;
    const token = req.cookies.token;  // Get the token from cookies

    if (!token) {
        return res.status(401).json({ error: 'Aucun token fourni, l\'authentification est requise.' });
    }

    try {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({ error: 'Token invalide ou expiré.' });
            }

            const clientID = decoded.client.clientID;
            const query = 'SELECT nom, region, adresse, tel FROM Client WHERE clientID = ?';

            pool.query(query, [clientID], (error, results) => {
                if (error) {
                    console.error('Erreur lors de la récupération des informations du client:', error);
                    return res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des informations du client.' });
                }

                if (results.length === 0) {
                    return res.status(404).json({ error: 'Client non trouvé.' });
                }

                res.status(200).json(results[0]); // Send back the client info
            });
        });
    } catch (error) {
        console.error('Erreur lors de la vérification du token:', error);
        return res.status(500).json({ error: 'Une erreur est survenue lors de la vérification de l\'authentification.' });
    }
});

clientRoutes.put('/updateClientInfo', async (req, res) => {
    const pool = req.pool;
    const token = req.cookies.token;  // Get the token from cookies
    const { nom, region, adresse, tel } = req.body;
    if (!token) {
        return res.status(401).json({ error: 'Token non fourni, authentification requise.' });
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
                    console.error('Erreur lors de la mise à jour des informations du client:', error);
                    return res.status(500).json({ error: 'Une erreur est survenue lors de la mise à jour des informations du client.' });
                }

                if (result.affectedRows === 0) {
                    return res.status(404).json({ error: 'Client non trouvé ou aucune modification effectuée.' });
                }

                res.status(200).json({ message: 'Les informations du client ont été mises à jour avec succès.' });
            });
        });
    } catch (error) {
        console.error('Erreur lors de la vérification du token:', error);
        return res.status(500).json({ error: 'Une erreur est survenue lors de la vérification de l\'authentification.' });
    }
});

module.exports = clientRoutes;