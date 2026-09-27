const {
  analyzeAndSaveCase,
  getAllCases,
  getCaseById,
  getCaseTransactions,
  getAllAlerts,
  createAlert,
  getSystemStats
} = require('../services/caseService');

async function handleAnalyze(req, res) {
  try {
    const { address, victimAddress, chain = 'Ethereum', fraudType = 'Investment Scam' } = req.body;
    if (!address || !address.trim()) {
      return res.status(400).json({ success: false, error: 'Suspect / target wallet address is required' });
    }

    const result = await analyzeAndSaveCase(
      address.trim(),
      chain,
      fraudType,
      victimAddress ? victimAddress.trim() : ''
    );
    return res.json({ success: true, data: result });
  } catch (err) {
    console.error('Error in handleAnalyze:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

async function handleGetCases(req, res) {
  try {
    const cases = await getAllCases(30);
    return res.json({ success: true, data: cases });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

async function handleGetCaseById(req, res) {
  try {
    const { id } = req.params;
    const found = await getCaseById(id);
    if (!found) {
      return res.status(404).json({ success: false, error: 'Case not found' });
    }
    return res.json({ success: true, data: found });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

async function handleGetTransactions(req, res) {
  try {
    const { id } = req.params;
    const txs = await getCaseTransactions(id);
    return res.json({ success: true, data: txs });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

async function handleGetAlerts(req, res) {
  try {
    const alerts = await getAllAlerts(50);
    return res.json({ success: true, data: alerts });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

async function handleCreateAlert(req, res) {
  try {
    const { caseId, wallet, sev, msg, reason, action } = req.body;
    if (!msg || !msg.trim()) {
      return res.status(400).json({ success: false, error: 'Alert message is required' });
    }
    if (!wallet || !wallet.trim()) {
      return res.status(400).json({ success: false, error: 'Target wallet address is required' });
    }

    const created = await createAlert({
      caseId: caseId ? caseId.trim() : 'CT-MANUAL',
      wallet: wallet.trim(),
      sev: sev || 'HIGH',
      msg: msg.trim(),
      reason: reason ? reason.trim() : '',
      action: action ? action.trim() : ''
    });

    return res.status(201).json({ success: true, data: created });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

async function handleGetStats(req, res) {
  try {
    const stats = await getSystemStats();
    return res.json({ success: true, data: stats });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

module.exports = {
  handleAnalyze,
  handleGetCases,
  handleGetCaseById,
  handleGetTransactions,
  handleGetAlerts,
  handleCreateAlert,
  handleGetStats
};
