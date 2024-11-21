const bcrypt = require('bcrypt');
const { SALT_ROUNDS } = require('./env-var');

module.exports.hashPassword = async function (password) {
    return await bcrypt.hash(password, SALT_ROUNDS);
};

module.exports.comparePasswords = async function (enteredPassword, storedPassword) {
    return await bcrypt.compare(enteredPassword, storedPassword);
};
