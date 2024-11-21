const rateLimit = require('express-rate-limit');

module.exports.loginLimiterMW = rateLimit({
    windowMs: 15 * 60 * 1000, // every 15 minutes
    max: 5, // 5 attempts maximum
    message: 'Too many login attempts from this IP, please try again after 15 minutes',
    headers: true,
});

module.exports.registerLimiterMW = rateLimit({
    windowMs: 15 * 60 * 1000, // every 15 minutes
    max: 5, // 5 attempts maximum
    message: 'Too many login attempts from this IP, please try again after 15 minutes',
    headers: true,
});

module.exports.generalLimiterMW = rateLimit({
    windowMs: 15 * 60 * 1000, // every 15 minutes
    max: 1000, // maximum 1000 requests from same IP
    message: 'Too many requests from this IP, please try again after 15 minutes',
});
