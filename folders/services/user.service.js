const User = require('../models/user.model');

exports.saveUser = async (data) => {
  return await new User(data).save();
};

exports.getAllUsers = async (query, order, skip, limit) => {
  return await User
    .find(query)
    .select('-password -refreshToken')
    .sort(order)
    .skip(skip)
    .limit(limit === -1 ? 0 : limit)
    .lean();
};

exports.getUserById = async (id) => {
  return await User.findById(id).select("-password -refreshToken").lean();
};

exports.findOneByEmail = async (email) => {
  return await User.findOne({ email: email }).lean();
};

exports.updateUser = async (id, data) => {
  return await User.findByIdAndUpdate(id, data, { new: true }).select('-password -refreshToken').lean();
}

exports.changePasswordByEmail = async (email, hashPassword) => {
  return await User.findOneAndUpdate({ email: email }, { password: hashPassword }, { new: true }).select('-password -refreshToken').lean();
}

exports.deleteUser = async (id) => {
  return await User.findByIdAndDelete(id).select("-password -refreshToken").lean()
}

exports.userStats = async () => {
  const totalUsers = await User.countDocuments()
  const activeUsers = await User.countDocuments({ userStatus: 'active' });
  const inactiveUsers = await User.countDocuments({ userStatus: 'inactive' });
  const pendingUsers = await User.countDocuments({ userStatus: 'pending' });
  const rolesAggregation = await User.aggregate([
    { $group: { _id: '$role', count: { $sum: 1 } } }
  ])
  const usersByRole = rolesAggregation.reduce((accumulator, element) => {
    accumulator[element._id] = element.count
    return accumulator
  }, {})
  const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  const usersByMonth = await User.countDocuments({
    createdAt: { $gte: startOfMonth }
  })
  const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5).select("-password -refreshToken").lean()
  const results = { totalUsers, activeUsers, inactiveUsers, pendingUsers, usersByRole, usersByMonth, recentUsers }
  return results
}