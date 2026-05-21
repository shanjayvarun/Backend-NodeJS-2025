/* eslint-disable node/no-unsupported-features/node-builtins */
const crypto = require('crypto');

/**
 * High-performance data sanitization utility placed outside 
 * the request hot-path to protect system memory allocations.
 */
const sanitizeData = (data) => {
  if (!data || typeof data !== 'object') return null;
  
  const sensitiveKeys = ['password', 'token', 'secret', 'oldPassword', 'newPassword'];
  const sanitized = Object.assign({}, data);
  
  sensitiveKeys.forEach(function (key) {
    if (key in sanitized) sanitized[key] = '[REDACTED]';
  });
  return sanitized;
};

const attachRequestId = (req, res, next) => {
  const requestId = req.headers['x-request-id'] || crypto.randomUUID();
  req.requestId = requestId;
  res.setHeader('x-request-id', requestId);
  return next();
};

const logRequest = (req, res, next) => {
  const startedAt = process.hrtime.bigint();

  // Listen for the complete delivery of the network response packet
  res.on('finish', () => {
    const durationMs = Number(process.hrtime.bigint() - startedAt) / 1e6;

    console.log(
      JSON.stringify({
        type: 'http_request',
        timestamp: new Date().toISOString(),
        requestId: req.requestId || 'missing-id',
        correlationId: req.get('x-correlation-id') || req.requestId || 'missing-id',
        service: 'auth-service',
        environment: process.env.NODE_ENV || 'development',

        // Request Metadata
        method: req.method,
        path: req.originalUrl,
        ip: req.ip,
        userAgent: req.get('user-agent'),

        // 📥 Request Data (Safely Sanitized)
        requestParams: req.params,
        requestQuery: Object.keys(req.query || {}).length ? req.query : null,
        requestBody: req.method !== 'GET' ? sanitizeData(req.body) : null,

        // User Authentication Context (Populated by your Auth Guard middleware)
        userId: req.user ? req.user.id : 'anonymous',

        // 📤 Response Data
        statusCode: res.statusCode,
        durationMs: Math.round(durationMs),
        // Relies on your error handler populating res.locals.bodyData
        responseBody: res.statusCode >= 400 ? (res.locals.bodyData || null) : null,

        // 🚨 Error Details (Relies on your error handler populating res.errorInstance)
        error: res.errorInstance ? {
          message: res.errorInstance.message,
          stack: process.env.NODE_ENV !== 'production' ? res.errorInstance.stack : undefined
        } : null
      })
    );
  });

  return next();
};

module.exports = {
  attachRequestId,
  logRequest,
};