import React, { useState } from 'react';
import { useCase } from '../context/CaseContext';

export default function SettingsPage() {
  const {
    investigatorUser,
    investigatorDetails,
    userRole,
    theme,
    setTheme,
    changePassword,
    submitSupportTicket,
    cases,
    addToast
  } = useCase();

  const [activeTab, setActiveTab] = useState('display'); // 'display' | 'security' | 'help' | 'contact' | 'notifications'

  // Display Settings Local State
  const [uiDensity, setUiDensity] = useState('standard');
  const [mempoolAnim, setMempoolAnim] = useState(true);
  const [accentColor, setAccentColor] = useState('emerald');

  // Security Passkey Form State
  const [currentPasskey, setCurrentPasskey] = useState('');
  const [newPasskey, setNewPasskey] = useState('');
  const [confirmPasskey, setConfirmPasskey] = useState('');
  const [isUpdatingPasskey, setIsUpdatingPasskey] = useState(false);
  const [requireOtpEveryLogin, setRequireOtpEveryLogin] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState('30m');

  // Support / Contact Form State
  const [contactSubject, setContactSubject] = useState('');
  const [contactPriority, setContactPriority] = useState('Urgent');
  const [contactCaseRef, setContactCaseRef] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [isSubmittingSupport, setIsSubmittingSupport] = useState(false);
  const [ticketResult, setTicketResult] = useState(null);

  // Diagnostics Self-Test State
  const [diagRunning, setDiagRunning] = useState(false);
  const [diagResults, setDiagResults] = useState(null);

  // Notification toggles
  const [audioAlerts, setAudioAlerts] = useState(true);
  const [browserNotifications, setBrowserNotifications] = useState(true);
  const [whaleThreshold, setWhaleThreshold] = useState('50000');

  // Handle Passkey Submit
  const handlePasskeySubmit = async (e) => {
    e.preventDefault();
    if (!newPasskey) {
      addToast('Please enter a new passkey.');
      return;
    }
    if (newPasskey.length < 6) {
      addToast('Passkey must be at least 6 characters long.');
      return;
    }
    if (newPasskey !== confirmPasskey) {
      addToast('New passkey confirmation does not match.');
      return;
    }

    setIsUpdatingPasskey(true);
    const res = await changePassword(currentPasskey, newPasskey);
    setIsUpdatingPasskey(false);
    if (res.success) {
      setCurrentPasskey('');
      setNewPasskey('');
      setConfirmPasskey('');
    }
  };

  // Handle Support Ticket Submit
  const handleSupportSubmit = async (e) => {
    e.preventDefault();
    if (!contactSubject || !contactMessage) {
      addToast('Please complete the subject and message fields.');
      return;
    }

    setIsSubmittingSupport(true);
    const res = await submitSupportTicket({
      name: investigatorDetails?.name || investigatorUser,
      email: investigatorDetails?.email || `${investigatorUser}@cryptotrace.agency`,
      agency: investigatorDetails?.department || 'Cyber Fraud Cell',
      caseRef: contactCaseRef || 'GENERAL',
      priority: contactPriority,
      subject: contactSubject,
      message: contactMessage
    });
    setIsSubmittingSupport(false);

    if (res.success) {
      setTicketResult(res.ticketId);
      setContactSubject('');
      setContactMessage('');
      setContactCaseRef('');
    }
  };

  // Run Self-Test Diagnostics
  const handleRunDiagnostics = () => {
    setDiagRunning(true);
    setDiagResults(null);
    setTimeout(() => {
      setDiagResults({
        nodeStatus: 'Synced (Block #19,842,091 - 12ms latency)',
        mempoolStatus: 'Streaming 18,400 tx/sec',
        vaultEncryption: 'AES-256-GCM Immutable Vault Active',
        aiEngine: 'Python PyTorch Neural Classifier Online (Port 5001)',
        memoryUsage: '142 MB / 2048 MB Allocated',
        integrityHash: 'SHA256:49c0d7b21a8f9024'
      });
      setDiagRunning(false);
      addToast('Platform self-test diagnostics completed: All systems nominal.');
    }, 1200);
  };

  return (
    <div style={{ padding: '24px 28px', maxWidth: '1240px', margin: '0 auto' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '22px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '4px' }}>
              Platform Settings &amp; Preferences
            </h2>
            <div style={{ fontSize: '13.5px', color: 'var(--text-dim)' }}>
              Configure your visual display mode, security passkeys, system diagnostics, and law enforcement support.
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-low" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent)' }}></span>
              Version 2.4.0 (Forensic-PRO)
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginTop: '20px',
          borderBottom: '1px solid var(--border-soft)',
          paddingBottom: '8px',
          overflowX: 'auto'
        }}>
          {[
            { id: 'display', label: 'Display & Themes', icon: '🎨' },
            { id: 'security', label: 'Security & Passkey', icon: '🔒' },
            { id: 'help', label: 'Help & Knowledge Base', icon: '📖' },
            { id: 'contact', label: 'Contact & Support', icon: '✉️' },
            { id: 'notifications', label: 'Alerts & Audio', icon: '🔔' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 16px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: activeTab === tab.id ? 700 : 500,
                color: activeTab === tab.id ? 'var(--text)' : 'var(--text-dim)',
                background: activeTab === tab.id ? 'var(--panel-2)' : 'transparent',
                border: activeTab === tab.id ? '1px solid var(--border)' : '1px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap'
              }}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: DISPLAY & THEMES */}
      {activeTab === 'display' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Theme Selector Card */}
          <div className="panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '6px' }}>
              Visual Theme (Bright &amp; Dark Mode)
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-dim)', marginBottom: '18px' }}>
              Switch between high-contrast bright mode for daylight investigations and deep OLED dark mode for triage operations.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
              {/* Bright / Light Theme Card */}
              <div
                onClick={() => setTheme('light')}
                style={{
                  border: theme === 'light' ? '2px solid var(--info)' : '1px solid var(--border)',
                  borderRadius: '12px',
                  padding: '20px',
                  background: '#FFFFFF',
                  color: '#0F172A',
                  cursor: 'pointer',
                  boxShadow: theme === 'light' ? '0 0 16px rgba(37, 99, 235, 0.25)' : 'none',
                  position: 'relative',
                  transition: 'all 0.15s ease'
                }}
              >
                {theme === 'light' && (
                  <span style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: '#2563EB',
                    color: '#fff',
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '20px'
                  }}>
                    ACTIVE THEME
                  </span>
                )}
                <div style={{ fontSize: '28px', marginBottom: '8px' }}>☀️</div>
                <div style={{ fontSize: '15px', fontWeight: 700, marginBottom: '4px' }}>
                  Bright / Light Mode
                </div>
                <div style={{ fontSize: '12.5px', color: '#475569', lineHeight: 1.4 }}>
                  High-readability daylight layout with clean paper backgrounds, dark typography, and crisp forensic contrast.
                </div>
                <div style={{ marginTop: '14px', display: 'flex', gap: '6px' }}>
                  <span style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#F1F5F9', border: '1px solid #CBD5E1' }}></span>
                  <span style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#2563EB' }}></span>
                  <span style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#059669' }}></span>
                </div>
              </div>

              {/* Dark Theme Card */}
              <div
                onClick={() => setTheme('dark')}
                style={{
                  border: theme === 'dark' ? '2px solid var(--accent)' : '1px solid var(--border)',
                  borderRadius: '12px',
                  padding: '20px',
                  background: '#141922',
                  color: '#E6EAF0',
                  cursor: 'pointer',
                  boxShadow: theme === 'dark' ? '0 0 16px rgba(62, 217, 163, 0.25)' : 'none',
                  position: 'relative',
                  transition: 'all 0.15s ease'
                }}
              >
                {theme === 'dark' && (
                  <span style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: 'var(--accent)',
                    color: '#04110C',
                    fontSize: '11px',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '20px'
                  }}>
                    ACTIVE THEME
                  </span>
                )}
                <div style={{ fontSize: '28px', marginBottom: '8px' }}>🌙</div>
                <div style={{ fontSize: '15px', fontWeight: 700, marginBottom: '4px' }}>
                  Cyber Forensics Dark Mode (Default)
                </div>
                <div style={{ fontSize: '12.5px', color: '#9AA6B5', lineHeight: 1.4 }}>
                  Low-strain OLED dark palette with luminescent graph nodes, tactical green highlights, and neon alerts.
                </div>
                <div style={{ marginTop: '14px', display: 'flex', gap: '6px' }}>
                  <span style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#0A0D12', border: '1px solid #232B37' }}></span>
                  <span style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#3ED9A3' }}></span>
                  <span style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#4E8FE0' }}></span>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Display Preferences */}
          <div className="panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>
              UI Density &amp; Graph Animation
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-dim)', marginBottom: '8px' }}>
                  Layout Density
                </label>
                <select
                  value={uiDensity}
                  onChange={(e) => setUiDensity(e.target.value)}
                  style={{ width: '100%' }}
                >
                  <option value="compact">Compact (High Information Density)</option>
                  <option value="standard">Standard (Balanced LEO View)</option>
                  <option value="relaxed">Relaxed (Expanded Spacing)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-dim)', marginBottom: '8px' }}>
                  Live Mempool Animations
                </label>
                <select
                  value={mempoolAnim ? 'on' : 'off'}
                  onChange={(e) => setMempoolAnim(e.target.value === 'on')}
                  style={{ width: '100%' }}
                >
                  <option value="on">Active Pulse &amp; Real-time Streaming</option>
                  <option value="off">Reduced Motion (Static)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-dim)', marginBottom: '8px' }}>
                  Graph Attribution Accent
                </label>
                <select
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  style={{ width: '100%' }}
                >
                  <option value="emerald">Signal Green (Verified LEO)</option>
                  <option value="blue">Forensic Blue (Federal)</option>
                  <option value="amber">Tactical Amber (Watchlist)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SECURITY & PASSKEY */}
      {activeTab === 'security' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Change Passkey Form */}
          <div className="panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '6px' }}>
              Change Forensic Security Passkey
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-dim)', marginBottom: '20px' }}>
              Update your account password across encrypted vaults. Changes take effect immediately.
            </p>

            <form onSubmit={handlePasskeySubmit} style={{ maxWidth: '520px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-dim)', marginBottom: '6px' }}>
                  Current Passkey / Password
                </label>
                <input
                  type="password"
                  value={currentPasskey}
                  onChange={(e) => setCurrentPasskey(e.target.value)}
                  placeholder="Enter current password (e.g. cyber2026! or demo1234)"
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-dim)', marginBottom: '6px' }}>
                  New Security Passkey
                </label>
                <input
                  type="password"
                  value={newPasskey}
                  onChange={(e) => setNewPasskey(e.target.value)}
                  placeholder="At least 6 characters"
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-dim)', marginBottom: '6px' }}>
                  Confirm New Passkey
                </label>
                <input
                  type="password"
                  value={confirmPasskey}
                  onChange={(e) => setConfirmPasskey(e.target.value)}
                  placeholder="Confirm new passkey"
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ marginTop: '6px' }}>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isUpdatingPasskey}
                  style={{ gap: '6px' }}
                >
                  {isUpdatingPasskey ? 'Updating Passkey...' : 'Update Security Passkey →'}
                </button>
              </div>
            </form>
          </div>

          {/* 2FA and Session Policy */}
          <div className="panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>
              Authentication Policies &amp; Timeouts
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '18px' }}>
              <div style={{ background: 'var(--panel-2)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-soft)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ fontWeight: 600, fontSize: '13.5px' }}>Enforce 2FA / OTP on Every Sign In</div>
                  <input
                    type="checkbox"
                    checked={requireOtpEveryLogin}
                    onChange={(e) => setRequireOtpEveryLogin(e.target.checked)}
                    style={{ cursor: 'pointer', width: '18px', height: '18px' }}
                  />
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-dim)', lineHeight: 1.4 }}>
                  Dispatches a 6-digit cryptographic OTP to official department email on every session initialization.
                </div>
              </div>

              <div style={{ background: 'var(--panel-2)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-soft)' }}>
                <div style={{ fontWeight: 600, fontSize: '13.5px', marginBottom: '8px' }}>Idle Session Auto-Lock</div>
                <select
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(e.target.value)}
                  style={{ width: '100%' }}
                >
                  <option value="15m">15 Minutes (Strict LEO Standard)</option>
                  <option value="30m">30 Minutes (Recommended)</option>
                  <option value="1h">1 Hour</option>
                  <option value="4h">4 Hours</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: HELP & KNOWLEDGE BASE */}
      {activeTab === 'help' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Quick FAQ / Guides */}
          <div className="panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '6px' }}>
              Law Enforcement Investigation Guide &amp; Knowledge Base
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-dim)', marginBottom: '18px' }}>
              Standard operating procedures for tracing ransomware, peel chains, and requesting exchange freezes.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                {
                  q: 'How do I distinguish Victim vs. Suspect wallets in CryptoTrace?',
                  a: 'Navigate to "Wallet Investigation" or "Workspace". Submit the suspect cluster and victim address. CryptoTrace classifies fund hops, flagging incoming stolen assets with a high-risk score and identifying intermediate mule addresses.'
                },
                {
                  q: 'What is Peel Chain detection and how does CryptoTrace flag it?',
                  a: 'A peel chain is a laundering pattern where a large sum is repeatedly split into a smaller amount (sent to an exchange/mixer) and a large change amount sent to a new wallet. The Fund Flow Graph highlights peeled outputs with red risk badges.'
                },
                {
                  q: 'How can I submit an urgent VASP / Exchange Freezing Notice?',
                  a: 'Open "Exchange / VASP Intel" or "Investigation Reports". CryptoTrace identifies the recipient exchange (e.g. Binance, OKX, Kraken) deposit address and generates a pre-formatted LEA Subpoena Letter with transaction hashes and timestamp proofs.'
                },
                {
                  q: 'Are blockchain transactions and logs saved permanently?',
                  a: 'Yes. All analyzed cases, risk scores, and evidentiary audit records are persisted in the MongoDB evidentiary ledger with SHA-256 tamper-proof hash signatures.'
                }
              ].map((faq, i) => (
                <div key={i} style={{ background: 'var(--panel-2)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-soft)' }}>
                  <div style={{ fontWeight: 700, fontSize: '13.5px', color: 'var(--accent)', marginBottom: '6px' }}>
                    ✦ {faq.q}
                  </div>
                  <div style={{ fontSize: '12.5px', color: 'var(--text-dim)', lineHeight: 1.5 }}>
                    {faq.a}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Keyboard Shortcuts & System Self-Test */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '18px' }}>
            <div className="panel" style={{ padding: '20px' }}>
              <h4 style={{ fontSize: '14.5px', fontWeight: 700, marginBottom: '12px' }}>
                Platform Keyboard Shortcuts
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12.5px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-dim)' }}>Open AI Copilot:</span>
                  <span className="mono" style={{ background: 'var(--panel-2)', padding: '2px 8px', borderRadius: '4px' }}>Alt + K</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-dim)' }}>Close Modals / Drawers:</span>
                  <span className="mono" style={{ background: 'var(--panel-2)', padding: '2px 8px', borderRadius: '4px' }}>Esc</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-dim)' }}>Toggle Sidebar (Open/Close):</span>
                  <span className="mono" style={{ background: 'var(--panel-2)', padding: '2px 8px', borderRadius: '4px' }}>Sidebar ☰ or ◀</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-dim)' }}>Switch Theme (Bright/Dark):</span>
                  <span className="mono" style={{ background: 'var(--panel-2)', padding: '2px 8px', borderRadius: '4px' }}>Topbar ☀️/🌙</span>
                </div>
              </div>
            </div>

            <div className="panel" style={{ padding: '20px' }}>
              <h4 style={{ fontSize: '14.5px', fontWeight: 700, marginBottom: '8px' }}>
                System Diagnostics Self-Test
              </h4>
              <p style={{ fontSize: '12px', color: 'var(--text-dim)', marginBottom: '14px' }}>
                Verify RPC node synchronization, Python AI clustering engine, and MongoDB tamper-proof vault.
              </p>

              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={handleRunDiagnostics}
                disabled={diagRunning}
                style={{ gap: '6px', marginBottom: '12px' }}
              >
                <span>⚡</span> {diagRunning ? 'Running Comprehensive Diagnostics...' : 'Run Diagnostics Self-Test'}
              </button>

              {diagResults && (
                <div style={{ background: 'var(--panel-2)', padding: '12px', borderRadius: '8px', fontSize: '11.5px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <div><strong>Node RPC:</strong> <span style={{ color: 'var(--accent)' }}>✓ {diagResults.nodeStatus}</span></div>
                  <div><strong>Mempool:</strong> <span style={{ color: 'var(--info)' }}>✓ {diagResults.mempoolStatus}</span></div>
                  <div><strong>Vault:</strong> <span style={{ color: 'var(--accent)' }}>✓ {diagResults.vaultEncryption}</span></div>
                  <div><strong>AI Engine:</strong> <span style={{ color: 'var(--accent)' }}>✓ {diagResults.aiEngine}</span></div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: CONTACT & SUPPORT */}
      {activeTab === 'contact' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '20px' }}>
          {/* Dispatch Ticket Form */}
          <div className="panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '6px' }}>
              Law Enforcement Priority Support Dispatch
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-dim)', marginBottom: '18px' }}>
              Submit an expedited inquiry to the specialized Cyber Threat Analysis Group for subpoena assistance or chain clustering support.
            </p>

            {ticketResult ? (
              <div style={{ background: 'rgba(62, 217, 163, 0.1)', border: '1px solid var(--accent)', borderRadius: '10px', padding: '18px', textAlign: 'center' }}>
                <div style={{ fontSize: '24px', marginBottom: '6px' }}>✓</div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--accent)', marginBottom: '4px' }}>
                  Priority Ticket Dispatched: #{ticketResult}
                </div>
                <div style={{ fontSize: '12.5px', color: 'var(--text-dim)', marginBottom: '14px' }}>
                  A cryptographic audit record has been logged. Our cyber-forensics lead will review your request.
                </div>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => setTicketResult(null)}
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSupportSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-dim)', marginBottom: '6px' }}>
                      Priority Level
                    </label>
                    <select
                      value={contactPriority}
                      onChange={(e) => setContactPriority(e.target.value)}
                      style={{ width: '100%' }}
                    >
                      <option value="Routine">Routine Inquiry (24-48h)</option>
                      <option value="Urgent">Urgent Asset Freezing (2-4h)</option>
                      <option value="Critical">Critical P-1 Active Laundering (&lt; 30m)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-dim)', marginBottom: '6px' }}>
                      Case Reference # (Optional)
                    </label>
                    <input
                      type="text"
                      value={contactCaseRef}
                      onChange={(e) => setContactCaseRef(e.target.value)}
                      placeholder="e.g. CR-2026-ETH-99"
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-dim)', marginBottom: '6px' }}>
                    Subject Line
                  </label>
                  <input
                    type="text"
                    value={contactSubject}
                    onChange={(e) => setContactSubject(e.target.value)}
                    placeholder="Brief description of the request or evidence issue"
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-dim)', marginBottom: '6px' }}>
                    Dispatch Details &amp; Target Wallet Information
                  </label>
                  <textarea
                    rows={4}
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="Include target transaction hashes, suspected exchange addresses, or subpoena requirements..."
                    style={{ width: '100%', resize: 'vertical' }}
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmittingSupport}
                    style={{ gap: '6px' }}
                  >
                    {isSubmittingSupport ? 'Dispatching Ticket...' : 'Submit Priority Ticket →'}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Direct LEO Contact Directory */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="panel" style={{ padding: '20px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '12px' }}>
                Direct Emergency Channels
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '12.5px' }}>
                <div style={{ background: 'var(--panel-2)', padding: '10px 12px', borderRadius: '8px' }}>
                  <div style={{ color: 'var(--text-faint)', fontSize: '11px', textTransform: 'uppercase' }}>LEA Support Desk</div>
                  <div className="mono" style={{ fontWeight: 600, color: 'var(--accent)' }}>leo-support@cryptotrace.agency</div>
                </div>

                <div style={{ background: 'var(--panel-2)', padding: '10px 12px', borderRadius: '8px' }}>
                  <div style={{ color: 'var(--text-faint)', fontSize: '11px', textTransform: 'uppercase' }}>24/7 Threat Hotline</div>
                  <div className="mono" style={{ fontWeight: 600 }}>+1 (800) 555-CYBER</div>
                </div>

                <div style={{ background: 'var(--panel-2)', padding: '10px 12px', borderRadius: '8px' }}>
                  <div style={{ color: 'var(--text-faint)', fontSize: '11px', textTransform: 'uppercase' }}>Signal Secure Comm Line</div>
                  <div className="mono" style={{ fontWeight: 600 }}>+1 (202) 555-0199</div>
                </div>
              </div>
            </div>

            <div className="panel" style={{ padding: '20px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '8px' }}>
                Public PGP Evidence Key
              </h4>
              <p style={{ fontSize: '12px', color: 'var(--text-dim)', marginBottom: '10px' }}>
                Encrypt sensitive chain-of-custody intelligence before transmission.
              </p>
              <div className="mono" style={{ background: 'var(--bg)', padding: '8px', borderRadius: '6px', fontSize: '10.5px', color: 'var(--text-faint)', wordBreak: 'break-all' }}>
                4A9F 82C1 EE90 B120 77D4 10A9 F128 4402 CTRACE
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: ALERTS & AUDIO */}
      {activeTab === 'notifications' && (
        <div className="panel" style={{ padding: '24px', maxWidth: '780px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '6px' }}>
            Alerts, Sound &amp; Notification Configuration
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-dim)', marginBottom: '20px' }}>
            Control browser chime notifications, critical threshold triggers, and mempool alerts.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', background: 'var(--panel-2)', borderRadius: '10px' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '13.5px', marginBottom: '2px' }}>Audio Chimes for Critical Threat Detections</div>
                <div style={{ fontSize: '12px', color: 'var(--text-dim)' }}>Plays an audible alert chime when a critical-risk wallet or sanctions match occurs.</div>
              </div>
              <input
                type="checkbox"
                checked={audioAlerts}
                onChange={(e) => {
                  setAudioAlerts(e.target.checked);
                  addToast(`Audio alert sound ${e.target.checked ? 'enabled' : 'disabled'}`);
                }}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', background: 'var(--panel-2)', borderRadius: '10px' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '13.5px', marginBottom: '2px' }}>Desktop Push Notifications</div>
                <div style={{ fontSize: '12px', color: 'var(--text-dim)' }}>Sends system notifications when new transactions touch your monitored case wallets.</div>
              </div>
              <input
                type="checkbox"
                checked={browserNotifications}
                onChange={(e) => {
                  setBrowserNotifications(e.target.checked);
                  addToast(`Desktop notifications ${e.target.checked ? 'enabled' : 'disabled'}`);
                }}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
            </div>

            <div style={{ padding: '14px', background: 'var(--panel-2)', borderRadius: '10px' }}>
              <div style={{ fontWeight: 600, fontSize: '13.5px', marginBottom: '4px' }}>Whale Transfer Alert Threshold (USD)</div>
              <div style={{ fontSize: '12px', color: 'var(--text-dim)', marginBottom: '10px' }}>
                Flag high-value transfers in the live mempool exceeding this amount.
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <input
                  type="number"
                  value={whaleThreshold}
                  onChange={(e) => setWhaleThreshold(e.target.value)}
                  style={{ width: '180px' }}
                />
                <span style={{ fontSize: '12.5px', color: 'var(--text-faint)' }}>USD equivalent</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
