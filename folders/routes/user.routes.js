const express = require('express');
const userController = require('../controllers/user.controller');
const { validateUserLogin, validateUserRegistration, validateUserToken} = require('../middlewares/validation.middleware');
const { checkRole } = require('../middlewares/roles.middleware');
const { ROLES } = require('../utility/enum');

const router = express.Router();

router.post("/login", validateUserLogin, userController.loginUser);
router.post("/sign-up", validateUserRegistration, userController.createUser);
router.patch("/update-user/:id", validateUserToken, checkRole([ROLES.ADMIN]), userController.updateUser);

module.exports = router;
