var express = require('express');
var router = express.Router();
const Establishment = require('../models/establishments');

/* GET home page. */
router.get('/all', async (req, res) => {
    const establishments = await Establishment.find();
    res.json({result: true, establishments: establishments})
});

module.exports = router;
