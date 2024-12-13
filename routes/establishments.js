const express = require('express');
const router = express.Router();
const Establishment = require('../models/establishments');

// Route pour récupérer tous les établissements
router.get('/all', async (req, res) => {
  try {
    const establishments = await Establishment.find();
    res.json({ result: true, establishments: establishments });
  } catch (error) {
    console.error('Erreur lors de la récupération des établissements:', error);
    res.status(500).json({ error: 'An error occurred while retrieving establishments.' });
  }
});

// Route pour récupérer les établissements avec des filtres
router.get('/', async (req, res) => {
  try {
    const { city, days, type } = req.query;
    let query = {};

    // Filtrer par ville
    if (city) {
      query.city = new RegExp(city, 'i');
    }

    // Filtrer par type d'établissement
    if (type) {
      query.type = new RegExp(type, 'i');
    }

    // Filtrer par jours de la semaine
    if (days) {
      const daysArray = days.split(',');
      query['schedules.day'] = { $in: daysArray };
    }
console.log(req.query)
console.log(query)
    const establishments = await Establishment.find(query);
    res.json({ establishments });
  } catch (error) {
    console.error('Erreur lors de la récupération des établissements:', error);
    res.status(500).json({ error: 'An error occurred while retrieving establishments.' });
  }
});

// Route pour récupérer toutes les villes distinctes
router.get('/city', async (req, res) => {
  try {
      const cities = await Establishment.distinct('city'); // Récupérer toutes les villes distinctes
      res.json(cities); // Retourner les villes sous forme de tableau
  } catch (error) {
      console.error('Erreur lors de la récupération des villes:', error);
      res.status(500).json({ error: 'An error occurred while retrieving cities.' });
  }
});

// Route pour récupérer tous les types d'établissement distincts
router.get('/type', async (req, res) => {
  try {
      const types = await Establishment.distinct('type'); // Récupérer tous les types distincts
      res.json(types); // Retourner les types sous forme de tableau
  } catch (error) {
      console.error('Erreur lors de la récupération des types de garde:', error);
      res.status(500).json({ error: 'An error occurred while retrieving types of care.' });
  }
});


module.exports = router;
