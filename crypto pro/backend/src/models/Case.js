const mongoose = require('mongoose');

const FactorSchema = new mongoose.Schema({
  t: { type: String, required: true },
  w: { type: String, required: true },
  weight: { type: Number },
  cat: { type: String }
}, { _id: false });

const AiFindingSchema = new mongoose.Schema({
  t: { type: String, required: true },
  c: { type: Number, required: true }
}, { _id: false });

const IntermediarySchema = new mongoose.Schema({
  address: { type: String, required: true },
  role: { type: String, required: true },
  txCount: { type: Number, default: 0 },
  amount: { type: Number, default: 0 },
  risk: { type: String, default: 'Medium' },
  reason: { type: String, default: '' }
}, { _id: false });

const CounterpartySchema = new mongoose.Schema({
  address: { type: String, required: true },
  label: { type: String, default: '' },
  type: { type: String, default: 'unknown' },
  txCount: { type: Number, default: 0 },
  totalIn: { type: Number, default: 0 },
  totalOut: { type: Number, default: 0 },
  first: { type: Date },
  last: { type: Date },
  risk: { type: String, default: 'Medium' }
}, { _id: false });

const CrossChainSchema = new mongoose.Schema({
  from: { type: String, required: true },
  to: { type: String, required: true },
  bridge: { type: String, required: true },
  amount: { type: Number, default: 0 },
  hash: { type: String, required: true },
  risk: { type: String, default: 'Medium' },
  time: { type: Date }
}, { _id: false });

const ExchangeAttributionSchema = new mongoose.Schema({
  name: { type: String, default: 'Unknown' },
  clusterId: { type: String, default: '' },
  type: { type: String, default: '' },
  region: { type: String, default: '' },
  jurisdictionRisk: { type: String, default: 'Medium' },
  complianceLevel: { type: String, default: '' },
  confidence: { type: Number, default: 50 },
  status: { type: String, default: 'SUSPECTED' },
  priorFilings: { type: Number, default: 0 },
  supportingEvidence: [{ type: String }]
}, { _id: false });

const CaseSchema = new mongoose.Schema({
  caseId: { type: String, required: true, unique: true, index: true },
  address: { type: String, required: true, index: true },
  chain: { type: String, required: true },
  fraudType: { type: String, required: true },
  score: { type: Number, required: true },
  level: { type: String, required: true, enum: ['Low', 'Medium', 'High', 'Critical'] },
  txCount: { type: Number, default: 0 },
  totalReceived: { type: Number, default: 0 },
  totalSent: { type: Number, default: 0 },
  victimAddress: { type: String },
  exchangeDepositAddress: { type: String },
  factors: [FactorSchema],
  aiFindings: [AiFindingSchema],
  exchange: ExchangeAttributionSchema,
  confidence: { type: Number, default: 50 },
  intermediaries: [IntermediarySchema],
  counterparties: [CounterpartySchema],
  crossChain: [CrossChainSchema],
  recommendations: [{ type: String }],
  txHashes: [{ type: String }],
  sampleSize: { type: Number, default: 0 },
  firstTx: { type: Date },
  lastTx: { type: Date },
  status: { type: String, default: 'Analyzed' }
}, {
  timestamps: true
});

module.exports = mongoose.model('Case', CaseSchema);
