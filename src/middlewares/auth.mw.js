const jwt = require('jsonwebtoken');
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = require('../utils/env-var');
const logger = require('../utils/logger');
const { StatusCodes } = require('http-status-codes');

module.exports.isAuthMW = async function (req, res, next) {
    const token = req.headers['authorization'];

    if (!token || !token.startsWith('Bearer ')) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Access denied. No token provided.' });
    }

    const tokenWithoutBearer = token.split(' ')[1];
    req.user = await jwt.verify(tokenWithoutBearer, ACCESS_TOKEN_SECRET, (err) => {
        if (err) {
            return res.status(StatusCodes.FORBIDDEN).json({ message: 'Invalid access token' });
        }

        next();
    });
};

module.exports.verifyRefreshToken = async (req, res, next) => {
    const refreshToken = req.cookies?.['refreshToken'];

    if (!refreshToken || !refreshToken.startsWith('Bearer ')) {
        logger.info('Refresh token: Missing refresh token');
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: 'missing refresh token',
        });
    }

    const tokenWithoutBearer = refreshToken.split(' ')[1];

    jwt.verify(tokenWithoutBearer, REFRESH_TOKEN_SECRET, (err, payload) => {
        if (err) {
            return res.status(StatusCodes.FORBIDDEN).json({ message: 'Invalid refresh token' });
        }

        req.userId = payload.id;
        next();
    });
};
