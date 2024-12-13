const mongoose = require('mongoose');

const reservationSchema = mongoose.Schema({
    startDate: String,
    endDate: String,
    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    child: String,
    establishment: { type: mongoose.Schema.Types.ObjectId, ref: 'establishments' },
    status: String,
});

const Reservation = mongoose.model('reservations', reservationSchema);

module.exports = Reservation;