const express = require('express');
const router = express.Router();
const { isAuthMW, verifyRefreshToken } = require('../middlewares/auth.mw');
const { loginLimiterMW, registerLimiterMW } = require('../middlewares/rateLimit.mw');
const { loginCtrl, registerCtrl, logoutCtrl, refreshTokenCtrl } = require('../controllers/auth.ctrl');

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: User login
 *     description: Log in a user with username and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "john_doe"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Login successful.
 *         headers:
 *           Set-Cookie:
 *             description: Refresh token set as HttpOnly cookie.
 *             schema:
 *               type: string
 *               example: "refresh_token=Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; HttpOnly; Secure"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                   example: "64e1c0f4f7a9c824d3b1e13d"
 *                 accessToken:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Username and password are required.
 *       401:
 *         description: Invalid username or password.
 *       429:
 *         description: Too Many Requests.
 *       500:
 *         description: An error occurred during login.
 */
router.post('/login', loginLimiterMW, loginCtrl);

/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Register a new user
 *     description: Create a new user with a username and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "john_doe"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       201:
 *         description: User registered successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userID:
 *                   type: string
 *                   example: "64e1c0f4f7a9c824d3b1e13d"
 *       400:
 *         description: Username and password are required.
 *       409:
 *         description: Username already exists.
 *       500:
 *         description: An error occurred during registration.
 */
router.post('/register', registerLimiterMW, registerCtrl);

/**
 * @swagger
 * /auth/logout:
 *   get:
 *     tags:
 *       - Authentication
 *     summary: Logout the user
 *     description: Logs out the user by clearing the refresh token cookie.
 *     responses:
 *       200:
 *         description: Logout successful.
 *       401:
 *         description: User is not authenticated.
 *       500:
 *         description: An error occurred during logout.
 */
router.get('/logout', isAuthMW, logoutCtrl);

/**
 * @swagger
 * /auth/refresh:
 *   get:
 *     tags:
 *       - Authentication
 *     summary: Refresh the access token
 *     description: Generates a new access token using the refresh token.
 *     responses:
 *       200:
 *         description: Access token refreshed successfully.
 *         headers:
 *           Set-Cookie:
 *             description: Refresh token reset as HttpOnly cookie.
 *             schema:
 *               type: string
 *               example: "refresh_token=Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; HttpOnly; Secure"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userID:
 *                   type: string
 *                   example: "64e1c0f4f7a9c824d3b1e13d"
 *                 accessToken:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       401:
 *         description: Missing or invalid refresh token.
 *       403:
 *         description: Refresh token verification failed.
 *       500:
 *         description: An error occurred during token refresh.
 */
router.get('/refresh', verifyRefreshToken, refreshTokenCtrl);

module.exports = router;
