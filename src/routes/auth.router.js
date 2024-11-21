const express = require('express');
const router = express.Router();
const { isAuthMW, verifyRefreshToken } = require('../middlewares/auth.mw');
const { loginLimiterMW, registerLimiterMW } = require('../middlewares/rateLimit.mw');
const { loginCtrl, registerCtrl, logoutCtrl, refreshTokenCtrl } = require('../controllers/auth.ctrl');

router.post('/login', loginLimiterMW, loginCtrl);

router.post('/register', registerLimiterMW, registerCtrl);

router.get('/logout', isAuthMW, logoutCtrl);

router.get('/refresh', verifyRefreshToken, refreshTokenCtrl);

module.exports = router;
