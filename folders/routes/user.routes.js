const express = require('express');
const userController = require('../controllers/user.controller');
const { validateUserLogin, validateUserRegistration } = require('../middlewares/validation.middleware');

const router = express.Router();

router.post("/login", validateUserLogin, userController.loginUser);
router.post("/users", validateUserRegistration, userController.createUser);

module.exports = router;
