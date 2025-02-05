const express = require('express');
const userController = require('../controllers/user.controller');
const { validateUserLogin, validateUserRegistration } = require('../middlewares/validation.middleware');
const upload = require('../../config/upload-image.config');

const router = express.Router();

router.post("/login", validateUserLogin, userController.loginUser);
router.post("/sign-up", validateUserRegistration, userController.createUser);
router.put("/update-user/:id", userController.updateUser);

module.exports = router;
