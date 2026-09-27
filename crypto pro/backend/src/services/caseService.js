const Case = require('../models/Case');
const Transaction = require('../models/Transaction');
const Alert = require('../models/Alert');
const { isDbConnected } = require('../config/db');
const { scoreWalletWithAi, attributeVaspWithAi } = require('./aiClient');
const { generateLedgerAndEntities } = require('./blockchainGenerator');

// In-memory fallback / cache
const MEMORY_CASES = new Map();
const MEMORY_TRANSACTIONS = new Map();
const MEMORY_ALERTS = [];
let caseCounter = 142;

async function analyzeAndSaveCase(address, chain, fraudType, victimAddress) {
  // 1. Query Python AI Service
  const [aiRisk, aiVasp] = await Promise.all([
    scoreWalletWithAi(address, chain, fraudType),
    attributeVaspWithAi(address, chain, fraudType)
  ]);

  // 2. Generate deterministic blockchain ledger and case model
  const generated = generateLedgerAndEntities(
    address,
    chain,
    fraudType,
    aiRisk,
    aiVasp,
    caseCounter++,
    victimAddress
  );

  // 3. Persist to MongoDB if connected, and update memory store
  const { transactions, alerts, ...caseData } = generated;

  MEMORY_CASES.set(caseData.caseId, generated);
  MEMORY_TRANSACTIONS.set(caseData.caseId, transactions || []);
  (alerts || []).forEach(a => {
    MEMORY_ALERTS.unshift({ ...a, caseId: caseData.caseId, wallet: address, time: caseData.lastTx });
  });

  if (isDbConnected()) {
    try {
      // Upsert case
      await Case.findOneAndUpdate(
        { caseId: caseData.caseId },
        caseData,
        { upsert: true, new: true }
      );

      // Insert transactions
      const txDocs = (transactions || []).map(t => ({ ...t, caseId: caseData.caseId }));
      if (txDocs.length > 0) {
        await Transaction.deleteMany({ caseId: caseData.caseId });
        await Transaction.insertMany(txDocs);
      }

      // Insert alerts
      const alertDocs = (alerts || []).map(a => ({
        caseId: caseData.caseId,
        wallet: address,
        sev: a.sev,
        msg: a.msg,
        reason: a.reason,
        action: a.action,
        time: caseData.lastTx
      }));
      if (alertDocs.length > 0) {
        await Alert.insertMany(alertDocs);
      }
    } catch (err) {
      console.warn(`[MongoDB Error] Error writing case to Mongo: ${err.message}`);
    }
  }

  return generated;
}

async function getAllCases(limit = 20) {
  if (isDbConnected()) {
    try {
      const cases = await Case.find({}).sort({ createdAt: -1 }).limit(limit).lean();
      if (cases && cases.length > 0) return cases;
    } catch (err) {
      console.warn(`[MongoDB Error] Error fetching cases: ${err.message}`);
    }
  }
  return Array.from(MEMORY_CASES.values()).slice(0, limit);
}

async function getCaseById(caseId) {
  if (isDbConnected()) {
    try {
      const found = await Case.findOne({
        $or: [{ caseId }, { id: caseId }, { address: caseId }]
      }).lean();
      if (found) {
        const txs = await Transaction.find({ caseId: found.caseId }).sort({ timestamp: -1 }).lean();
        return { ...found, transactions: txs };
      }
    } catch (err) {
      console.warn(`[MongoDB Error] Error fetching case ${caseId}: ${err.message}`);
    }
  }
  return MEMORY_CASES.get(caseId) ||
    Array.from(MEMORY_CASES.values()).find(c => c.caseId === caseId || c.id === caseId || c.address === caseId) ||
    null;
}

async function getCaseTransactions(caseId) {
  if (isDbConnected()) {
    try {
      const txs = await Transaction.find({ caseId }).sort({ timestamp: -1 }).lean();
      if (txs && txs.length > 0) return txs;
    } catch (err) {
      console.warn(`[MongoDB Error] Error fetching txs: ${err.message}`);
    }
  }
  return MEMORY_TRANSACTIONS.get(caseId) || [];
}

async function getAllAlerts(limit = 40) {
  if (isDbConnected()) {
    try {
      const alerts = await Alert.find({}).sort({ createdAt: -1 }).limit(limit).lean();
      if (alerts && alerts.length > 0) return alerts;
    } catch (err) {
      console.warn(`[MongoDB Error] Error fetching alerts: ${err.message}`);
    }
  }
  return MEMORY_ALERTS.slice(0, limit);
}

async function createAlert(alertData) {
  const alertDoc = {
    caseId: alertData.caseId || 'CT-MANUAL',
    wallet: alertData.wallet || '0x0000000000000000000000000000000000000000',
    sev: alertData.sev || 'HIGH',
    msg: alertData.msg,
    reason: alertData.reason || '',
    action: alertData.action || '',
    time: new Date()
  };

  MEMORY_ALERTS.unshift(alertDoc);

  if (isDbConnected()) {
    try {
      const created = await Alert.create(alertDoc);
      return created.toObject ? created.toObject() : created;
    } catch (err) {
      console.warn(`[MongoDB Error] Error creating alert: ${err.message}`);
    }
  }

  return alertDoc;
}

async function getSystemStats() {
  const cases = await getAllCases(100);
  const criticalOrHigh = cases.filter(c => c.level === 'Critical' || c.level === 'High').length;
  
  return {
    walletsAnalyzed: 2847 + cases.length,
    highCriticalRisk: 412 + criticalOrHigh,
    suspectedExchanges: 96,
    activeInvestigations: 58 + cases.length,
    crossChainTx: 214,
    totalFundsTraced: '$18.4M',
    recentCasesCount: cases.length,
    dbStatus: isDbConnected() ? 'connected' : 'memory_fallback'
  };
}

module.exports = {
  analyzeAndSaveCase,
  getAllCases,
  getCaseById,
  getCaseTransactions,
  getAllAlerts,
  createAlert,
  getSystemStats
};
