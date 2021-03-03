const logger = require('../startup/logging');

// This middleware throws errors when there a rejected promise.
module.exports = function(err, req, res, next) {
    logger.error(err.message, err);
    res.status(500).send('Something went wrong.');
};