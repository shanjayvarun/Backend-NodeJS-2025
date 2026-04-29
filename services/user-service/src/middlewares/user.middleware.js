const { body, param, query, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const environment = require('../config/env');
const { sendError } = require('../utils/response.util');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(res, 400, 'Request validation failed', { errors: errors.array() });
  }
  return next();
};

const validateUserToken = (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  if (!token) return sendError(res, 401, 'No token provided. Unauthorized');

  jwt.verify(token, environment.jwt.accessSecret, (err, decoded) => {
    if (err) return sendError(res, 403, 'Failed to authenticate token');
    req.user = decoded;
    return next();
  });
};

const validateMongoId = [
  param('id').isMongoId().withMessage('Invalid user id'),
  handleValidationErrors,
];

const validateGetUsers = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be greater than 0'),
  query('limit').optional().isInt({ min: -1 }).withMessage('Limit must be -1 or greater than 0'),
  handleValidationErrors,
];

const validateCreateUser = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Invalid email format'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isString().withMessage('Role must be a string'),
  body('phone').optional({ nullable: true }).isString().withMessage('Phone must be a string'),
  body('bio').optional().isString().withMessage('Bio must be a string'),
  body('profilePicture').optional().isString().withMessage('Profile picture must be a string'),
  body('userStatus').optional().isString().withMessage('User status must be a string'),
  handleValidationErrors,
];

const validateUpdateUser = [
  body('name').optional().notEmpty().withMessage('Name cannot be empty'),
  body('email').optional().isEmail().withMessage('Invalid email format'),
  body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isString().withMessage('Role must be a string'),
  body('phone').optional({ nullable: true }).isString().withMessage('Phone must be a string'),
  body('bio').optional().isString().withMessage('Bio must be a string'),
  body('profilePicture').optional().isString().withMessage('Profile picture must be a string'),
  body('isVerified').optional().isBoolean().withMessage('Is verified must be boolean'),
  body('userStatus').optional().isString().withMessage('User status must be a string'),
  handleValidationErrors,
];

module.exports = {
  validateUserToken,
  validateMongoId,
  validateGetUsers,
  validateCreateUser,
  validateUpdateUser,
};
