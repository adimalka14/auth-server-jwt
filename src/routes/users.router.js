const express = require('express');
const { isAuthMW } = require('../middlewares/auth.mw');
const { getUserDetailsCtrl } = require('../controllers/users.ctrl');

const router = express.Router();

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get user details
 *     description: Retrieves details of a user by their ID. Requires authentication.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to retrieve.
 *         schema:
 *           type: string
 *           example: "64e1c0f4f7a9c824d3b1e13d"
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: Bearer token for authentication.
 *         schema:
 *           type: string
 *           example: "Bearer eyJhbGciOiJIUzI1NiIsInR..."
 *     responses:
 *       200:
 *         description: User details retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "64e1c0f4f7a9c824d3b1e13d"
 *       401:
 *         description: User is not authenticated.
 *       404:
 *         description: User not found.
 *       500:
 *         description: An error occurred while retrieving user details.
 */
router.get('/:id', isAuthMW, getUserDetailsCtrl);

module.exports = router;
