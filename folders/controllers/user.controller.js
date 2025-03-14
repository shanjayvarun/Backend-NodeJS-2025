const userService = require('../services/user.service');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { hashPassword } = require('../utility/utility');
const { sendSuccessPost, sendSuccessGet, sendError, sendSuccessUpdateOrDelete } = require('../utility/responses');

exports.loginUser = (req, res, next) => {
  passport.authenticate('local', async (error, user, info) => {
    if (error) {
      return sendError(res, 500, error.message || 'Internal server error');
    }
    if (!user) {
      return sendError(res, 404, info.message);
    }
    const token = jwt.sign({ id: user._id, role: user.role, email: user.email, name: user.name }, process.env.JWT_SECRET, { expiresIn: '24h' });
    await userService.updateUser(user._id, { lastLoginAt: new Date() });
    return sendSuccessGet(res, { token, role: user.role }, 'User logged in successfully');
  })(req, res, next);
};

exports.createUser = async (req, res) => {
  try {
    const hashedPassword = await hashPassword(req.body.password)
    req.body.password = hashedPassword
    const user = await userService.saveUser(req.body);
    if (user) {
      let modifiedUser = user.toObject()
      delete modifiedUser.password
      return sendSuccessPost(res, modifiedUser, 'User registered successfully');
    };
  } catch (error) {
    if (error.code == 11000) {
      return sendError(res, 409, 'Email already exists');
    }
    return sendError(res, 400, 'Failed to register user. Please check your input');
  }
};

exports.updateUser = async (req, res) => {
  try {
    if (req.body.password) {
      req.body.password = await hashPassword(req.body.password);
    }
    if (!req.body.profilePicture) delete req.body.profilePicture;
    const task = await userService.updateUser(req.params.id, req.body);
    return task ? sendSuccessUpdateOrDelete(res, 'User updated successfully') : sendError(res, 404, 'User not found');
  } catch (error) {
    return sendError(error, 400, error.message);
  }
}
