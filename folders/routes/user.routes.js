const express = require('express');
const userController = require('../controllers/user.controller');
const { validateUserLogin, validateUserRegistration, validateToken} = require('../middlewares/validation.middleware');

const router = express.Router();

router.post("/login", validateUserLogin, userController.loginUser);
router.post("/sign-up", validateUserRegistration, userController.createUser);
router.patch("/update-user/:id", validateToken, userController.updateUser);

module.exports = router;
