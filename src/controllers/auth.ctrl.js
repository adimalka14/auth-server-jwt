const { StatusCodes } = require('http-status-codes');

const { findUserByUsername, createUser } = require('../services/user.service');
const { generateAccessToken, generateRefreshToken } = require('../utils/token');
const { comparePasswords } = require('../utils/hashingPassword');
const logger = require('../utils/logger');
const { NODE_ENV } = require('../utils/env-var');
const WEEK = 7 * 24 * 60 * 60 * 1000;

module.exports.loginCtrl = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        logger.info('Login failed: Missing username or password');
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: 'Username and password are required',
        });
    }

    try {
        const user = await findUserByUsername(username);
        if (!user || !(await comparePasswords(password, user.password))) {
            logger.info(`Login failed: Invalid credentials for username '${username}'`);
            return res.status(StatusCodes.UNAUTHORIZED).json({
                message: 'Invalid username or password',
            });
        }

        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);
        logger.info('Login successful', { username });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: WEEK,
        });
        res.status(StatusCodes.OK).json({
            message: 'Login successful',
            userId: user._id,
            accessToken,
        });
    } catch (error) {
        logger.error(`Error during login: ${error.message}`);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: 'An error occurred during login',
        });
    }
};

module.exports.registerCtrl = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        logger.info('Registration failed: Missing username or password');
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: 'Username and password are required',
        });
    }

    try {
        const newUser = await createUser({ username, password });

        logger.info(`User '${username}' registered successfully`);
        res.status(StatusCodes.CREATED).json({
            message: 'User registered successfully',
            userID: newUser._id,
        });
    } catch (error) {
        if (error.code === 11000) {
            logger.info(`Registration failed: Username '${username}' already exists`);
            res.status(StatusCodes.CONFLICT).json({
                message: 'Username already exists',
            });
        } else {
            logger.error('Error during registration:', error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'An error occurred during registration',
            });
        }
    }
};

module.exports.logoutCtrl = async (req, res) => {
    try {
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });

        res.status(StatusCodes.OK).json({ message: 'Logout successful' });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'An error occurred during logout' });
    }
};

module.exports.refreshTokenCtrl = async (req, res) => {
    try {
        const { userId } = req;

        if (!userId) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid refresh token' });
        }

        const newAccessToken = generateAccessToken(userId);

        logger.info(`Access token refreshed for user: ${userId}`);
        res.status(StatusCodes.OK).json({
            message: 'Access token refreshed successfully',
            userId,
            accessToken: newAccessToken,
        });
    } catch (error) {
        logger.error(`Error during token refresh: ${error.message}`);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'An error occurred during token refresh' });
    }
};
