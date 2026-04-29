const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const { sendError } = require('../utils/response.util');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(res, 400, 'Request validation failed', { errors: errors.array() });
  }
  return next();
};

const validateUserRegistration = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Invalid email format'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  handleValidationErrors,
];

const validateUserLogin = [
  body('email').isEmail().withMessage('Invalid email format'),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidationErrors,
];

const validateRefreshToken = [
  body('refreshToken').notEmpty().withMessage('Refresh token is required'),
  handleValidationErrors,
];

const validateUserToken = (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  if (!token) return sendError(res, 401, 'No token provided. Unauthorized');

  jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, decoded) => {
    if (err) return sendError(res, 403, 'Failed to authenticate token');
    req.user = decoded;
    return next();
  });
};

module.exports = {
  validateUserRegistration,
  validateUserLogin,
  validateRefreshToken,
  validateUserToken,
};
