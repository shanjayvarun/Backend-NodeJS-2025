const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    roleType: { type: String, default: "USER" },
    profilePicture: { type: String },
    phone: { type: String, default: null },
    bio: { type: String, default: '' },
    address: {
      street: { type: String, default: '' },
      city: { type: String, default: '' },
      country: { type: String, default: '' },
      zipCode: { type: String, default: '' }
    },
    isVerified: { type: Boolean, default: false },
    socialLinks: {
      linkedin: { type: String, default: '' },
      twitter: { type: String, default: '' }
    },
    lastLoginAt: { type: Date, default: null }
  },
  {
    timestamps: true,
    versionKey: false
  });

module.exports = mongoose.model('User', userSchema);
