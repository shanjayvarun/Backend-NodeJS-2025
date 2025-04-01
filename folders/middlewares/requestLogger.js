const logger = require('../../config/logger');

const requestLogger = (req, res, next) => {
    const logData = {
        method: req.method,
        url: req.originalUrl || req.url,
        ip: req.ip,
        query: req.query,
        body: req.body,
    };
    logger.info(`${JSON.stringify(logData)}`);
    next();
};

module.exports = requestLogger;
