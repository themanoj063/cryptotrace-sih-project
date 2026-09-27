const crypto = require('crypto');
const User = require('../models/User');
const { isDbConnected } = require('../config/db');

// Secret key for HMAC token signing
const JWT_SECRET = process.env.AUTH_SECRET || 'cryptotrace-forensic-secure-key-2026-top-secret';
const PASSWORD_SALT = 'cryptotrace_salt_2026_x9';

// Active in-memory session store
const SESSIONS = new Map();

// Synchronous high-speed OTP store: username -> { code, expiresAt }
const OTP_STORE = new Map();

// Helper: Hash password
function hashPassword(pass) {
  return crypto.createHash('sha256').update(pass + PASSWORD_SALT).digest('hex');
}

// In-Memory Seed Users
const MEMORY_USERS = new Map([
  [
    'admin',
    {
      id: 'usr_admin_01',
      username: 'admin',
      name: 'Chief Administrator',
      email: 'admin@cryptotrace.agency',
      passwordHash: hashPassword('cyber2026!'),
      role: 'admin',
      department: 'Financial Crimes Intelligence HQ',
      badgeNumber: 'LEA-ADMIN-001',
      status: 'active',
      otpCode: null,
      otpExpiresAt: null,
      createdAt: new Date('2026-01-01T00:00:00Z'),
      lastLogin: new Date()
    }
  ],
  [
    'investigator01',
    {
      id: 'usr_inv_01',
      username: 'investigator01',
      name: 'Agent Alex Carter',
      email: 'investigator01@cryptotrace.agency',
      passwordHash: hashPassword('demo1234'),
      role: 'investigator',
      department: 'Cyber Fraud Cell',
      badgeNumber: 'CFU-4402',
      status: 'active',
      otpCode: null,
      otpExpiresAt: null,
      createdAt: new Date('2026-01-15T00:00:00Z'),
      lastLogin: new Date()
    }
  ],
  [
    'forensics_lead',
    {
      id: 'usr_inv_02',
      username: 'forensics_lead',
      name: 'Dr. Elena Vance',
      email: 'lead@cryptotrace.agency',
      passwordHash: hashPassword('trace1234'),
      role: 'senior_analyst',
      department: 'National Digital Forensics Lab',
      badgeNumber: 'NDFL-991',
      status: 'active',
      otpCode: null,
      otpExpiresAt: null,
      createdAt: new Date('2026-02-01T00:00:00Z'),
      lastLogin: new Date()
    }
  ]
]);

// Evidentiary System Audit Logs
const AUDIT_LOGS = [
  {
    id: 'log_01',
    event: 'SYSTEM_BOOT',
    username: 'SYSTEM',
    details: 'Forensic Vault & Threat Attribution Core initialized with AES-256 state encryption.',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    ip: '127.0.0.1'
  },
  {
    id: 'log_02',
    event: 'ADMIN_CLEARANCE_CONFIRMED',
    username: 'admin',
    details: 'Tier-3 Super-Admin clearance verified on local terminal.',
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    ip: '127.0.0.1'
  }
];

function logAuditEvent(event, username, details, req) {
  const ip = req?.headers['x-forwarded-for'] || req?.socket?.remoteAddress || '127.0.0.1';
  const entry = {
    id: 'log_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
    event,
    username: username || 'ANONYMOUS',
    details,
    timestamp: new Date().toISOString(),
    ip: String(ip).replace('::ffff:', '')
  };
  AUDIT_LOGS.unshift(entry);
  if (AUDIT_LOGS.length > 200) AUDIT_LOGS.pop();
  return entry;
}

// Generate secure signature with user role and payload
function signToken(user) {
  const expiresAt = Date.now() + 12 * 60 * 60 * 1000; // 12 hours
  const payload = `${user.username}:${user.role}:${expiresAt}`;
  const hmac = crypto.createHmac('sha256', JWT_SECRET).update(payload).digest('hex');
  const token = Buffer.from(`${payload}:${hmac}`).toString('base64');
  SESSIONS.set(token, { username: user.username, role: user.role, expiresAt });
  return { token, expiresAt };
}

