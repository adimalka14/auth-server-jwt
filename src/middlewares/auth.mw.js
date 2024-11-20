const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET;

module.exports.isAuthMW = async function (req, res, next) {
    const token = req.headers['authorization'];

    if (!token || !token.startsWith('Bearer ')) {
        return res
            .status(401)
            .json({ message: 'Access denied. No token provided.' });
    }

    try {
        const tokenWithoutBearer = token.split(' ')[1];
        req.user = await jwt.verify(tokenWithoutBearer, secretKey);
        next();
    } catch (err) {
        console.log(err);
        res.status(400).json({ message: 'Invalid token' });
    }
};
