var express = require('express');
var router = express.Router();
const Establishment = require('../models/establishments'); // Assurez-vous que le chemin est correct

// Route pour récupérer tous les établissements (route existante)
// Cette route renvoie tous les établissements de la base de données
router.get('/all', async (req, res) => {
  const establishments = await Establishment.find();
  res.json({result: true, establishments: establishments})
});

// Nouvelle route pour récupérer les établissements avec des critères de recherche
// Cette route permet de filtrer les établissements en fonction de critères de recherche spécifiques :
// - location : filtre par ville
// - period : filtre par période (dates)
// - type : filtre par type d'établissement
router.get('/', async (req, res) => {
  try {
    const { location, period, type } = req.query; // Extraction des critères de recherche depuis les paramètres de requête

    let query = {};
    if (location) {
      query.city = new RegExp(location, 'i'); // Recherche insensible à la casse par ville
    }
    if (type) {
      query.type = type; // Filtrage par type d'établissement
    }
    if (period) {
      const [startDate, endDate] = period.split(' - ');
      // Filtrage par période : recherche des dates incluses dans la période donnée
      query.schedules = { $elemMatch: { date: { $gte: new Date(startDate), $lte: new Date(endDate) } } };
    }

    // Recherche des établissements correspondant aux critères de recherche
    const establishments = await Establishment.find(query);
    res.json({establishments}); // Envoi des établissements filtrés en réponse
  } catch (error) {
    // Gestion des erreurs lors de la récupération des établissements
    res.status(500).json({ error: 'An error occurred while retrieving establishments.' });
  }
});

module.exports = router;
