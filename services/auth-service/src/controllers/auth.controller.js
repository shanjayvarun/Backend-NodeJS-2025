const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userService = require('../services/user.service');
const environment = require('../config/env');
const { sendSuccess, sendError } = require('../utils/response.util');

exports.loginUser = async (req, res) => {
  try {
    const user = await userService.findOneByEmail(req.body.email);
    if (!user) return sendError(res, 404, 'User not found');
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) return sendError(res, 401, 'Invalid email or password');
    const accessToken = jwt.sign(
      { id: user._id, role: user.role, email: user.email, name: user.name },
      environment.jwt.accessSecret,
      { expiresIn: environment.jwt.accessExpiresIn, algorithm: environment.jwt.algorithm }
    );
    const refreshToken = jwt.sign(
      { id: user._id, role: user.role, email: user.email, name: user.name },
      environment.jwt.refreshSecret,
      { expiresIn: environment.jwt.refreshExpiresIn, algorithm: environment.jwt.algorithm }
    );
    await userService.updateUser(user._id, { lastLoginAt: new Date(), refreshToken });
    return sendSuccess(
      res,
      200,
      {
        accessToken,
        refreshToken,
        user: {
          id: user._id,
          name: user.name,
          role: user.role,
          lastLoginAt: user.lastLoginAt,
        },
      },
      'User logged in successfully'
    );
  } catch (error) {
    return sendError(res, 500, error.message || 'Internal server error');
  }
};

exports.generateRefreshToken = async (req, res) => {
  try {
    const decoded = jwt.verify(req.body.refreshToken, environment.jwt.refreshSecret);
    const user = await userService.getUserById(decoded.id);
    if (!user || user.refreshToken !== req.body.refreshToken) {
      return sendError(res, 403, 'Invalid refresh token');
    }
    const newAccessToken = jwt.sign(
      { id: user._id, role: user.role, email: user.email, name: user.name },
      environment.jwt.accessSecret,
      { expiresIn: environment.jwt.accessExpiresIn, algorithm: environment.jwt.algorithm }
    );
    return sendSuccess(res, 201, { newAccessToken }, 'Token refreshed successfully');
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

exports.logout = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return sendError(res, 400, 'Token required');
    const decoded = jwt.verify(token, environment.jwt.accessSecret);
    await userService.updateUser(decoded.id, { refreshToken: null });
    return res.status(204).json({ statusCode: 204 });
  } catch (error) {
    return sendError(res, 403, 'Invalid token');
  }
};

exports.createUser = async (req, res) => {
  try {
    const saltRounds = environment.mode === 'development' ? 10 : 12;
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    const user = await userService.saveUser({ ...req.body, password: hashedPassword });
    const modifiedUser = user.toObject();
    delete modifiedUser.password;
    return sendSuccess(res, 201, modifiedUser, 'User registered successfully');
  } catch (error) {
    if (error.code === 11000) return sendError(res, 409, 'Email already exists');
    return sendError(res, 500, error.message);
  }
};

exports.changeUserPassword = async (req, res) => {
  try {
    const user = await userService.findOneByEmail(req.user.email);
    if (!user) return sendError(res, 404, 'User not found');

    const isMatch = await bcrypt.compare(req.body.oldPassword, user.password);
    if (!isMatch) return sendError(res, 401, 'Existing password does not match the current one');

    const saltRounds = environment.mode === 'development' ? 10 : 12;
    const hashedPassword = await bcrypt.hash(req.body.newPassword, saltRounds);

    await userService.changePasswordByEmail(req.user.email, hashedPassword);
    return sendSuccess(res, 200, null, 'Password updated successfully');
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};
