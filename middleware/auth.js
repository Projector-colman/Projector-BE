const jwt = require('jsonwebtoken');
const config = require('config');

// This middleware checks whether this user is authenticated or not.
module.exports = function auth(req, res, next) {
    const token = req.header('x-auth-token');
    // If there is no token
    if (!token) return res.status(401).send('Access denied. No token provided.');

    try { 
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
        req.user = decoded;
        next();
    }
    catch (e) {
        res.status(400).send('Invalid token.');
    }
}