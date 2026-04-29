const express = require('express');
const userController = require('../controllers/user.controller');
const {
  validateUserToken,
  validateMongoId,
  validateGetUsers,
  validateCreateUser,
  validateUpdateUser,
} = require('../middlewares/user.middleware');

const router = express.Router();

router.get('/', validateUserToken, validateGetUsers, userController.getAllUsers);
router.get('/:id', validateUserToken, validateMongoId, userController.getUserById);
router.post('/', validateUserToken, validateCreateUser, userController.createUser);
router.patch('/:id', validateUserToken, validateMongoId, validateUpdateUser, userController.updateUser);
router.delete('/:id', validateUserToken, validateMongoId, userController.deleteUser);

module.exports = router;
