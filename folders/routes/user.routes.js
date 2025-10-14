const express = require('express');
const userController = require('../controllers/user.controller');
const { validateUserLogin, validateUserRegistration, validateRefreshToken, validateUserToken } = require('../middlewares/validation.middleware');
const { loginLimiter, registerLimiter } = require('../../config/api-rate-limit');
const { ROLES } = require('../utility/enum');
const { checkRole } = require('../middlewares/roles.middleware');

const router = express.Router();

router.post("/login", loginLimiter, validateUserLogin, userController.loginUser);
router.post("/refresh-token", validateRefreshToken, userController.generateRefreshToken);
router.post("/logout", validateUserToken, userController.logout);
router.post("/sign-up", registerLimiter, validateUserRegistration, userController.createUser);
router.get("/all-users", validateUserToken, checkRole([ROLES.ADMIN]), userController.getAllUsers)

module.exports = router;
