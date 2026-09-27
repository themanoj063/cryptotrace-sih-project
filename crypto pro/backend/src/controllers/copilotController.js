const { chatWithCopilotAi } = require('../services/aiClient');

async function handleCopilotChat(req, res) {
  try {
    const { message, caseContext } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, error: 'Query message is required' });
    }

    const aiResponse = await chatWithCopilotAi(message.trim(), caseContext || {});
    return res.json({ success: true, data: aiResponse });
  } catch (err) {
    console.error('Error in handleCopilotChat:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

module.exports = {
  handleCopilotChat
};
