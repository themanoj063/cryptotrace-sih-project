const mongoose = require('mongoose');

const AlertSchema = new mongoose.Schema({
  caseId: { type: String, required: true, index: true },
  wallet: { type: String, required: true, index: true },
  sev: { type: String, enum: ['CRITICAL', 'HIGH', 'MEDIUM', 'INFO'], required: true },
  msg: { type: String, required: true },
  reason: { type: String, default: '' },
  action: { type: String, default: '' },
  time: { type: Date, default: Date.now }
}, {
  timestamps: true
});

module.exports = mongoose.model('Alert', AlertSchema);
