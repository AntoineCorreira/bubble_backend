var express = require('express');
var router = express.Router();
const Establishment = require('../models/establishment'); // Assurez-vous que le chemin est correct

// Route pour récupérer tous les établissements (route existante)
// Cette route renvoie tous les établissements de la base de données
router.get('/all', async (req, res) => {
  try {
    const establishments = await Establishment.find();
    res.json(establishments);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while retrieving establishments.' });
  }
});

// Nouvelle route pour récupérer les établissements avec des critères de recherche
// Cette route permet de filtrer les établissements en fonction de critères de recherche spécifiques :
// - location : filtre par ville
// - period : filtre par période (dates)
// - type : filtre par type d'établissement
router.get('/', async (req, res) => {
    const establishments = await Establischment.find();
    res.json({result: true, establishments})
});

module.exports = router;
