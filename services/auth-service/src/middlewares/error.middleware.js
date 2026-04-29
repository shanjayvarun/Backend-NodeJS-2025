const { sendError } = require('../utils/response.util');

const notFoundHandler = (req, res) => {
  return sendError(res, 404, 'Route not found');
};

const errorHandler = (err, req, res, next) => {
  if (res.headersSent) return next(err);

  const statusCode = err.message === 'CORS Not Allowed' ? 403 : err.statusCode || 500;
  const message = err.message === 'CORS Not Allowed'
    ? 'CORS Error: This origin is not allowed to access the API'
    : err.message || 'Internal server error';

  console.error({
    requestId: req.requestId,
    message: err.message,
    stack: err.stack,
  });

  return sendError(res, statusCode, message);
};

module.exports = {
  notFoundHandler,
  errorHandler,
};
