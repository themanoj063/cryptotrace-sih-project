import React from 'react';
import { useCase } from '../../context/CaseContext';

const NAV_ITEMS = [
  { section: 'Overview' },
  { id: 'dashboard', label: 'Dashboard', icon: '◧' },
  
  { section: 'Investigate' },
  { id: 'wallet', label: 'Wallet Investigation', icon: '⌕' },
  { id: 'workspace', label: 'Investigation Workspace', icon: '🗂' },
  { id: 'transactions', label: 'Transactions', icon: '≡' },
  { id: 'graph', label: 'Fund Flow Graph', icon: '⌘' },
  { id: 'crosschain', label: 'Cross-Chain Analysis', icon: '⇄' },
  { id: 'vasp', label: 'Exchange / VASP Intel', icon: '◎' },
  { id: 'risk', label: 'Risk Analysis', icon: '◆' },
  { id: 'counterparties', label: 'Counterparties', icon: '⌗' },
  
  { section: 'Monitor' },
  { id: 'alerts', label: 'Risk Alerts', icon: '▲' },
  { id: 'livemonitor', label: 'Live Monitoring', icon: '◉' },
  { id: 'reports', label: 'Investigation Reports', icon: '▤' },
  
  { section: 'System' },
  { id: 'settings', label: 'Settings', icon: '⚙' }
];

