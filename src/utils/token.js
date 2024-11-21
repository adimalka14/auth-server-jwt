const jwt = require('jsonwebtoken');
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = require('./env-var');

const generateAccessToken = (userId) => {
    return jwt.sign({ id: userId }, ACCESS_TOKEN_SECRET, {
        expiresIn: '15m',
    });
};

const generateRefreshToken = (userId) => {
    return jwt.sign({ id: userId }, REFRESH_TOKEN_SECRET, {
        expiresIn: '7d',
    });
};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
};
