const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  caseId: { type: String, required: true, index: true },
  hash: { type: String, required: true, index: true },
  block: { type: Number, required: true },
  timestamp: { type: Date, required: true },
  direction: { type: String, enum: ['IN', 'OUT'], required: true },
  asset: { type: String, required: true },
  amountUsd: { type: Number, required: true },
  counterparty: { type: String, required: true, index: true },
  counterpartyLabel: { type: String, default: '' },
  counterpartyType: { type: String, default: 'unknown' },
  status: { type: String, default: 'Confirmed' },
  riskFlag: { type: Boolean, default: false }
}, {
  timestamps: true
});

module.exports = mongoose.model('Transaction', TransactionSchema);
