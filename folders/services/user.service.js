const User = require('../models/user.model');

exports.saveUser = async (data) => {
  return await new User(data).save();
};

exports.getUserById = async (id) => {
  return await User.findById(id);
};

exports.findOneByEmail = async (email) => {
  return await User.findOne({ email: email });
};

exports.updateUser = async (id, data) => {
  return await User.findByIdAndUpdate(id, data, { new: true });
}

