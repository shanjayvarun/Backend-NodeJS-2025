const logger = require('../../config/logger');

const requestLogger = (req, res, next) => {
  const startTime = process.hrtime();
  res.on('finish', () => {
    const diff = process.hrtime(startTime);
    const responseTime = (diff[0] + diff[1] * 1e-9).toFixed(2);
    logger.info({
      method: req.method,
      url: req.originalUrl || req.url,
      statusCode: res.statusCode,
      ip: req.ip,
      query: req.query,
      body: req.body,
      responseTime: `${responseTime}s`,
    });
  });
  next();
};

module.exports = requestLogger;
