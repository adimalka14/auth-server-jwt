const express = require('express');
const router = express.Router();
const { isAuthMW } = require('../middlewares/auth.mw');
const {
    loginLimiterMW,
    registerLimiterMW,
} = require('../middlewares/rateLimit.mw');
const {
    loginCtrl,
    registerCtrl,
    logoutCtrl,
} = require('../controllers/auth.ctrl');

router.post('/login', loginLimiterMW, loginCtrl);

router.post('/register', registerLimiterMW, registerCtrl);

router.get('/logout', logoutCtrl);

module.exports = router;
