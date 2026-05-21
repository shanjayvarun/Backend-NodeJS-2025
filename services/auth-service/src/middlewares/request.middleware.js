const crypto = require('crypto');

const attachRequestId = (req, res, next) => {
  const requestId = req.headers['x-request-id'] || crypto.randomUUID();
  req.requestId = requestId;
  res.setHeader('x-request-id', requestId);
  return next();
};

const logRequest = (req, res, next) => {
  const startedAt = process.hrtime.bigint();

  res.on('finish', () => {
    const durationMs = Number(process.hrtime.bigint() - startedAt) / 1e6;

    console.log(
      JSON.stringify({
        type: 'http_request',
        requestId: req.requestId,
        service: 'auth-service',
        method: req.method,
        path: req.originalUrl,
        statusCode: res.statusCode,
        durationMs: Math.round(durationMs),
        ip: req.ip,
        userAgent: req.get('user-agent'),
      }),
    );
  });

  return next();
};

module.exports = {
  attachRequestId,
  logRequest,
};
