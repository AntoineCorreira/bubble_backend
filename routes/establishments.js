const express = require('express');
const router = express.Router();
const Establishment = require('../models/establishments');

router.get('/all', async (req, res) => {
  const establishments = await Establishment.find();
  res.json({ result: true, establishments: establishments });
});

router.get('/', async (req, res) => {
  try {
    const { city, period, type } = req.query;
    console.log('Critères de recherche:', { city, period, type });

    let query = {};
    if (city) {
      query.city = new RegExp(city, 'i');
    }
    if (type) {
      query.type = new RegExp(type, 'i');
    }
    if (period) {
      const [startDate, endDate] = period.split(' - ');
      query.schedules = { $elemMatch: { day: { $gte: new Date(startDate), $lte: new Date(endDate) } } };
    }

    const establishments = await Establishment.find(query);
    console.log('Requête MongoDB:', query);
    console.log('Résultats de la recherche:', establishments);
    res.json({ establishments });
  } catch (error) {
    console.error('Erreur lors de la récupération des établissements:', error);
    res.status(500).json({ error: 'An error occurred while retrieving establishments.' });
  }
});

router.get('/type', async (req, res) => {
  try {
    const types = await Establishment.distinct('type');
    res.json(types);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while retrieving types of care.' });
  }
});

router.get('/city', async (req, res) => {
  try {
    const cities = await Establishment.distinct('city');
    res.json(cities);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while retrieving cities.' });
  }
});

router.get('/period', async (req, res) => {
  try {
    const periods = await Establishment.distinct('schedules.day');
    res.json(periods);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while retrieving periods.' });
  }
});


module.exports = router;
