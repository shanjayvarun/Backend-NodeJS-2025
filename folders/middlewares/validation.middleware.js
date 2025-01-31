const { body, validationResult } = require("express-validator");

const validateUserRegistration = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Invalid email format"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  body("roleType").optional().isIn(["ADMIN", "USER"]).withMessage("Invalid role type"),
  handleValidationErrors
];

const validateUserLogin = [
  body("email").isEmail().withMessage("Invalid email format"),
  body("password").notEmpty().withMessage("Password is required"),
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
  validateUserLogin
};
