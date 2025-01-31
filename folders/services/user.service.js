const User = require('../models/user.model');

exports.saveUser = async (data) => {
  const user = new User(data);
  return await user.save();
};

exports.getUserById = async (id) => {
  return await User.findById(id);
};

exports.findOneByEmail = async (data) => {
  const user = await User.findOne({ email: data });
  return user;
};

