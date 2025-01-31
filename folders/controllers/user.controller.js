const userService = require('../services/user.service');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { hashPassword } = require('../utility/utility');
const { sendSuccessPost, sendSuccessGet, sendError } = require('../middlewares/response.middleware');

exports.loginUser = (req, res, next) => {
  passport.authenticate('local', { failureRedirect: '/login' }, async (error, user, info) => {
    if (error) {
      return sendError(res, { statusCode: 500, details: error.message }, 'Internal server error');
    }
    if (!user) {
      return sendError(res, { statusCode: 404, details: info.message }, 'User not found');
    }
    const token = jwt.sign({ id: user._id, role: user.roleType }, process.env.JWT_SECRET, { expiresIn: '24h' });
    return sendSuccessGet(res, { accessToken: token }, 'User logged in successfully');
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