export default function Sidebar() {
  const {
    activePage,
    setActivePage,
    investigatorUser,
    userRole,
    setCopilotOpen,
    logout,
    sidebarCollapsed,
    toggleSidebar,
    setProfileModalOpen
  } = useCase();

  const navItems = [
    ...NAV_ITEMS,
    ...(userRole === 'admin' ? [{ id: 'admin', label: 'Admin Console', icon: '🛡' }] : [])
  ];

  const isCollapsed = !!sidebarCollapsed;

  return (
    <aside style={{
      width: isCollapsed ? '68px' : 'var(--sidebar-w)',
      background: 'var(--panel)',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      position: 'sticky',
      top: 0,
      flexShrink: 0,
      transition: 'width 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      zIndex: 25
    }}>
      {/* Brand & Collapse Header */}
      <div style={{
        padding: isCollapsed ? '16px 12px' : '18px 16px',
        borderBottom: '1px solid var(--border-soft)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: isCollapsed ? 'center' : 'space-between',
        position: 'relative'
      }}>
        <div
          onClick={() => setActivePage('landing')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '11px',
            fontWeight: 800,
            fontSize: '16px',
            letterSpacing: '-0.01em',
            cursor: 'pointer',
            overflow: 'hidden'
          }}
          title={isCollapsed ? 'CryptoTrace — Return to Portal' : undefined}
        >
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, var(--accent), var(--info))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#04110C',
            fontSize: '16px',
            fontWeight: 800,
            flexShrink: 0
          }}>C</div>
          {!isCollapsed && <span>CryptoTrace</span>}
        </div>

        {/* Close / Open Sidebar Toggle Button */}
        <button
          type="button"
          onClick={toggleSidebar}
          title={isCollapsed ? 'Expand Sidebar (Open)' : 'Collapse Sidebar (Close)'}
          style={{
            width: '26px',
            height: '26px',
            borderRadius: '6px',
            background: 'var(--panel-2)',
            border: '1px solid var(--border)',
            color: 'var(--text-dim)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '11px',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            marginLeft: isCollapsed ? 0 : '6px',
            position: isCollapsed ? 'absolute' : 'static',
            top: isCollapsed ? '6px' : 'auto',
            right: isCollapsed ? '4px' : 'auto'
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
          {isCollapsed ? '▶' : '◀'}
        </button>
      </div>

      {/* Nav links */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        overflowX: 'hidden',
        padding: isCollapsed ? '12px 6px' : '14px 10px'
      }}>
        {navItems.map((item, idx) => {
          if (item.section) {
            if (isCollapsed) {
              return (
                <div
                  key={`sec-${idx}`}
                  style={{
                    height: '1px',
                    background: 'var(--border-soft)',
                    margin: '10px 6px'
                  }}
                />
              );
            }
            return (
              <div
                key={`sec-${idx}`}
                style={{
                  fontSize: '10.5px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: 'var(--text-faint)',
                  padding: '12px 10px 4px',
                  marginTop: idx === 0 ? 0 : '6px'
                }}
              >
                {item.section}
              </div>
            );
          }

          const isActive = activePage === item.id;
          return (
            <div
              key={item.id}
              onClick={() => setActivePage(item.id)}
              title={item.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: isCollapsed ? 'center' : 'flex-start',
                gap: '11px',
                padding: isCollapsed ? '10px 0' : '9px 12px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? 'var(--text)' : 'var(--text-dim)',
                background: isActive ? 'var(--panel-2)' : 'transparent',
                borderLeft: isCollapsed ? 'none' : (isActive ? (item.id === 'admin' ? '3px solid #F59E0B' : '3px solid var(--accent)') : '3px solid transparent'),
                boxShadow: isCollapsed && isActive ? `inset 0 0 0 1px ${item.id === 'admin' ? '#F59E0B' : 'var(--accent)'}` : 'none',
                cursor: 'pointer',
                marginBottom: '3px',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.color = 'var(--text)';
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.color = 'var(--text-dim)';
              }}
            >
              <span style={{ fontSize: '14px', opacity: isActive ? 1 : 0.75 }}>{item.icon}</span>
              {!isCollapsed && (
                <>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.label}
                  </span>
                  {item.id === 'admin' && (
                    <span style={{ marginLeft: 'auto', fontSize: '9.5px', background: 'rgba(217, 119, 6, 0.2)', color: '#F59E0B', padding: '1px 5px', borderRadius: '4px', fontWeight: 700 }}>
                      ROOT
                    </span>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Copilot trigger button */}
      <div style={{ padding: isCollapsed ? '0 8px 10px' : '0 12px 12px' }}>
        <button
          className="btn btn-primary"
          style={{
            width: '100%',
            justifyContent: 'center',
            fontSize: '12.5px',
            padding: isCollapsed ? '9px 0' : '9px 12px'
          }}
          onClick={() => setCopilotOpen(true)}
          title="Open Forensic AI Copilot (Alt+K)"
        >
          <span>✦</span> {!isCollapsed && 'AI Copilot'}
        </button>
      </div>

      {/* User profile footer - Clickable to open Profile Modal */}
      <div
        onClick={() => setProfileModalOpen(true)}
        title="Open Investigator Profile Dossier &amp; Passkey Settings"
        style={{
          padding: isCollapsed ? '14px 10px' : '14px 16px',
          borderTop: '1px solid var(--border-soft)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'flex-start',
          gap: '10px',
          cursor: 'pointer',
          background: 'var(--panel)',
          transition: 'background 0.15s ease'
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--panel-2)'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'var(--panel)'}
      >
        <div style={{
          width: '34px',
          height: '34px',
          borderRadius: '50%',
          background: userRole === 'admin' ? 'rgba(217, 119, 6, 0.18)' : 'var(--panel-2)',
          border: userRole === 'admin' ? '1.5px solid rgba(217, 119, 6, 0.6)' : '1.5px solid var(--accent)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '11.5px',
          fontWeight: 800,
          color: userRole === 'admin' ? '#F59E0B' : 'var(--accent)',
          flexShrink: 0
        }}>
          {investigatorUser.slice(0, 2).toUpperCase()}
        </div>

        {!isCollapsed && (
          <>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '12.5px', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {investigatorUser}
              </div>
              <div style={{ fontSize: '11px', color: userRole === 'admin' ? '#F59E0B' : 'var(--text-faint)', fontWeight: userRole === 'admin' ? 600 : 400 }}>
                {userRole === 'admin' ? 'Super-Admin 🛡' : 'Cyber Fraud Cell'}
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                logout();
              }}
              title="Sign Out / Lock Session"
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-faint)',
                cursor: 'pointer',
                fontSize: '15px',
                padding: '4px'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--crit)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-faint)'}
            >
              ⎋
            </button>
          </>
        )}
      </div>
    </aside>
  );
}
