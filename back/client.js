const express = require('express');
const clientRoutes = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

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
                console.error('Error registering user: ' + error);
                return res.status(500).json({ error: 'An error occurred during user registration.' });
            }

            console.log('Client registered successfully with ID: ' + result.insertId);
            return res.status(201).json({ message: 'Client registered successfully', clientId: result.insertId });
        });
    } catch (error) {
        console.error('Error hashing password:', error);
        return res.status(500).json({ error: 'An error occurred while hashing the password.' });
    }
});

module.exports = clientRoutes;