const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports.hashPassword = async function (password) {
    return await bcrypt.hash(password, saltRounds);
};

module.exports.comparePasswords = async function (
    enteredPassword,
    storedPassword
) {
    return await bcrypt.compare(enteredPassword, storedPassword);
};
