const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Set up multer for handling image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Save images to the 'src/assets/uploads' directory
    cb(null, path.join(__dirname, '..', 'src', 'assets', 'uploads'));  // Adjusted for 'src/assets/uploads'
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));  // Add unique timestamp to file names
  }
});


const upload = multer({ storage });

// Route to create an adoption pet entry
// Inside the backend POST route

// Middleware to extract clientID from JWT token (if you're using JWT for authentication)
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



// Route to create an adoption pet entry
router.post('/add', authenticateJWT, upload.single('image'), (req, res) => {
  console.log("Received data:", req.body); // Logs form data to the console
  console.log("Received file:", req.file);  // Logs file details to the console

  const { petName, breed, age, type, gender, location, shelter, description, goodWithKids, goodWithOtherPets, houseTrained, specialNeeds } = req.body;
  const goodWithKids2 = goodWithKids ? 1 : 0;
  const goodWithOtherPets2 = goodWithOtherPets ? 1 : 0;
  const houseTrained2= houseTrained ? 1 : 0;
  const specialNeeds2 = specialNeeds ? 1 : 0;

  const clientID = req.clientID;  // Get the clientID from the JWT payload
  const imageURL = req.file ? 'uploads/' + req.file.filename : null;

  const sql = `INSERT INTO AdoptionPet 
    (clientID, petName, breed, age, type, gender, imageURL, location, shelter, description, 
    goodWithKids, goodWithOtherPets, houseTrained, specialNeeds)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  req.pool.query(sql, [
    clientID, petName, breed, age, type, gender, imageURL, location, shelter, description,
    goodWithKids2, goodWithOtherPets2, houseTrained2, specialNeeds2
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

// Route to get all adoption pets with owner details and filters
router.get('/pets', (req, res) => {
  const { location, types, ages } = req.query;

  let sql = `
    SELECT 
      ap.*, 
      c.email AS ownerEmail, 
      c.tel AS ownerPhone,
      ap.location AS petLocation
    FROM 
      AdoptionPet ap
    INNER JOIN 
      Client c ON ap.clientID = c.clientID
    WHERE 1=1
  `;
  const params = [];

  if (location) {
    sql += ` AND ap.location = ?`;
    params.push(location);
  }

  if (types) {
    const typeList = types.split(',');
    sql += ` AND ap.type IN (${typeList.map(() => '?').join(',')})`;
    params.push(...typeList);
  }

  if (ages) {
    const ageList = ages.split(',');
    sql += ` AND ap.age IN (${ageList.map(() => '?').join(',')})`;
    params.push(...ageList);
  }

  req.pool.query(sql, params, (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des animaux filtrés :', err);
      return res.status(500).json({ error: 'Erreur de la base de données' });
    }
    res.status(200).json(results);
  });
});

// In your backend Express app
// In your backend Express app
// Route to delete a pet from adoption
router.delete('/delete/:id', authenticateJWT, (req, res) => {
  const petId = req.params.id;
  const clientID = req.clientID; // Extract clientID from the JWT token

  const sql = 'SELECT * FROM AdoptionPet WHERE petID = ? AND clientID = ?';
  req.pool.query(sql, [petId, clientID], (err, results) => {
    if (err) {
      console.error('Error checking pet ownership:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(403).json({ error: 'You can only delete your own pets' });
    }

    const deleteSql = 'DELETE FROM AdoptionPet WHERE petID = ?';
    req.pool.query(deleteSql, [petId], (err) => {
      if (err) {
        console.error('Error deleting pet:', err);
        return res.status(500).json({ error: 'Failed to delete pet' });
      }
      res.status(200).json({ message: 'Pet deleted successfully' });
    });
  });
});




module.exports = router;
