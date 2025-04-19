const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Set up multer for handling image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  // Save images in the 'uploads' directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));  // Give the file a unique name
  }
});
const upload = multer({ storage });

// Route to create an adoption pet entry
// Inside the backend POST route
const jwt = require('jsonwebtoken');

// Middleware to extract clientID from JWT token (if you're using JWT for authentication)
function authenticateJWT(req, res, next) {
  const token = req.header('Authorization')?.split(' ')[1]; // Assuming Bearer token
  if (!token) return res.status(403).send('Access denied');

  jwt.verify(token, 'your-secret-key', (err, user) => {
    if (err) return res.status(403).send('Invalid token');
    req.clientID = user.clientID; // Assuming the clientID is in the token
    next();
  });
}

// Route to create an adoption pet entry
router.post('/add', authenticateJWT, upload.single('image'), (req, res) => {
  console.log("Received data:", req.body); // Logs form data to the console
  console.log("Received file:", req.file);  // Logs file details to the console

  const { petName, breed, age, type, gender, location, shelter, description, goodWithKids, goodWithOtherPets, houseTrained, specialNeeds } = req.body;
  const clientID = req.clientID;  // Get the clientID from the JWT payload
  const imageURL = req.file ? req.file.path : null;  // Handle image upload if present

  const sql = `INSERT INTO AdoptionPet 
    (clientID, petName, breed, age, type, gender, imageURL, location, shelter, description, 
    goodWithKids, goodWithOtherPets, houseTrained, specialNeeds)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  req.pool.query(sql, [
    clientID, petName, breed, age, type, gender, imageURL, location, shelter, description,
    goodWithKids, goodWithOtherPets, houseTrained, specialNeeds
  ], (err, results) => {
    if (err) {
      console.error('Erreur lors de l\'ajout d\'un animal à adopter :', err);
      return res.status(500).json({ error: 'Erreur de la base de données' });
    }
    res.status(201).json({ message: 'Animal à adopter ajouté avec succès' });
  });
});



// Route to get all adoption pets with owner details
router.get('/', (req, res) => {
  const sql = `
    SELECT 
      ap.*, 
      c.email AS ownerEmail, 
      c.tel AS ownerPhone,
      ap.location AS petLocation
    FROM 
      AdoptionPet ap
    INNER JOIN 
      Client c ON ap.clientID = c.clientID
  `;

  req.pool.query(sql, (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des animaux à adopter :', err);
      return res.status(500).json({ error: 'Erreur de la base de données' });
    }
    res.status(200).json(results);
  });
});

module.exports = router;
