import React from 'react';
import { useCase } from '../../context/CaseContext';

const PAGE_TITLES = {
  dashboard: 'Dashboard',
  wallet: 'Wallet Investigation',
  workspace: 'Investigation Workspace',
  transactions: 'Transactions Evidence',
  txdetail: 'Transaction Details',
  graph: 'Fund Flow Graph',
  crosschain: 'Cross-Chain Analysis',
  vasp: 'Exchange / VASP Intelligence',
  risk: 'Risk Analysis',
  counterparties: 'Counterparties',
  alerts: 'Risk Alerts',
  livemonitor: 'Live Monitoring',
  reports: 'Investigation Reports',
  settings: 'Settings',
  admin: 'Admin Management & Evidentiary Audit Console'
};

export default function Topbar() {
  const {
    activePage,
    setActivePage,
    stats,
    setCopilotOpen,
    isLoggedIn,
    investigatorUser,
    userRole,
    logout,
    sidebarCollapsed,
    toggleSidebar,
    setProfileModalOpen,
    theme,
    setTheme
  } = useCase();
  const title = PAGE_TITLES[activePage] || 'Investigation Hub';

  return (
    <header style={{
      height: '64px',
      padding: '0 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: '1px solid var(--border)',
      background: 'var(--panel)',
      position: 'sticky',
      top: 0,
      zIndex: 20
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Sidebar Open/Close Toggle Button */}
        <button
          type="button"
          onClick={toggleSidebar}
          title={sidebarCollapsed ? 'Open Sidebar (Expand)' : 'Close Sidebar (Collapse)'}
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'var(--panel-2)',
            border: '1px solid var(--border)',
            color: 'var(--text-dim)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--text)';
            e.currentTarget.style.borderColor = 'var(--accent)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--text-dim)';
            e.currentTarget.style.borderColor = 'var(--border)';
          }}
        >
          {sidebarCollapsed ? '⇥' : '☰'}
        </button>

        <h1 style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '-0.01em', margin: 0 }}>
          {title}
        </h1>

        <span className="badge badge-low" title="Validator node synchronization state" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent)' }}></span>
          Node Synced #19,842,091
        </span>

        {userRole === 'admin' ? (
          <span
            className="badge"
            onClick={() => setProfileModalOpen(true)}
            style={{
              background: 'rgba(217, 119, 6, 0.15)',
              border: '1px solid rgba(217, 119, 6, 0.4)',
              color: '#F59E0B',
              fontSize: '10.5px',
              letterSpacing: '0.04em',
              fontWeight: 700,
              cursor: 'pointer'
            }}
            title="View Super-Admin Profile &amp; Passkey"
          >
            CLEARANCE: SUPER-ADMIN
          </span>
        ) : (
          <span
            className="badge badge-neutral"
            onClick={() => setProfileModalOpen(true)}
            style={{ fontSize: '10.5px', letterSpacing: '0.04em', color: 'var(--text-dim)', cursor: 'pointer' }}
            title="View Investigator Profile &amp; Passkey"
          >
            CLEARANCE: TIER-3 (LEO)
          </span>
        )}

        {isLoggedIn && (
          <button
            type="button"
            className="badge badge-neutral"
            onClick={() => setProfileModalOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '11.5px',
              cursor: 'pointer',
              border: '1px solid var(--border-soft)',
              background: 'var(--panel-2)',
              color: 'var(--text)'
            }}
            title="Click to view Investigator Profile Dossier"
          >
            <span style={{ color: userRole === 'admin' ? '#F59E0B' : 'var(--accent)' }}>🔒</span>
            <span style={{ fontWeight: 600 }}>{investigatorUser}</span>
          </button>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Bright & Dark Theme Switcher */}
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          title={theme === 'dark' ? 'Switch to Bright / Light Mode' : 'Switch to Cyber Forensics Dark Mode'}
          style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
        >
          {theme === 'dark' ? '☀️ Bright' : '🌙 Dark'}
        </button>

        <span className="live-pill" title="Real-time multi-chain mempool ingestion">
          <span className="pulse"></span> LIVE
        </span>

        {userRole === 'admin' && activePage !== 'admin' && (
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setActivePage('admin')}
            style={{ borderColor: 'rgba(217, 119, 6, 0.4)', color: '#F59E0B' }}
          >
            🛡 Admin
          </button>
        )}

        <button
          className="btn btn-ghost btn-sm"
          onClick={() => setCopilotOpen(true)}
          style={{ borderColor: 'rgba(78, 143, 224, 0.4)', color: 'var(--info)' }}
        >
          ✦ Copilot
        </button>

        <button
          className="btn btn-ghost btn-sm"
          onClick={() => setActivePage('landing')}
          title="Return to public portal"
        >
          Portal ↗
        </button>

        {isLoggedIn && (
          <button
            className="btn btn-ghost btn-sm"
            onClick={logout}
            style={{ color: 'var(--crit)', borderColor: 'rgba(243,80,107,0.3)' }}
            title="Terminate secure investigator session"
          >
            Sign Out ⎋
          </button>
        )}
      </div>
    </header>
  );
}
