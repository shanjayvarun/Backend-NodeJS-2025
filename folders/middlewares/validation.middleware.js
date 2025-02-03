const { body, validationResult } = require("express-validator");
const { ROLES, TASKSTATUS } = require("../utility/enum");

const validateUserRegistration = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Invalid email format"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  body("roleType").optional().isIn(Object.values(ROLES)).withMessage("Invalid role type"),
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

function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: false, errors: errors.array() });
  }
  next();
}

module.exports = {
  validateUserRegistration,
  validateUserLogin,
  validateTaskCreation
};
