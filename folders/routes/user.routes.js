const express = require('express');
const userController = require('../controllers/user.controller');
const { validateUserLogin, validateUserRegistration, validateRefreshToken } = require('../middlewares/validation.middleware');
const { loginLimiter, registerLimiter } = require('../../config/api-rate-limit');

const router = express.Router();

router.post("/login", loginLimiter, validateUserLogin, userController.loginUser);
router.post("/sign-up", registerLimiter, validateUserRegistration, userController.createUser);
router.post("/refresh-token", validateRefreshToken, userController.generateRefreshToken)

module.exports = router;
