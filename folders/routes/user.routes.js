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
router.get("/all-users", validateUserToken, checkRole([ROLES.ADMIN, ROLES.MANAGER]), userController.getAllUsers);
router.get("/all-user-by-id/:id", validateUserToken, checkRole([ROLES.ADMIN, ROLES.MANAGER]), userController.getUserById);
router.put("/update-user/:id", validateUserToken, checkRole([ROLES.ADMIN, ROLES.MANAGER]), userController.updateUser);
router.delete('/delete-user/:id', validateUserToken, checkRole([ROLES.ADMIN, ROLES.MANAGER]), userController.deleteUser)
router.patch('/change-password', validateUserToken, checkRole([ROLES.ADMIN]), userController.changeUserPassword)

module.exports = router;
