const jwt = require('jsonwebtoken');
const userModel = require('../models/users.model');

module.exports.loginCtrl = async (req, res) => {
    res.send('Login successful');
};
module.exports.registerCtrl = async (req, res) => {
    res.send('Register successful');
};

module.exports.logoutCtrl = async (req, res) => {
    res.send('Logout successful');
};
