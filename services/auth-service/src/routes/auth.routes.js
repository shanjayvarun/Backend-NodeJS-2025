const express = require('express');
const authController = require('../controllers/auth.controller');
const { validateUserRegistration, validateUserLogin, validateRefreshToken, validateUserToken, } = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/login', validateUserLogin, authController.loginUser);
router.post('/refresh-token', validateRefreshToken, authController.generateRefreshToken);
router.post('/logout', validateUserToken, authController.logout);
router.post('/sign-up', validateUserRegistration, authController.createUser);
router.patch('/change-password', validateUserToken, authController.changeUserPassword);

module.exports = router;