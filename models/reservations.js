const mongoose = require('mongoose');

const reservationSchema = mongoose.Schema({
    startDate: Date,
    endDate: Date,
    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    children: [String],
    establishment: { type: mongoose.Schema.Types.ObjectId, ref: 'establishments' }
});

const Reservation = mongoose.model('reservations', reservationSchema);

module.exports = Reservation;