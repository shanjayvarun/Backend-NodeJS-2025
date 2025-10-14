const userService = require('../services/user.service');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { hashPassword } = require('../utility/utility');
const { sendSuccessPost, sendSuccessGet, sendError, sendSuccessNoContent } = require('../utility/responses');
const { saveBlackListedTokens } = require('../services/blaclistedtoken.service');

exports.loginUser = (req, res, next) => {
  passport.authenticate('local', async (error, user, info) => {
    if (error) {
      return sendError(res, 500, error.message || 'Internal server error');
    }
    if (!user) {
      return sendError(res, 404, info.message);
    }
    const accessToken = jwt.sign({ id: user._id, role: user.role, email: user.email, name: user.name }, process.env.JWT_ACCESS_SECRET, { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN, algorithm: process.env.JWT_ALGO });
    const refreshToken = jwt.sign({ id: user._id, role: user.role, email: user.email, name: user.name }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN, algorithm: process.env.JWT_ALGO });
    await userService.updateUser(user._id, { lastLoginAt: new Date(), refreshToken });
    return sendSuccessGet(res, {
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        lastLoginAt: user.lastLoginAt
      }
    }, 'User logged in successfully');
  })(req, res, next);
};

exports.generateRefreshToken = async (req, res) => {
  try {
    const decoded = jwt.verify(req.body.refreshToken, process.env.JWT_REFRESH_SECRET)
    const user = await userService.getUserById(decoded.id)
    if (!user || user.refreshToken !== req.body.refreshToken) return sendError(res, 403, 'Invalid refresh token');
    const newAccessToken = jwt.sign({ id: user._id, role: user.role, email: user.email, name: user.name }, process.env.JWT_ACCESS_SECRET, { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN, algorithm: process.env.JWT_ALGO });
    return sendSuccessPost(res, { newAccessToken }, 'Token refreshed successfully')
  } catch (error) {
    return sendError(error, 500, error.message);
  }
};

exports.logout = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return sendError(res, 400, 'Token Required');
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
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