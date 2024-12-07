const mongoose = require('mongoose');

const childrenSchema = mongoose.Schema({
    firstname: String,
    name: String,
    birthdate: Date,
});

const userSchema = mongoose.Schema({
    token: String,
    email: String,
    password: String,
    civility: String,
	name: String,
    firstname: String,
    address: String,
    city: String,
    zip: Number,
    phone: Number,
    type: String,
    children: [childrenSchema],
});

const User = mongoose.model('users', userSchema);

module.exports = User;