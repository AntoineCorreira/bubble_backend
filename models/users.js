const mongoose = require('mongoose');

const childrenSchema = mongoose.Schema({
    firstnamechild: String,
    namechild: String,
    birthdate: String,
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
    zip: String,
    phone: String,
    type: String,
    children: [childrenSchema],
});

const User = mongoose.model('users', userSchema);

module.exports = User;