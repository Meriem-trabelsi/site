const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Set up multer for handling image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Save images to the 'src/assets/uploadslost' directory
    cb(null, path.join(__dirname, '..', 'src', 'assets', 'uploadslost'));  // Adjusted for 'src/assets/uploadslost'
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));  // Add unique timestamp to file names
  }
});

const upload = multer({ storage });

// Middleware to extract clientID from JWT token
function authenticateJWT(req, res, next) {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1]; 
  if (!token) return res.status(403).send('Access denied');
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); 
    req.clientID = decoded.client.clientID;
    next();
  } catch (error) {
    return res.status(401).send('Invalid token');
  }
}

// Route to create a lost pet entry
router.post('/add', authenticateJWT, upload.single('image'), (req, res) => {
  console.log("Received data:", req.body); // Logs form data to the console
  console.log("Received file:", req.file);  // Logs file details to the console

  const { name, breed, age, type, dateLost, location, description } = req.body;
  const imageURL = req.file ? 'uploadslost/' + req.file.filename : null;  // Save the relative path for the image

  const sql = `INSERT INTO LostPet (clientID, petName, breed, age, type, imageURL, dateLost, location, description)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
req.pool.query(sql, [req.clientID, name, breed, age, type, imageURL, dateLost, location, description], (err, results) => {
  // Continue as normal

    if (err) {
      console.error('Erreur lors de l\'ajout d\'un animal perdu :', err);
      return res.status(500).json({ error: 'Erreur de la base de données' });
    }
    res.status(201).json({ message: 'Animal perdu ajouté avec succès' });
  });
});

// Route to retrieve all lost pets with owner details
router.get('/all', (req, res) => {
  const sql = `SELECT 
                 lp.lostPetID,
                 lp.petName,
                 lp.breed,
                 lp.age,
                 lp.type,
                 lp.imageURL,
                 lp.dateLost,
                 lp.location,
                 lp.description,
                 lp.datePosted,
                 c.nom AS ownerName,
                 c.tel AS ownerPhone,
                 c.email AS ownerEmail
               FROM LostPet lp
               JOIN Client c ON lp.clientID = c.clientID`; // Join LostPet with Client table

  req.pool.query(sql, (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des animaux perdus :', err);
      return res.status(500).json({ error: 'Erreur de la base de données' });
    }
    res.status(200).json(results); // Return the list of lost pets along with owner details
  });
});

module.exports = router;
