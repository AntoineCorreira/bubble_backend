const express = require('express');
const router = express.Router();
const Establishment = require('../models/establishments');
const User = require('../models/users');
const Reservation = require('../models/reservations');

router.post('/', async (req, res) => {
    const {
        startDate,
        endDate,
        parentFirstname,
        parentName,
        child,
        establishmentName,
        establishmentZip,
        status
    } = req.body;

    try {
        const user = await User.findOne({
            firstname: parentFirstname,
            name: parentName,
        })

        if (!user) {
            return res.json({ message: 'Utilisateur non trouvé' });
        }

        const establishment = await Establishment.findOne({
            name: establishmentName,
            zip: establishmentZip,
        });

        if (!establishment) {
            return res.json({ message: 'Établissement non trouvé' });
        }

        // Création de la réservation
        const newReservation = new Reservation({
            startDate,
            endDate,
            parent: user._id,
            child,
            establishment: establishment._id,
            status,
        });

        await newReservation.save();
        res.json(newReservation)
    } catch (error) {
        console.log(error)
        res.json({ message: 'Erreur serveur' })
    }
})

module.exports = router;
