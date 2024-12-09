var express = require('express');
var router = express.Router();
const Establischment = require('../models/establishments');

/* GET home page. */
router.get('/', async (req, res) => {
    const establishments = await Establischment.find();
    res.json({result: true, establishments})
});

module.exports = router;
