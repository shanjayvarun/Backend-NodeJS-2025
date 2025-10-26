const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
        email: { type: String, trim: true, lowercase: true, unique: true, required: true },
    password: { type: String, required: true },
    role: { type: String, default: "STAFF" },
    profilePicture: { type: String, default: '' },
    phone: { type: String, default: null },
    bio: { type: String, default: '' },
    isVerified: { type: Boolean, default: false },
    lastLoginAt: { type: Date, default: Date.now() },
    refreshToken: { type: String, default: null },
    userStatus: { type: String, default: 'active' },
  },
  {
    timestamps: true,
    versionKey: false
  });

module.exports = mongoose.model('User', userSchema);