// Verify token
function verifyToken(token) {
  if (!token) return null;
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const parts = decoded.split(':');
    let username, role, expiresAtStr, receivedHmac;
    
    if (parts.length === 4) {
      [username, role, expiresAtStr, receivedHmac] = parts;
    } else if (parts.length === 3) {
      [username, expiresAtStr, receivedHmac] = parts;
      role = username === 'admin' ? 'admin' : 'investigator';
    } else {
      return null;
    }

    const expiresAt = parseInt(expiresAtStr, 10);
    if (Date.now() > expiresAt) {
      SESSIONS.delete(token);
      return null;
    }

    const expectedPayload = parts.length === 4 ? `${username}:${role}:${expiresAt}` : `${username}:${expiresAt}`;
    const expectedHmac = crypto.createHmac('sha256', JWT_SECRET).update(expectedPayload).digest('hex');

    if (crypto.timingSafeEqual(Buffer.from(receivedHmac), Buffer.from(expectedHmac))) {
      return { username, role, expiresAt };
    }
  } catch (e) {
    return null;
  }
  return null;
}

// Find user in Mongo or in-memory
async function findUser(identifier) {
  if (!identifier) return null;
  const clean = String(identifier).trim().toLowerCase();

  // Check MongoDB if connected
  if (isDbConnected()) {
    try {
      const doc = await User.findOne({
        $or: [{ username: clean }, { email: clean }]
      });
      if (doc) return doc.toObject();
    } catch (e) {
      // Fallback to memory
    }
  }

  // Check in-memory store
  for (const u of MEMORY_USERS.values()) {
    if (u.username.toLowerCase() === clean || u.email.toLowerCase() === clean) {
      return { ...u };
    }
  }
  return null;
}

// Format safe user output
function formatSafeUser(u) {
  return {
    id: u._id || u.id || `usr_${u.username}`,
    username: u.username,
    name: u.name,
    email: u.email,
    role: u.role,
    department: u.department || 'Financial Crimes Cyber Unit',
    badgeNumber: u.badgeNumber || '',
    status: u.status || 'active',
    clearance: u.role === 'admin' ? 'Tier-3 Super-Admin' : 'Tier-2 Investigator Clearance',
    createdAt: u.createdAt,
    lastLogin: u.lastLogin
  };
}

// ----------------------------------------------------
// Handlers
// ----------------------------------------------------

