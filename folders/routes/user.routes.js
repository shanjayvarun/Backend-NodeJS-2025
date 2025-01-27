const express = require('express');
const userController = require('../controllers/user.controller');
const { loginValidations } = require('../middlewares/validation.middleware');

const router = express.Router();

router.post('/login', loginValidations, userController.loginUser);
router.post('/users', userController.createUser);
router.get('/users/:id', userController.getUserById);

module.exports = router;
