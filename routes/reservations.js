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
        res.json({result: true, newReservation})
    } catch (error) {
        console.log(error)
        res.json({ message: 'Erreur serveur' })
    }
})

// création de la route pour recuperer toutes les reservations du parent.
router.post('/allReservations', (req, res) => {
    const parentId = req.body._id; 
  
    if (!parentId) {
      return res.status(400).json({ result: false, error: 'Parent ID manquant' });
    }
    Reservation.find({ parent: parentId }) // Recherche toutes les réservations où `parent` correspond à l'ObjectId fourni
      .populate('parent') // Charge les détails du parent
      .populate('establishment') // Charge les détails de l'établissement
      .then((data) => {
        if (data.length === 0) {
          return res.status(404).json({ result: false, error: 'Aucune réservation trouvée pour ce parent' });
        }
        res.json({ result: true, dataReservation: data });
      })
      .catch((err) => {
        console.error('Erreur lors de la récupération des réservations:', err);
        res.status(500).json({ result: false, error: 'Erreur serveur' });
      });
  });
  
module.exports = router;
