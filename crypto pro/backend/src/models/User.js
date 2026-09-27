const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['admin', 'investigator', 'senior_analyst'], default: 'investigator' },
  department: { type: String, default: 'Financial Crimes Cyber Unit' },
  badgeNumber: { type: String, default: '' },
  status: { type: String, enum: ['active', 'pending', 'suspended'], default: 'active' },
  otpCode: { type: String, default: null },
  otpExpiresAt: { type: Date, default: null },
  lastLogin: { type: Date, default: null }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', UserSchema);
