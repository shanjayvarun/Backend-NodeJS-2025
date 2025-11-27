const userService = require('../services/user.service');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { hashPassword, comparePassword } = require('../utility/utility');
const { sendSuccessPost, sendSuccessGet, sendError, sendSuccessNoContent, sendSuccessUpdateOrDelete } = require('../utility/responses');
const { saveBlackListedTokens } = require('../services/blaclistedtoken.service');
const environment = require('../../config/env.config')

exports.loginUser = (req, res, next) => {
  passport.authenticate('local', async (error, user, info) => {
    if (error) {
      return sendError(res, 500, error.message || 'Internal server error');
    }
    if (!user) {
      return sendError(res, 404, info.message);
    }
    const accessToken = jwt.sign({ id: user._id, role: user.role, email: user.email, name: user.name }, environment.jwt.accessSecret, { expiresIn: environment.jwt.accessExpiresIn, algorithm: environment.jwt.algorithm });
    const refreshToken = jwt.sign({ id: user._id, role: user.role, email: user.email, name: user.name }, environment.jwt.refreshSecret, { expiresIn: environment.jwt.refreshExpiresIn, algorithm: environment.jwt.algorithm });
    await userService.updateUser(user._id, { lastLoginAt: new Date(), refreshToken });
    return sendSuccessGet(res, {
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        lastLoginAt: user.lastLoginAt,
        test: 'shanjay'
      }
    }, 'User logged in successfully');
  })(req, res, next);
};

exports.generateRefreshToken = async (req, res) => {
  try {
    const decoded = jwt.verify(req.body.refreshToken, environment.JWT_REFRESH_SECRET)
    const user = await userService.getUserById(decoded.id)
    if (!user || user.refreshToken !== req.body.refreshToken) return sendError(res, 403, 'Invalid refresh token');
    const newAccessToken = jwt.sign({ id: user._id, role: user.role, email: user.email, name: user.name }, environment.jwt.accessSecret, { expiresIn: environment.jwt.accessExpiresIn, algorithm: environment.jwt.algorithm });
    return sendSuccessPost(res, { newAccessToken }, 'Token refreshed successfully')
  } catch (error) {
    return sendError(error, 500, error.message);
  }
};

exports.logout = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return sendError(res, 400, 'Token Required');
    const decoded = jwt.verify(token, environment.jwt.accessSecret)
    await saveBlackListedTokens({ token, expiresAt: decoded.exp })
    await userService.updateUser(decoded.id, { refreshToken: null })
    return sendSuccessNoContent(res)
  } catch (error) {
    return sendError(res, 403, 'Invalid token');
  }
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
    return sendError(error, 500, error.message);
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    let { status, searchBy, skip, limit, order, fromDate, toDate } = req.query;
    let query = {};
    let sortOrder = {};
    skip = +skip || 0;
    limit = +limit || 10;
    if (status) query.userStatus = status;
    if (searchBy) query.name = searchBy;
    if (fromDate || toDate) {
      if (fromDate > toDate) return sendError(res, 400, 'fromDate cannot be greater than toDate');
      query.createdAt = {};
      query.createdAt.$gte = fromDate;
      query.createdAt.$lte = toDate;
    }
    sortOrder.createdAt = (order === 'desc') ? -1 : 1;
    let users = await userService.getAllUsers(query, sortOrder, skip, limit);
    if (!users || users.length === 0) return sendError(res, 404, 'No users found');
    return sendSuccessGet(res, { users, count: users.length }, 'Users fetched successfully');
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    user ? sendSuccessGet(res, user, 'User fetched successfully') : sendError(res, 404, 'No user found')
  } catch (error) {
    return sendError(res, 500, error.message);
  }
}

exports.updateUser = async (req, res) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body)
    user ? sendSuccessUpdateOrDelete(res, user, 'User updated successfully') : sendError(404, res, 'User not found')
  } catch (error) {
    return sendError(res, 500, error.message);
  }
}

exports.deleteUser = async (req, res) => {
  try {
    const user = await userService.deleteUser(req.params.id)
    user ? sendSuccessUpdateOrDelete(res, user, 'User deleted successfully') : sendError(res, 404, 'User not found')
  } catch (error) {
    return sendError(res, 500, error.message);
  }
}

exports.changeUserPassword = async (req, res) => {
  try {
    const user = await userService.findOneByEmail(req.user.email);
    if (!user) return sendError(res, 404, 'User not found');
    const isMatch = await comparePassword(req.body.oldPassword, user.password)
    if (!isMatch) return sendError(res, 401, 'Existing password does not match the current one');
    const hashedPassword = await hashPassword(req.body.newPassword)
    const updatedUser = await userService.changePasswordByEmail(req.user.email, hashedPassword);
    updatedUser ? sendSuccessUpdateOrDelete(res, 'Password updated successfully') : sendError(404, res, 'User not found')
  } catch (error) {
    return sendError(res, 500, error.message);
  }
}

exports.userStats = async (req, res) => {
  try {
    const stats = await userService.userStats();
    if (!stats) return sendError(res, 404, 'No users statistics found');
    return sendSuccessGet(res, stats, 'Users statistics fetched successfully');
  } catch (error) {
    return sendError(res, 500, error.message);
  }
}