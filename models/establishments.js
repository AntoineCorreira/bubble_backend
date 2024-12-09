const mongoose = require('mongoose');

const scheduleSchema = mongoose.Schema({
    day: String,
    startTime: String,
    endTime: String,
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
    description: String,
    schedules: [scheduleSchema],
    capacity: Number,
    type: String,
});

const Establischment = mongoose.model('establishments', establishmentSchema);

module.exports = Establischment;