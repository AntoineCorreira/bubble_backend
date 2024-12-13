const mongoose = require('mongoose');

const scheduleSchema = mongoose.Schema({
    day: String,
    startTime: String,
    endTime: String,
});

const gallerySchema = mongoose.Schema({
    image: String,
});

const establishmentSchema = mongoose.Schema({
    name: String,
    latitude: Number,
    longitude: Number,
    address: String,
    city: String,
    zip: String,
    phone: String,
    mail: String,
    image: String,
    gallery: [gallerySchema],
    description: String,
    schedules: [scheduleSchema],
    capacity: Number,
    type: String,
});

const Establishment = mongoose.model('establishments', establishmentSchema);

module.exports = Establishment;