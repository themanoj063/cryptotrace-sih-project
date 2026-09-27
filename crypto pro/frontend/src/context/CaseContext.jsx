import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const CaseContext = createContext();

export const useCase = () => useContext(CaseContext);

const TICKER_TEMPLATES = [
  { t: 'New transaction detected on Ethereum suspect cluster', c: 'var(--info)' },
  { t: 'Wallet risk score updated: 0x9c4...2af1 → High', c: 'var(--high)' },
  { t: 'Exchange interaction detected — deposit to known cluster', c: 'var(--accent)' },
  { t: 'Cross-chain transfer detected: BNB Chain → Tron', c: 'var(--warn)' },
  { t: 'New transaction detected on Tron layering wallet', c: 'var(--info)' },
  { t: 'Wallet risk score updated: TXn82...A2fE → Critical', c: 'var(--crit)' },
  { t: 'Mixer interaction flagged on Polygon fund path', c: 'var(--warn)' }
];

const VALID_PAGES = [
  'dashboard', 'wallet', 'workspace', 'transactions', 'txdetail',
  'graph', 'crosschain', 'vasp', 'risk', 'counterparties',
  'alerts', 'livemonitor', 'reports', 'settings', 'admin', 'login', 'landing'
];

function getStoredSession() {
  try {
    const raw = localStorage.getItem('cryptotrace_session');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.token && parsed.expiresAt > Date.now()) {
        return parsed;
      } else {
        localStorage.removeItem('cryptotrace_session');
      }
    }
  } catch (e) {
    console.warn('Session parse error:', e);
  }
  return null;
}

