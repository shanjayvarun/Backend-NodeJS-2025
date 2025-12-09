const logger = require('../../config/logger');

const requestLogger = (req, res, next) => {
  const startTime = process.hrtime();

  res.on('finish', () => {
    const diff = process.hrtime(startTime);
    const responseTime = (diff[0] + diff[1] * 1e-9).toFixed(2);

    const status = res.statusCode;

    let level = 'http';
    if (status >= 500) level = 'error';
    else if (status >= 400) level = 'warn';
    else level = 'http';

    logger[level]({
      method: req.method,
      url: req.originalUrl || req.url,
      statusCode: status,
      ip: req.ip,
      query: req.query,
      body: req.body,
      responseTime: `${responseTime}s`,
    });
  });

  next();
};

module.exports = requestLogger;
