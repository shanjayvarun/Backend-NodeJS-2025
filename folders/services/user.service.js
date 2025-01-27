const User = require('../models/user.model');

exports.saveUser = async (userData) => {
  const user = new User(userData);
  return await user.save();
};

exports.getUserById = async (id) => {
  return await User.findById(id);
};

exports.findOneByEmail = async (userData) => {
  const user = await User.findOne({ email: userData });
  return user;
};

