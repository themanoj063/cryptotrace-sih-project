const axios = require('axios');

const AI_URL = process.env.AI_SERVICE_URL || 'http://127.0.0.1:5001';

async function scoreWalletWithAi(address, chain, fraudType) {
  try {
    const res = await axios.post(`${AI_URL}/api/ai/score-wallet`, {
      address,
      chain,
      fraudType
    }, { timeout: 3500 });
    if (res.data && res.data.success) {
      return res.data.data;
    }
  } catch (err) {
    console.warn(`[AI Service] Python score-wallet unreachable (${err.message}) - using local fallback`);
  }
  return null;
}

async function attributeVaspWithAi(address, chain, fraudType) {
  try {
    const res = await axios.post(`${AI_URL}/api/ai/attribute-vasp`, {
      address,
      chain,
      fraudType
    }, { timeout: 3500 });
    if (res.data && res.data.success) {
      return res.data.data;
    }
  } catch (err) {
    console.warn(`[AI Service] Python attribute-vasp unreachable (${err.message}) - using local fallback`);
  }
  return null;
}

async function chatWithCopilotAi(message, caseContext) {
  try {
    const res = await axios.post(`${AI_URL}/api/ai/copilot-chat`, {
      message,
      caseContext
    }, { timeout: 4000 });
    if (res.data && res.data.success) {
      return res.data.data;
    }
  } catch (err) {
    console.warn(`[AI Service] Python copilot unreachable (${err.message}) - using local fallback`);
  }

  // Fallback response if Python service is offline
  return {
    reply: `### Forensic Copilot (Local Intelligence Engine)\n\nResponding to inquiry: *"${message}"*\n\nTarget wallet \`${caseContext?.address || 'Suspect'}\` (${caseContext?.chain || 'Blockchain'}) is rated **${caseContext?.score || 75}/100 (${caseContext?.level || 'High'} Risk)**.\n\nRecommended actions:\n- Freeze associated deposit accounts on ${caseContext?.exchange?.name || 'attributed VASP'}.\n- Subpoena IP/device logs matching transaction timestamps.\n- Issue watchlists on intermediary layering nodes.`,
    category: 'fallback_guidance',
    suggestedFollowUps: [
      'Draft freeze notice for VASP',
      'Explain risk factors',
      'List counterparty wallets'
    ]
  };
}

async function checkAiHealth() {
  try {
    const res = await axios.get(`${AI_URL}/health`, { timeout: 1500 });
    return res.data;
  } catch (err) {
    return { status: 'offline', error: err.message };
  }
}

module.exports = {
  scoreWalletWithAi,
  attributeVaspWithAi,
  chatWithCopilotAi,
  checkAiHealth
};
