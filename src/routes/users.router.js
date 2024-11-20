const express = require('express');
const { isAuthMW } = require('../middlewares/auth.mw');
const { getUserDetailsCtrl } = require('../controllers/users.ctrl');

const router = express.Router();

router.get('/:id', isAuthMW, getUserDetailsCtrl);

module.exports = router;
