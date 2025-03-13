const express = require('express');
const clientRoutes = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
        user: 'techshoptn@hotmail.com',
        pass: 'ehxojzjpkqeoibqb'
    }
  });

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
                console.error('Error registering client: ' + error);
                return res.status(500).json({ error: 'An error occurred during client registration.' });
            }

            console.log('Client registered successfully with ID: ' + result.insertId);
            /*transporter.sendMail({
                from: 'techshoptn@hotmail.com',
                to: email,
                subject: 'Welcome to Techshop',
                text: 'Thank you for registering with us!'
            }, (error, info) => {
                if (error) {
                    console.error('Error sending email:', error);
                } else {
                    console.log('Email sent:', info.response);
                }
            });*/
            return res.status(201).json({ message: 'Client registered successfully', clientId: result.insertId });
        });
    } catch (error) {
        console.error('Error hashing password:', error);
        return res.status(500).json({ error: 'An error occurred while hashing the password.' });
    }
});

// Route to login candidate
clientRoutes.post('/loginClient', async (req, res) => {
    const pool = req.pool;
    const { email, password, rememberme } = req.body;

    try {
        const query = 'SELECT * FROM Client WHERE email = ?';
        pool.query(query, [email], async (error, results) => {
            if (error) {
                console.error('Error querying client:', error);
                return res.status(500).json({ error: 'Database error' });
            }

            if (results.length === 0) {
                return res.status(404).json({ error: 'Client not found.' });
            }

            const client = results[0];

            // 🔹 Compare passwords safely
            const passwordMatch = await bcrypt.compare(password, client.motdepasse);
            if (!passwordMatch) {
                return res.status(401).json({ error: 'Invalid password.' });
            }

            // 🔹 Generate JWT token
            const expiresIn = rememberme ? '30d' : '1d';
            const token = jwt.sign({ client: client}, 'mariem', { expiresIn });            
            res.cookie('token', token, { httpOnly: true, maxAge: rememberme ? 30 * 24 * 60 * 60 * 1000 : undefined });
            res.status(200).json({ message: 'Login successful', token: token });

        });
    } catch (error) {
        console.error('Error logging in:', error);
        return res.status(500).json({ error: 'An error occurred while logging in.' });
    }
});

module.exports = clientRoutes;