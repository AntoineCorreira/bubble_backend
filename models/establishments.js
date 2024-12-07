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
    zip: Number,
    phone: Number,
    mail: String,
    image: String,
    description: String,
    schedules: [scheduleSchema],
    capacity: String,
    type: String,
});

const Establischment = mongoose.model('establishments', establishmentSchema);

module.exports = Establischment;