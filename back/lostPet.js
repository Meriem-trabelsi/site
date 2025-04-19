const express = require('express');
const router = express.Router();

// Route to create a lost pet entry
router.post('/add', (req, res) => {
  const { clientID, petName, breed, age, type, imageURL, dateLost, location, description } = req.body;

  const sql = `INSERT INTO LostPet (clientID, petName, breed, age, type, imageURL, dateLost, location, description)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  req.pool.query(sql, [clientID, petName, breed, age, type, imageURL, dateLost, location, description], (err, results) => {
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
