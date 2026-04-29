const bcrypt = require('bcrypt');
const userService = require('../services/user.service');
const environment = require('../config/env');
const { sendSuccess, sendError } = require('../utils/response.util');

const getSafeUserData = async (data) => {
  const allowedFields = [
    'name',
    'email',
    'password',
    'role',
    'profilePicture',
    'phone',
    'bio',
    'isVerified',
    'userStatus',
  ];
  const payload = {};

  allowedFields.forEach((field) => {
    if (Object.prototype.hasOwnProperty.call(data, field)) {
      payload[field] = data[field];
    }
  });

  if (payload.password) {
    const saltRounds = environment.mode === 'development' ? 10 : 12;
    payload.password = await bcrypt.hash(payload.password, saltRounds);
  }

  return payload;
};

exports.getAllUsers = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = limit === -1 ? 0 : (page - 1) * limit;
    const order = req.query.order || { createdAt: -1 };
    const query = {};
    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } },
      ];
    }
    if (req.query.role) query.role = req.query.role;
    if (req.query.userStatus) query.userStatus = req.query.userStatus;
    const users = await userService.getAllUsers(query, order, skip, limit);
    const total = await userService.countUsers(query);
    return sendSuccess(res, 200, { users, total, page, limit }, 'Users fetched successfully');
  } catch (error) {
    return sendError(res, 500, error.message || 'Internal server error');
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) return sendError(res, 404, 'User not found');
    return sendSuccess(res, 200, user, 'User fetched successfully');
  } catch (error) {
    return sendError(res, 500, error.message || 'Internal server error');
  }
};

exports.createUser = async (req, res) => {
  try {
    const data = await getSafeUserData(req.body);
    const user = await userService.saveUser(data);
    const modifiedUser = user.toObject();
    delete modifiedUser.password;
    delete modifiedUser.refreshToken;
    return sendSuccess(res, 201, modifiedUser, 'User created successfully');
  } catch (error) {
    if (error.code === 11000) return sendError(res, 409, 'Email already exists');
    return sendError(res, 500, error.message || 'Internal server error');
  }
};

exports.updateUser = async (req, res) => {
  try {
    const data = await getSafeUserData(req.body);
    const user = await userService.updateUser(req.params.id, data);
    if (!user) return sendError(res, 404, 'User not found');
    return sendSuccess(res, 200, user, 'User updated successfully');
  } catch (error) {
    if (error.code === 11000) return sendError(res, 409, 'Email already exists');
    return sendError(res, 500, error.message || 'Internal server error');
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await userService.deleteUser(req.params.id);
    if (!user) return sendError(res, 404, 'User not found');
    return sendSuccess(res, 200, user, 'User deleted successfully');
  } catch (error) {
    return sendError(res, 500, error.message || 'Internal server error');
  }
};
