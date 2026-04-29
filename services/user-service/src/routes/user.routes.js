const express = require('express');
const userController = require('../controllers/user.controller');
const {
  validateUserToken,
  authorizeRoles,
  authorizeSelfOrRoles,
  validateMongoId,
  validateGetUsers,
  validateCreateUser,
  validateUpdateUser,
} = require('../middlewares/user.middleware');

const router = express.Router();

router.get('/', validateUserToken, authorizeRoles(['ADMIN']), validateGetUsers, userController.getAllUsers);
router.get('/:id', validateUserToken, validateMongoId, authorizeSelfOrRoles(['ADMIN']), userController.getUserById);
router.post('/', validateUserToken, authorizeRoles(['ADMIN']), validateCreateUser, userController.createUser);
router.patch('/:id', validateUserToken, validateMongoId, authorizeSelfOrRoles(['ADMIN']), validateUpdateUser, userController.updateUser);
router.delete('/:id', validateUserToken, validateMongoId, authorizeRoles(['ADMIN']), userController.deleteUser);

module.exports = router;