function getStoredPage() {
  // 1. URL Hash has highest priority
  const hash = window.location.hash.replace(/^#\/?/, '').trim();
  if (hash && VALID_PAGES.includes(hash)) {
    return hash;
  }
  // 2. localStorage
  const saved = localStorage.getItem('cryptotrace_active_page');
  if (saved && VALID_PAGES.includes(saved)) {
    return saved;
  }
  return 'landing';
}

export const CaseProvider = ({ children }) => {
  const initialSession = getStoredSession();
  const initialPage = getStoredPage();

  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState(!!initialSession);
  const [authToken, setAuthToken] = useState(initialSession?.token || null);
  const [investigatorUser, setInvestigatorUser] = useState(initialSession?.username || 'investigator01');
  const [investigatorDetails, setInvestigatorDetails] = useState(initialSession?.user || null);
  const [userRole, setUserRole] = useState(initialSession?.user?.role || (initialSession?.username === 'admin' ? 'admin' : 'investigator'));

  // Admin Management State
  const [adminUsers, setAdminUsers] = useState([]);
  const [adminLogs, setAdminLogs] = useState([]);

  // Sidebar Open / Close (Collapse) State
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    return localStorage.getItem('cryptotrace_sidebar_collapsed') === 'true';
  });

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('cryptotrace_sidebar_collapsed', String(next));
      return next;
    });
  }, []);

  // Profile Modal State
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  // Display Theme (Dark / Light)
  const [theme, setThemeState] = useState(() => {
    return localStorage.getItem('cryptotrace_theme') || 'dark';
  });

  const setTheme = useCallback((t) => {
    setThemeState(t);
    localStorage.setItem('cryptotrace_theme', t);
    document.documentElement.setAttribute('data-theme', t);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Active Page State (Preserves current page on browser refresh)
  const [activePage, setActivePageRaw] = useState(() => {
    if (initialSession) {
      return initialPage === 'login' ? 'dashboard' : initialPage;
    }
    // If not authenticated and requested a protected internal page, route to login or landing
    if (initialPage === 'landing' || initialPage === 'login') return initialPage;
    return 'landing';
  });

  const [activeCase, setActiveCase] = useState(null);
  const [cases, setCases] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedTx, setSelectedTx] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);

  const [liveEvents, setLiveEvents] = useState([
    { t: 'System initialized — monitoring 5 supported chains', c: 'var(--accent)', time: new Date().toLocaleTimeString() }
  ]);
  const [toasts, setToasts] = useState([]);

  // AI Copilot Drawer
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [copilotMessages, setCopilotMessages] = useState([
    {
      sender: 'ai',
      text: 'Greetings, Investigator. I am the CryptoTrace Forensic AI Copilot. Ask me to explain risk scoring, break down layering hops, or draft an urgent VASP freezing notice for any target wallet.',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);

  // Navigate & persist active page
  const setActivePage = useCallback((page) => {
    const target = VALID_PAGES.includes(page) ? page : 'dashboard';
    setActivePageRaw(target);
    localStorage.setItem('cryptotrace_active_page', target);
    if (window.location.hash !== `#/${target}`) {
      window.location.hash = `#/${target}`;
    }
  }, []);

  // Toast helper
  const addToast = (msg) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, msg }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3400);
  };

  // Authenticated fetch wrapper (attaches Bearer token)
  const authFetch = useCallback(async (url, options = {}) => {
    const headers = { ...options.headers };
    const currentToken = authToken || getStoredSession()?.token;
    if (currentToken) {
      headers['Authorization'] = `Bearer ${currentToken}`;
    }
    const res = await fetch(url, { ...options, headers });
    if (res.status === 401) {
      // Session expired
      logout();
      addToast('Session expired. Please sign in again.');
    }
    return res;
  }, [authToken]);

  // Secure Login
  const login = async (username, password) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (data.success && data.data) {
        const { token, expiresAt, user } = data.data;
        const sessionObj = { token, username: user.username, user, expiresAt };
        localStorage.setItem('cryptotrace_session', JSON.stringify(sessionObj));
        setAuthToken(token);
        setIsLoggedIn(true);
        setInvestigatorUser(user.username);
        setInvestigatorDetails(user);
        setUserRole(user.role || (user.username === 'admin' ? 'admin' : 'investigator'));

        // Resume previous page if not landing/login, else default to dashboard
        const savedPage = localStorage.getItem('cryptotrace_active_page');
        const next = (savedPage && savedPage !== 'landing' && savedPage !== 'login') ? savedPage : (user.role === 'admin' ? 'dashboard' : 'dashboard');
        setActivePage(next);
        addToast(`Authenticated as ${user.username} (${user.role || 'Investigator'}). Session active.`);
        refreshStats();
        refreshCases();
        refreshAlerts();
        return { success: true };
      } else {
        throw new Error(data.error || 'Invalid credentials');
      }
    } catch (err) {
      addToast(`Authentication error: ${err.message}`);
      return { success: false, error: err.message };
    }
  };

  // Register New Investigator Account
  const register = async (formData) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success && data.data) {
        const { token, expiresAt, user } = data.data;
        const sessionObj = { token, username: user.username, user, expiresAt };
        localStorage.setItem('cryptotrace_session', JSON.stringify(sessionObj));
        setAuthToken(token);
        setIsLoggedIn(true);
        setInvestigatorUser(user.username);
        setInvestigatorDetails(user);
        setUserRole(user.role || 'investigator');

        setActivePage('dashboard');
        addToast(`Account created: ${user.name} (${user.username}). Welcome to CryptoTrace!`);
        refreshStats();
        refreshCases();
        refreshAlerts();
        return { success: true, data };
      } else {
        throw new Error(data.error || 'Registration failed');
      }
    } catch (err) {
      addToast(`Registration error: ${err.message}`);
      return { success: false, error: err.message };
    }
  };

  // Request 6-Digit OTP
  const requestOtp = async (identifier) => {
    try {
      const res = await fetch('/api/auth/otp/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier })
      });
      const data = await res.json();
      if (data.success) {
        addToast(`Security OTP dispatched for ${identifier}`);
        return { success: true, data: data.data };
      } else {
        throw new Error(data.error || 'Unable to generate security OTP');
      }
    } catch (err) {
      addToast(`OTP error: ${err.message}`);
      return { success: false, error: err.message };
    }
  };

  // Verify 6-Digit OTP
  const verifyOtp = async (identifier, otp) => {
    try {
      const res = await fetch('/api/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, otp })
      });
      const data = await res.json();
      if (data.success && data.data) {
        const { token, expiresAt, user } = data.data;
        const sessionObj = { token, username: user.username, user, expiresAt };
        localStorage.setItem('cryptotrace_session', JSON.stringify(sessionObj));
        setAuthToken(token);
        setIsLoggedIn(true);
        setInvestigatorUser(user.username);
        setInvestigatorDetails(user);
        setUserRole(user.role || (user.username === 'admin' ? 'admin' : 'investigator'));

        setActivePage('dashboard');
        addToast(`2FA OTP Verified: Authenticated as ${user.username}.`);
        refreshStats();
        refreshCases();
        refreshAlerts();
        return { success: true };
      } else {
        throw new Error(data.error || 'OTP verification failed');
      }
    } catch (err) {
      addToast(`Verification error: ${err.message}`);
      return { success: false, error: err.message };
    }
  };

  // Secure Logout
  const logout = () => {
    localStorage.removeItem('cryptotrace_session');
    localStorage.removeItem('cryptotrace_active_page');
    setAuthToken(null);
    setIsLoggedIn(false);
    setInvestigatorUser('investigator01');
    setInvestigatorDetails(null);
    setUserRole('investigator');
    setActivePage('landing');
    addToast('Investigator session terminated securely.');
  };

  // Admin: Fetch All Users
  const fetchAdminUsers = async () => {
    try {
      const res = await authFetch('/api/admin/users');
      const data = await res.json();
      if (data.success && data.data) {
        setAdminUsers(data.data);
        return data.data;
      }
    } catch (e) {
      console.warn('Error fetching admin users:', e);
    }
    return [];
  };

  // Admin: Update User (Role/Status)
  const updateAdminUser = async (id, updates) => {
    try {
      const res = await authFetch(`/api/admin/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      const data = await res.json();
      if (data.success) {
        addToast(`User ${id} updated successfully.`);
        fetchAdminUsers();
        return { success: true, data: data.data };
      } else {
        throw new Error(data.error || 'Failed to update user');
      }
    } catch (err) {
      addToast(`Error updating user: ${err.message}`);
      return { success: false, error: err.message };
    }
  };

  // Admin: Delete User
  const deleteAdminUser = async (id) => {
    try {
      const res = await authFetch(`/api/admin/users/${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        addToast(`User ${id} removed.`);
        fetchAdminUsers();
        return { success: true };
      } else {
        throw new Error(data.error || 'Failed to delete user');
      }
    } catch (err) {
      addToast(`Error deleting user: ${err.message}`);
      return { success: false, error: err.message };
    }
  };

  // Admin: Fetch Audit Logs
  const fetchAdminLogs = async () => {
    try {
      const res = await authFetch('/api/admin/logs');
      const data = await res.json();
      if (data.success && data.data) {
        setAdminLogs(data.data);
        return data.data;
      }
    } catch (e) {
      console.warn('Error fetching audit logs:', e);
    }
    return [];
  };

  // Fetch initial data
  const refreshStats = async () => {
    try {
      const res = await authFetch('/api/stats');
      const data = await res.json();
      if (data.success) setStats(data.data);
    } catch (e) {
      console.warn('Failed to fetch stats:', e);
    }
  };

  const refreshCases = async () => {
    try {
      const res = await authFetch('/api/cases');
      const data = await res.json();
      if (data.success && data.data) {
        setCases(data.data);
        if (!activeCase && data.data.length > 0) {
          setActiveCase(data.data[0]);
        }
      }
    } catch (e) {
      console.warn('Failed to fetch cases:', e);
    }
  };

  const refreshAlerts = async () => {
    try {
      const res = await authFetch('/api/alerts');
      const data = await res.json();
      if (data.success) setAlerts(data.data);
    } catch (e) {
      console.warn('Failed to fetch alerts:', e);
    }
  };

  const createAlert = async (alertData) => {
    try {
      const res = await authFetch('/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alertData)
      });
      const data = await res.json();
      if (data.success && data.data) {
        setAlerts((prev) => [data.data, ...prev]);
        addToast(`Alert created: [${data.data.sev}] ${data.data.msg.substring(0, 32)}...`);
        refreshStats();
        return data.data;
      } else {
        throw new Error(data.error || 'Failed to create alert');
      }
    } catch (err) {
      addToast(`Error creating alert: ${err.message}`);
      return null;
    }
  };

  // Sync hash routing and window events
  useEffect(() => {
    // Keep window.location.hash in sync
    if (!window.location.hash) {
      window.location.hash = `#/${activePage}`;
    }

    const onHashChange = () => {
      const h = window.location.hash.replace(/^#\/?/, '').trim();
      if (h && VALID_PAGES.includes(h) && h !== activePage) {
        setActivePageRaw(h);
        localStorage.setItem('cryptotrace_active_page', h);
      }
    };

    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, [activePage]);

  // Initial load
  useEffect(() => {
    refreshStats();
    refreshCases();
    refreshAlerts();

    // Simulated real-time live event ticker
    const interval = setInterval(() => {
      const ev = TICKER_TEMPLATES[Math.floor(Math.random() * TICKER_TEMPLATES.length)];
      const time = new Date().toLocaleTimeString();
      setLiveEvents((prev) => [{ t: ev.t, c: ev.c, time }, ...prev.slice(0, 49)]);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  // Analyze Wallet via Node backend + Python AI
  const analyzeWallet = async (address, chain = 'Ethereum', fraudType = 'Investment Scam', victimAddress = '') => {
    if (!address) {
      addToast('Suspect wallet address is required');
      return null;
    }

    setIsAnalyzing(true);
    setAnalysisStep(0);

    const steps = [
      'Ingesting blockchain data for suspect and victim addresses',
      'Reconstructing victim-to-suspect transaction graph',
      'Detecting intermediary wallets',
      'Scoring risk factors with heuristic threat matrix',
      'Attributing suspected VASP'
    ];

    for (let i = 0; i < steps.length; i++) {
      setAnalysisStep(i);
      await new Promise((r) => setTimeout(r, 220));
    }

    try {
      const res = await authFetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address, chain, fraudType, victimAddress })
      });
      const json = await res.json();
      if (json.success && json.data) {
        setActiveCase(json.data);
        setCases((prev) => [json.data, ...prev.filter((c) => c.caseId !== json.data.caseId)]);
        addToast(`Analysis complete — Case ${json.data.caseId} created`);
        refreshStats();
        refreshAlerts();
        setIsAnalyzing(false);
        return json.data;
      } else {
        throw new Error(json.error || 'Analysis failed');
      }
    } catch (err) {
      addToast(`Error: ${err.message}`);
      setIsAnalyzing(false);
      return null;
    }
  };

  // Demo Investigation
  const runDemo = async () => {
    if (!isLoggedIn) {
      await login('investigator01', 'demo1234');
    }
    setActivePage('wallet');
    const demoSuspect = '0x7a41f3c9b2e6d0a184f7c3b9e8a2d15f6c7e91f';
    const demoVictim = '0x4b10293847561029384756102938475610293847';
    return await analyzeWallet(demoSuspect, 'Ethereum', 'Investment Scam', demoVictim);
  };

  // Send message to AI Copilot
  const sendCopilotMessage = async (text) => {
    if (!text || !text.trim()) return;
    const userMsg = {
      sender: 'user',
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setCopilotMessages((prev) => [...prev, userMsg]);

    try {
      const res = await authFetch('/api/ai/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text.trim(),
          caseContext: activeCase || {}
        })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setCopilotMessages((prev) => [
          ...prev,
          {
            sender: 'ai',
            text: data.data.reply,
            category: data.data.category,
            suggestedFollowUps: data.data.suggestedFollowUps,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }
    } catch (err) {
      setCopilotMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: 'Apologies, I encountered an issue connecting to the AI analysis engine. Please try again.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  };

  // Change Security Passkey
  const changePassword = async (currentPassword, newPassword) => {
    try {
      const res = await authFetch('/api/auth/profile/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: investigatorUser,
          currentPassword,
          newPassword
        })
      });
      const data = await res.json();
      if (data.success) {
        addToast(data.message || 'Security passkey updated successfully.');
        return { success: true };
      } else {
        throw new Error(data.error || 'Failed to update passkey');
      }
    } catch (err) {
      addToast(`Passkey error: ${err.message}`);
      return { success: false, error: err.message };
    }
  };

  // Submit LEO Support & Contact Ticket
  const submitSupportTicket = async (ticketData) => {
    try {
      const res = await fetch('/api/support/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ticketData)
      });
      const data = await res.json();
      if (data.success) {
        addToast(data.message);
        return { success: true, ticketId: data.ticketId };
      } else {
        throw new Error(data.error || 'Failed to dispatch ticket');
      }
    } catch (err) {
      addToast(`Support error: ${err.message}`);
      return { success: false, error: err.message };
    }
  };

  return (
    <CaseContext.Provider
      value={{
        activePage,
        setActivePage,
        isLoggedIn,
        setIsLoggedIn,
        authToken,
        investigatorUser,
        investigatorDetails,
        userRole,
        login,
        register,
        requestOtp,
        verifyOtp,
        logout,
        adminUsers,
        adminLogs,
        fetchAdminUsers,
        updateAdminUser,
        deleteAdminUser,
        fetchAdminLogs,
        sidebarCollapsed,
        setSidebarCollapsed,
        toggleSidebar,
        profileModalOpen,
        setProfileModalOpen,
        theme,
        setTheme,
        changePassword,
        submitSupportTicket,
        activeCase,
        setActiveCase,
        cases,
        alerts,
        createAlert,
        stats,
        selectedTx,
        setSelectedTx,
        selectedNode,
        setSelectedNode,
        liveEvents,
        toasts,
        addToast,
        analyzeWallet,
        runDemo,
        isAnalyzing,
        analysisStep,
        copilotOpen,
        setCopilotOpen,
        copilotMessages,
        sendCopilotMessage
      }}
    >
      {children}
    </CaseContext.Provider>
  );
};
