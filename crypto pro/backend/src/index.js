require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB, isDbConnected } = require('./config/db');
const { checkAiHealth } = require('./services/aiClient');

const {
  handleAnalyze,
  handleGetCases,
  handleGetCaseById,
  handleGetTransactions,
  handleGetAlerts,
  handleCreateAlert,
  handleGetStats
} = require('./controllers/caseController');

const { handleCopilotChat } = require('./controllers/copilotController');
const {
  handleLogin,
  handleRegister,
  handleRequestOtp,
  handleVerifyOtp,
  handleVerifySession,
  handleGetUsers,
  handleUpdateUser,
  handleDeleteUser,
  handleGetAuditLogs,
  handleChangePassword,
  handleContactSupport,
  requireAuth,
  requireAdmin
} = require('./controllers/authController');

const app = express();
const PORT = process.env.PORT || 5000;

// Security Headers Middleware
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '1mb' }));

// Input sanitization against NoSQL query operator injection
app.use((req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    const sanitize = (obj) => {
      for (const k in obj) {
        if (k.startsWith('$') || k.includes('.')) {
          delete obj[k];
        } else if (typeof obj[k] === 'object' && obj[k] !== null) {
          sanitize(obj[k]);
        }
      }
    };
    sanitize(req.body);
  }
  next();
});

// Authentication Routes
app.post('/api/auth/login', handleLogin);
app.post('/api/auth/register', handleRegister);
app.post('/api/auth/otp/request', handleRequestOtp);
app.post('/api/auth/otp/verify', handleVerifyOtp);
app.post('/api/auth/verify', handleVerifySession);
app.post('/api/auth/profile/password', requireAuth, handleChangePassword);
app.post('/api/support/contact', handleContactSupport);

// Admin Management Routes (Requires Super-Admin Token)
app.get('/api/admin/users', requireAdmin, handleGetUsers);
app.put('/api/admin/users/:id', requireAdmin, handleUpdateUser);
app.delete('/api/admin/users/:id', requireAdmin, handleDeleteUser);
app.get('/api/admin/logs', requireAdmin, handleGetAuditLogs);

// Core Investigation Routes
app.post('/api/analyze', requireAuth, handleAnalyze);
app.get('/api/cases', requireAuth, handleGetCases);
app.get('/api/cases/:id', requireAuth, handleGetCaseById);
app.get('/api/cases/:id/transactions', requireAuth, handleGetTransactions);
app.get('/api/alerts', requireAuth, handleGetAlerts);
app.post('/api/alerts', requireAuth, handleCreateAlert);
app.get('/api/stats', handleGetStats);
app.post('/api/ai/copilot', requireAuth, handleCopilotChat);

// Health check endpoint
app.get('/api/health', async (req, res) => {
  const aiHealth = await checkAiHealth();
  res.json({
    server: 'online',
    port: PORT,
    database: {
      type: 'MongoDB',
      connected: isDbConnected(),
      mode: isDbConnected() ? 'MongoDB Active' : 'Memory Fallback Active'
    },
    aiService: aiHealth
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Server Error]', err.stack || err);
  res.status(500).json({ success: false, error: err.message || 'Internal Server Error' });
});

// Start server
async function startServer() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`[*] CryptoTrace Node.js Backend listening on http://127.0.0.1:${PORT}`);
  });
}

startServer();
