const { body, validationResult } = require("express-validator");
const { ROLES, TASKSTATUS } = require("../utility/enum");
const jwt = require('jsonwebtoken');
const { sendError } = require('../utility/responses');
require('dotenv').config();

const validateUserRegistration = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Invalid email format"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  body("role").optional().isIn(Object.values(ROLES)).withMessage("Invalid role type"),
  handleValidationErrors
];

const validateUserLogin = [
  body("email").isEmail().withMessage("Invalid email format"),
  body("password").notEmpty().withMessage("Password is required"),
  handleValidationErrors
];

const validateTaskCreation = [
  body("title").notEmpty().withMessage("Title is required"),
  body("description").notEmpty().withMessage("Description is required"),
  body("status").optional().isIn(Object.values(TASKSTATUS)).withMessage("Invalid status"),
  handleValidationErrors
];

const validateBlogCreation = [
  body('title').notEmpty().withMessage('Title is required'),
  body('content').notEmpty().withMessage('Content is required'),
  body('author').notEmpty().withMessage('Author is required'),
  handleValidationErrors
];

const validateProductCreation = [
  body('productName').notEmpty().withMessage('Product name is required'),
  body('price').notEmpty().withMessage('Price is required'),
  body('category').notEmpty().withMessage('Category is required'),
  handleValidationErrors
]

const validateUserToken = (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  if (!token) {
    return sendError(res, 401, 'No token provided. Unauthorized');
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return sendError(res, 403, 'Failed to authenticate token');
    }
    req.user = decoded;
    next();
  });
};

function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(res, 400, 'Request Not Processed Due to Input Validation Errors', { status: false, errors: errors.array() });
  }
  next();
}

module.exports = {
  validateUserRegistration,
  validateUserLogin,
  validateTaskCreation,
  validateBlogCreation,
  validateProductCreation,
  validateUserToken
};
