var express = require('express');
var router = express.Router();
const Establishment = require('../models/establishments');

/* Récupérer tous les établissements*/
router.get('/all', async (req, res) => {
    const establishments = await Establishment.find();
    res.json({result: true, establishments})
});

module.exports = router;
