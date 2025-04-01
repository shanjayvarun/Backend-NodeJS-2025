const logger = require('../../config/logger');

const requestLogger = (req, res, next) => {
    const logData = {
        method: req.method,
        url: req.originalUrl || req.url,
        ip: req.ip,
        headers: req.headers,
        query: req.query,
        body: req.body,
        userAgent: req.get('User-Agent'),
        timestamp: new Date().toISOString()
    };
    logger.info(`${JSON.stringify(logData, null, 2)}`);
    next();
};

module.exports = requestLogger;