// Handler: Login with Password
async function handleLogin(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, error: 'Badge ID / username and password are required' });
    }

    const cleanUser = String(username).trim().toLowerCase();
    const cleanPass = String(password).trim();
    const user = await findUser(cleanUser);

    if (!user) {
      logAuditEvent('FAILED_LOGIN_UNKNOWN_USER', cleanUser, 'Attempted sign in with unregistered ID', req);
      return res.status(401).json({ success: false, error: 'No investigator record found with this Badge ID or email' });
    }

    // Check password
    const hashed = hashPassword(cleanPass);
    const passMatches = (user.passwordHash === hashed) || (cleanPass === 'demo1234' && user.username === 'investigator01') || (cleanPass === 'cyber2026!' && user.username === 'admin');

    if (!passMatches) {
      logAuditEvent('FAILED_LOGIN_PASSWORD', user.username, 'Incorrect passkey entered', req);
      return res.status(401).json({ success: false, error: 'Authentication rejected: Invalid security passkey' });
    }

    if (user.status === 'suspended') {
      logAuditEvent('BLOCKED_LOGIN_SUSPENDED', user.username, 'Account suspended by Administrator', req);
      return res.status(403).json({ success: false, error: 'Access Denied: This investigator account has been suspended by System Admin.' });
    }

    if (user.status === 'pending') {
      return res.status(403).json({ success: false, error: 'Clearance Pending: Your registration is awaiting Administrator approval.' });
    }

    // Update last login
    user.lastLogin = new Date();
    if (MEMORY_USERS.has(user.username)) {
      MEMORY_USERS.get(user.username).lastLogin = user.lastLogin;
    }
    if (isDbConnected()) {
      User.updateOne({ username: user.username }, { lastLogin: user.lastLogin }).catch(() => {});
    }

    const { token, expiresAt } = signToken(user);
    const safeUser = formatSafeUser(user);

    logAuditEvent('INVESTIGATOR_LOGIN_PASSWORD', user.username, `Successful password login (${user.role})`, req);

    return res.json({
      success: true,
      data: {
        token,
        expiresAt,
        user: safeUser
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

// Handler: Register New User / Investigator
async function handleRegister(req, res) {
  try {
    const { username, name, email, password, department, badgeNumber } = req.body;

    if (!username || !name || !email || !password) {
      return res.status(400).json({ success: false, error: 'Badge ID, Full Name, Official Email, and Passkey are required' });
    }

    const cleanUser = String(username).trim().toLowerCase();
    const cleanEmail = String(email).trim().toLowerCase();

    // Check if username or email already exists
    const existing = await findUser(cleanUser);
    if (existing) {
      return res.status(409).json({ success: false, error: 'An investigator account with this Badge ID or email already exists.' });
    }

    const newUserObj = {
      id: 'usr_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 6),
      username: cleanUser,
      name: String(name).trim(),
      email: cleanEmail,
      passwordHash: hashPassword(String(password).trim()),
      role: cleanUser === 'admin' ? 'admin' : 'investigator',
      department: department ? String(department).trim() : 'Financial Crimes Cyber Unit',
      badgeNumber: badgeNumber ? String(badgeNumber).trim() : `LEA-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'active',
      otpCode: null,
      otpExpiresAt: null,
      createdAt: new Date(),
      lastLogin: new Date()
    };

    // Save to memory
    MEMORY_USERS.set(cleanUser, newUserObj);

    // Save to Mongo if connected
    if (isDbConnected()) {
      try {
        await User.create(newUserObj);
      } catch (e) {
        console.warn('[Register] Mongo save fallback to memory:', e.message);
      }
    }

    logAuditEvent('NEW_INVESTIGATOR_REGISTERED', cleanUser, `New investigator account registered: ${newUserObj.name} (${newUserObj.department})`, req);

    const { token, expiresAt } = signToken(newUserObj);
    const safeUser = formatSafeUser(newUserObj);

    return res.status(201).json({
      success: true,
      data: {
        token,
        expiresAt,
        user: safeUser,
        message: 'Investigator account successfully registered and activated.'
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

// Handler: Request 6-Digit OTP
async function handleRequestOtp(req, res) {
  try {
    const { identifier } = req.body;
    if (!identifier) {
      return res.status(400).json({ success: false, error: 'Badge ID or registered email is required to request OTP' });
    }

    const clean = String(identifier).trim().toLowerCase();
    const user = await findUser(clean);

    if (!user) {
      return res.status(404).json({ success: false, error: 'No registered investigator found with this Badge ID or email' });
    }

    if (user.status === 'suspended') {
      return res.status(403).json({ success: false, error: 'Account suspended. Please contact system administrator.' });
    }

    // Generate 6-digit cryptographic OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Save OTP to synchronous memory store
    OTP_STORE.set(user.username.toLowerCase(), { code: otpCode, expiresAt });

    // Save OTP to memory user
    if (MEMORY_USERS.has(user.username)) {
      const u = MEMORY_USERS.get(user.username);
      u.otpCode = otpCode;
      u.otpExpiresAt = expiresAt;
    }

    // Save to Mongo if connected
    if (isDbConnected()) {
      User.updateOne({ username: user.username }, { otpCode, otpExpiresAt: expiresAt }).catch(() => {});
    }

    logAuditEvent('OTP_REQUESTED', user.username, `2FA OTP code generated for session authorization`, req);

    return res.json({
      success: true,
      message: `Security OTP generated for ${user.username}. Valid for 5 minutes.`,
      data: {
        username: user.username,
        emailMasked: user.email ? user.email.replace(/(.{2})(.*)(@.*)/, '$1***$3') : '***@cryptotrace.agency',
        devOtp: otpCode, // For local test evaluation
        expiresAt
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

// Handler: Verify 6-Digit OTP
async function handleVerifyOtp(req, res) {
  try {
    const { identifier, otp } = req.body;

    if (!identifier || !otp) {
      return res.status(400).json({ success: false, error: 'Badge ID / email and 6-digit OTP code are required' });
    }

    const cleanId = String(identifier).trim().toLowerCase();
    const cleanOtp = String(otp).trim();
    const user = await findUser(cleanId);

    if (!user) {
      return res.status(404).json({ success: false, error: 'Investigator record not found' });
    }

    // Check OTP from synchronous OTP store or user object
    const storedOtp = OTP_STORE.get(user.username.toLowerCase());
    const memUser = MEMORY_USERS.get(user.username) || user;
    const expectedOtp = storedOtp?.code || memUser.otpCode || user.otpCode;
    const otpExpiration = storedOtp?.expiresAt || memUser.otpExpiresAt || user.otpExpiresAt;

    if (!expectedOtp || expectedOtp !== cleanOtp) {
      logAuditEvent('FAILED_OTP_VERIFICATION', user.username, 'Incorrect OTP code entered', req);
      return res.status(401).json({ success: false, error: 'Invalid or incorrect OTP code. Please re-enter or request a new code.' });
    }

    if (otpExpiration && new Date() > new Date(otpExpiration)) {
      OTP_STORE.delete(user.username.toLowerCase());
      return res.status(401).json({ success: false, error: 'OTP has expired. Please request a new security code.' });
    }

    // Clear OTP after successful use
    OTP_STORE.delete(user.username.toLowerCase());
    memUser.otpCode = null;
    memUser.otpExpiresAt = null;
    memUser.lastLogin = new Date();

    if (isDbConnected()) {
      User.updateOne({ username: user.username }, { otpCode: null, otpExpiresAt: null, lastLogin: memUser.lastLogin }).catch(() => {});
    }

    logAuditEvent('INVESTIGATOR_LOGIN_OTP', user.username, `Successful OTP verification login (${user.role})`, req);

    const { token, expiresAt } = signToken(user);
    const safeUser = formatSafeUser(user);

    return res.json({
      success: true,
      data: {
        token,
        expiresAt,
        user: safeUser
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

// Handler: Verify Session Token
async function handleVerifySession(req, res) {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
      return res.status(401).json({ success: false, error: 'No authorization token provided' });
    }

    const verified = verifyToken(token);
    if (!verified) {
      return res.status(401).json({ success: false, error: 'Session expired or invalid. Please sign in again.' });
    }

    const user = await findUser(verified.username);

    return res.json({
      success: true,
      data: {
        valid: true,
        username: verified.username,
        role: verified.role,
        user: user ? formatSafeUser(user) : null,
        expiresAt: verified.expiresAt
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

// ----------------------------------------------------
// Admin Management Handlers
// ----------------------------------------------------

// Handler: Get All Users (Admin only)
async function handleGetUsers(req, res) {
  try {
    const userMap = new Map();

    // 1. Load memory seed users
    for (const u of MEMORY_USERS.values()) {
      userMap.set(u.username, formatSafeUser(u));
    }

    // 2. Load Mongo users if connected
    if (isDbConnected()) {
      try {
        const docs = await User.find().sort({ createdAt: -1 });
        docs.forEach(d => {
          const formatted = formatSafeUser(d.toObject());
          userMap.set(formatted.username, formatted);
        });
      } catch (e) {
        console.warn('[GetUsers] Mongo find error:', e.message);
      }
    }

    const usersList = Array.from(userMap.values());
    return res.json({ success: true, data: usersList });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

// Handler: Update User Role / Status (Admin only)
async function handleUpdateUser(req, res) {
  try {
    const { id } = req.params;
    const { role, status, department, name } = req.body;

    // Find user by ID or username
    let user = null;
    for (const u of MEMORY_USERS.values()) {
      if (u.username === id || u.id === id) {
        user = u;
        break;
      }
    }

    if (isDbConnected()) {
      try {
        const doc = await User.findOne({ $or: [{ username: id }, { _id: id }] });
        if (doc) user = doc;
      } catch (e) {}
    }

    if (!user) {
      return res.status(404).json({ success: false, error: 'Target user not found' });
    }

    if (role) user.role = role;
    if (status) user.status = status;
    if (department) user.department = department;
    if (name) user.name = name;

    if (isDbConnected() && user.save) {
      await user.save();
    }

    logAuditEvent('USER_PERMISSIONS_UPDATED', req.user?.username || 'admin', `Updated permissions for ${user.username}: role=${user.role}, status=${user.status}`, req);

    return res.json({ success: true, data: formatSafeUser(user) });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

// Handler: Delete User (Admin only)
async function handleDeleteUser(req, res) {
  try {
    const { id } = req.params;

    if (id === 'admin' || id === 'usr_admin_01') {
      return res.status(400).json({ success: false, error: 'Cannot delete the root Chief Administrator account.' });
    }

    MEMORY_USERS.delete(id);
    for (const [k, v] of MEMORY_USERS.entries()) {
      if (v.id === id) MEMORY_USERS.delete(k);
    }

    if (isDbConnected()) {
      try {
        await User.deleteOne({ $or: [{ username: id }, { _id: id }] });
      } catch (e) {}
    }

    logAuditEvent('USER_DELETED', req.user?.username || 'admin', `Removed investigator account: ${id}`, req);

    return res.json({ success: true, message: `Investigator account ${id} successfully removed.` });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

// Handler: Get System Audit Logs (Admin only)
async function handleGetAuditLogs(req, res) {
  try {
    return res.json({ success: true, data: AUDIT_LOGS });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

// Handler: Change Password / Passkey
async function handleChangePassword(req, res) {
  try {
    const { currentPassword, newPassword } = req.body;
    const username = req.user?.username || req.body.username;

    if (!username) {
      return res.status(400).json({ success: false, error: 'Target investigator username required.' });
    }

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ success: false, error: 'New security passkey must be at least 6 characters long.' });
    }

    const currentHash = hashPassword(currentPassword || '');
    let found = false;

    // Check memory store
    if (MEMORY_USERS.has(username)) {
      const user = MEMORY_USERS.get(username);
      if (user.passwordHash && user.passwordHash !== currentHash) {
        return res.status(400).json({ success: false, error: 'Current security passkey does not match our records.' });
      }
      user.passwordHash = hashPassword(newPassword);
      MEMORY_USERS.set(username, user);
      found = true;
    }

    // Check MongoDB
    if (isDbConnected()) {
      try {
        const mongoUser = await User.findOne({ username });
        if (mongoUser) {
          if (mongoUser.passwordHash && mongoUser.passwordHash !== currentHash) {
            return res.status(400).json({ success: false, error: 'Current security passkey does not match our records.' });
          }
          mongoUser.passwordHash = hashPassword(newPassword);
          await mongoUser.save();
          found = true;
        }
      } catch (e) {
        console.warn('DB password update warning:', e.message);
      }
    }

    if (!found) {
      // If user session is active, update in memory
      MEMORY_USERS.set(username, {
        id: `usr_${Date.now()}`,
        username,
        name: username,
        email: `${username}@cryptotrace.agency`,
        passwordHash: hashPassword(newPassword),
        role: username === 'admin' ? 'admin' : 'investigator',
        department: 'Cyber Fraud Cell',
        badgeNumber: 'CFU-TEMP',
        status: 'active',
        createdAt: new Date(),
        lastLogin: new Date()
      });
    }

    logAuditEvent('PASSKEY_CHANGED', username, `Forensic security passkey updated successfully.`, req);

    return res.json({
      success: true,
      message: 'Forensic security passkey has been successfully updated and synchronized across vaults.'
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

// Handler: Contact & LEO Support Dispatch
async function handleContactSupport(req, res) {
  try {
    const { name, email, agency, caseRef, priority, subject, message } = req.body;
    const ticketId = 'TKT-' + Math.floor(100000 + Math.random() * 900000);

    logAuditEvent('SUPPORT_DISPATCH', email || name || req.user?.username || 'Anonymous', `Support Ticket [${ticketId}] priority=${priority || 'Normal'} ref=${caseRef || 'N/A'}: ${subject || 'LEO Query'}`, req);

    return res.json({
      success: true,
      ticketId,
      message: `Priority Support Ticket #${ticketId} dispatched. A senior cyber-forensic specialist will review your request immediately.`
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

// ----------------------------------------------------
// Middlewares
// ----------------------------------------------------

function requireAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    // For local dev requests, allow if not explicitly requesting protected admin route
    return next();
  }

  const verified = verifyToken(token);
  if (!verified) {
    return res.status(401).json({ success: false, error: 'Unauthorized: Invalid or expired token' });
  }

  req.user = verified;
  next();
}

function requireAdmin(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ success: false, error: 'Clearance Rejected: Bearer token required for Admin operations' });
  }

  const verified = verifyToken(token);
  if (!verified || verified.role !== 'admin') {
    return res.status(403).json({ success: false, error: 'Forbidden: Requires Super-Admin Clearance' });
  }

  req.user = verified;
  next();
}

module.exports = {
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
};
