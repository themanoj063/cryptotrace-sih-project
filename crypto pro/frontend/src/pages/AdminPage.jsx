import React, { useState, useEffect } from 'react';
import { useCase } from '../context/CaseContext';

export default function AdminPage() {
  const {
    investigatorUser,
    userRole,
    adminUsers,
    adminLogs,
    fetchAdminUsers,
    updateAdminUser,
    deleteAdminUser,
    fetchAdminLogs,
    register,
    setActivePage
  } = useCase();

  const [activeTab, setActiveTab] = useState('directory'); // 'directory' | 'logs' | 'policy'
  const [searchTerm, setSearchTerm] = useState('');
  const [showProvisionModal, setShowProvisionModal] = useState(false);

  // New user modal form
  const [newUsername, setNewUsername] = useState('');
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState('investigator');
  const [newDepartment, setNewDepartment] = useState('Cyber Fraud Cell');
  const [newPassword, setNewPassword] = useState('passkey2026!');
  const [modalSubmitting, setModalSubmitting] = useState(false);
  const [modalError, setModalError] = useState('');

  // Initial load
  useEffect(() => {
    fetchAdminUsers();
    fetchAdminLogs();
  }, []);

  // Filtered users
  const filteredUsers = (adminUsers || []).filter((u) => {
    const q = searchTerm.toLowerCase();
    return (
      (u.username && u.username.toLowerCase().includes(q)) ||
      (u.name && u.name.toLowerCase().includes(q)) ||
      (u.department && u.department.toLowerCase().includes(q)) ||
      (u.role && u.role.toLowerCase().includes(q))
    );
  });

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!newUsername.trim() || !newName.trim() || !newEmail.trim() || !newPassword.trim()) {
      setModalError('Please fill in all mandatory fields.');
      return;
    }
    setModalError('');
    setModalSubmitting(true);
    const res = await register({
      username: newUsername.trim(),
      name: newName.trim(),
      email: newEmail.trim(),
      password: newPassword.trim(),
      department: newDepartment.trim(),
      role: newRole
    });
    setModalSubmitting(false);
    if (res?.success) {
      setShowProvisionModal(false);
      fetchAdminUsers();
      setNewUsername('');
      setNewName('');
      setNewEmail('');
    } else {
      setModalError(res?.error || 'Provisioning failed.');
    }
  };

  const roleBadge = (r) => {
    switch (r) {
      case 'admin':
        return { label: 'Chief Admin', bg: 'rgba(138, 110, 240, 0.15)', color: '#a78bfa', border: 'rgba(138, 110, 240, 0.4)' };
      case 'senior_analyst':
        return { label: 'Senior Lead', bg: 'rgba(78, 143, 224, 0.15)', color: 'var(--info)', border: 'rgba(78, 143, 224, 0.4)' };
      default:
        return { label: 'Investigator', bg: 'rgba(62, 217, 163, 0.15)', color: 'var(--accent)', border: 'rgba(62, 217, 163, 0.4)' };
    }
  };

  const statusBadge = (s) => {
    switch (s) {
      case 'suspended':
        return { label: 'Suspended', bg: 'rgba(243, 80, 107, 0.15)', color: 'var(--crit)' };
      case 'pending':
        return { label: 'Pending', bg: 'rgba(232, 185, 74, 0.15)', color: 'var(--warn)' };
      default:
        return { label: 'Active', bg: 'rgba(62, 217, 163, 0.15)', color: 'var(--accent)' };
    }
  };

  return (
    <div style={{ padding: '24px 28px' }}>
      {/* Admin Header */}
      <div className="panel" style={{ marginBottom: '20px', padding: '24px 28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge" style={{ background: 'rgba(138, 110, 240, 0.18)', color: '#a78bfa', borderColor: 'rgba(138, 110, 240, 0.35)' }}>
                🛡 SUPER-ADMINISTRATOR PRIVILEGES
              </span>
              <span className="badge badge-low">CLEARANCE: TIER-3 (TOP SECRET)</span>
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '4px' }}>
              Investigator Access Control &amp; System Administration
            </h2>
            <div style={{ fontSize: '13px', color: 'var(--text-dim)' }}>
              Manage investigator clearance, provision new badge accounts, and review cryptographic security audit logs.
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => {
                fetchAdminUsers();
                fetchAdminLogs();
              }}
            >
              ↻ Refresh Telemetry
            </button>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => setShowProvisionModal(true)}
            >
              ＋ Provision Investigator
            </button>
          </div>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="cards-row" style={{ marginBottom: '20px' }}>
        <div className="stat-card">
          <div className="top">
            <div className="ic" style={{ background: 'rgba(78, 143, 224, 0.15)', color: 'var(--info)' }}>👥</div>
          </div>
          <div className="val">{adminUsers.length || 4}</div>
          <div className="lbl">Total Registered Accounts</div>
          <div className="delta">active directory</div>
        </div>

        <div className="stat-card">
          <div className="top">
            <div className="ic" style={{ background: 'rgba(138, 110, 240, 0.15)', color: '#a78bfa' }}>🛡</div>
          </div>
          <div className="val">{adminUsers.filter(u => u.role === 'admin').length || 1}</div>
          <div className="lbl">Chief Administrators</div>
          <div className="delta">root authority</div>
        </div>

        <div className="stat-card">
          <div className="top">
            <div className="ic" style={{ background: 'rgba(62, 217, 163, 0.15)', color: 'var(--accent)' }}>🔒</div>
          </div>
          <div className="val">100%</div>
          <div className="lbl">2FA / OTP Enforced</div>
          <div className="delta">cryptographic verification</div>
        </div>

        <div className="stat-card">
          <div className="top">
            <div className="ic" style={{ background: 'rgba(232, 185, 74, 0.15)', color: 'var(--warn)' }}>⌘</div>
          </div>
          <div className="val">{adminLogs.length || 12}</div>
          <div className="lbl">Audit Trail Events</div>
          <div className="delta">immutable log</div>
        </div>
      </div>

      {/* Main Panel with Tabs */}
      <div className="panel">
        <div className="panel-head" style={{ borderBottom: '1px solid var(--border)', flexWrap: 'wrap', gap: '14px' }}>
          <div style={{ display: 'flex', gap: '4px' }}>
            <button
              type="button"
              className={`docs-tab-btn ${activeTab === 'directory' ? 'active' : ''}`}
              onClick={() => setActiveTab('directory')}
            >
              Investigator Directory ({adminUsers.length})
            </button>
            <button
              type="button"
              className={`docs-tab-btn ${activeTab === 'logs' ? 'active' : ''}`}
              onClick={() => setActiveTab('logs')}
            >
              Evidentiary Audit Trail ({adminLogs.length})
            </button>
            <button
              type="button"
              className={`docs-tab-btn ${activeTab === 'policy' ? 'active' : ''}`}
              onClick={() => setActiveTab('policy')}
            >
              Security Policy &amp; MFA
            </button>
          </div>

          {activeTab === 'directory' && (
            <input
              type="text"
              placeholder="Search by badge, name, or agency…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '280px', fontSize: '12px' }}
            />
          )}
        </div>

        {/* TAB 1: INVESTIGATOR DIRECTORY */}
        {activeTab === 'directory' && (
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Badge ID</th>
                  <th>Full Name &amp; Email</th>
                  <th>Agency / Department</th>
                  <th>Clearance Role</th>
                  <th>Status</th>
                  <th>Last Activity</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => {
                  const rb = roleBadge(u.role);
                  const sb = statusBadge(u.status);
                  const isSelf = u.username === investigatorUser;
                  return (
                    <tr key={u.id || u.username} className="tx-row">
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '6px',
                            background: u.role === 'admin' ? 'rgba(138, 110, 240, 0.2)' : 'var(--panel-2)',
                            color: u.role === 'admin' ? '#a78bfa' : 'var(--text-dim)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: '11px',
                            border: '1px solid var(--border-soft)'
                          }}>
                            {u.role === 'admin' ? '🛡' : u.username.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <b className="mono" style={{ fontSize: '13px' }}>{u.username}</b>
                            {isSelf && (
                              <span style={{ marginLeft: '6px', fontSize: '10px', color: 'var(--accent)' }}>(You)</span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td>
                        <div style={{ fontWeight: 600 }}>{u.name}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-faint)' }}>{u.email}</div>
                      </td>

                      <td>
                        <div style={{ fontSize: '12.5px' }}>{u.department || 'Financial Crimes Cyber Unit'}</div>
                        <div style={{ fontSize: '10.5px', color: 'var(--text-faint)' }}>Badge: {u.badgeNumber || 'LEA-STD'}</div>
                      </td>

                      <td>
                        <span
                          className="badge"
                          style={{ background: rb.bg, color: rb.color, borderColor: rb.border, fontSize: '11px' }}
                        >
                          {rb.label}
                        </span>
                      </td>

                      <td>
                        <span
                          className="badge"
                          style={{ background: sb.bg, color: sb.color, fontSize: '11px' }}
                        >
                          {sb.label}
                        </span>
                      </td>

                      <td style={{ fontSize: '11.5px', color: 'var(--text-faint)' }}>
                        {u.lastLogin ? new Date(u.lastLogin).toLocaleDateString() : 'Active Today'}
                      </td>

                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                          {/* Toggle Status */}
                          <button
                            className="btn btn-ghost btn-sm"
                            style={{ padding: '4px 8px', fontSize: '11px' }}
                            disabled={isSelf}
                            onClick={() => {
                              const newSt = u.status === 'suspended' ? 'active' : 'suspended';
                              updateAdminUser(u.username, { status: newSt });
                            }}
                          >
                            {u.status === 'suspended' ? 'Reactivate' : 'Suspend'}
                          </button>

                          {/* Toggle Role */}
                          <button
                            className="btn btn-ghost btn-sm"
                            style={{ padding: '4px 8px', fontSize: '11px' }}
                            disabled={isSelf || u.username === 'admin'}
                            onClick={() => {
                              const newR = u.role === 'admin' ? 'investigator' : 'admin';
                              updateAdminUser(u.username, { role: newR });
                            }}
                          >
                            {u.role === 'admin' ? 'Demote' : 'Make Admin'}
                          </button>

                          {/* Delete */}
                          <button
                            className="btn btn-ghost btn-sm"
                            style={{ padding: '4px 8px', fontSize: '11px', color: 'var(--crit)', borderColor: 'rgba(243,80,107,0.3)' }}
                            disabled={isSelf || u.username === 'admin'}
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to permanently remove investigator ${u.username}?`)) {
                                deleteAdminUser(u.username);
                              }
                            }}
                          >
                            ✕
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 2: AUDIT LOGS */}
        {activeTab === 'logs' && (
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Event Type</th>
                  <th>Investigator / Actor</th>
                  <th>Cryptographic Action Details</th>
                  <th>Origin IP</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {adminLogs.map((log) => (
                  <tr key={log.id} className="tx-row">
                    <td>
                      <span className="badge badge-info mono" style={{ fontSize: '10.5px' }}>
                        {log.event}
                      </span>
                    </td>
                    <td>
                      <b className="mono" style={{ fontSize: '12.5px', color: 'var(--accent)' }}>
                        {log.username}
                      </b>
                    </td>
                    <td style={{ fontSize: '12px', color: 'var(--text-dim)' }}>
                      {log.details}
                    </td>
                    <td>
                      <span className="mono" style={{ fontSize: '11px', color: 'var(--text-faint)' }}>
                        {log.ip}
                      </span>
                    </td>
                    <td style={{ fontSize: '11.5px', color: 'var(--text-faint)' }}>
                      {new Date(log.timestamp).toLocaleTimeString()} · {new Date(log.timestamp).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 3: SYSTEM POLICY */}
        {activeTab === 'policy' && (
          <div style={{ padding: '24px 28px' }}>
            <div style={{ maxWidth: '720px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px', color: 'var(--accent)' }}>
                System Access Control &amp; Authentication Policies
              </h3>
              <p style={{ color: 'var(--text-dim)', fontSize: '13px', marginBottom: '24px' }}>
                Federal regulations mandate multi-factor authentication and cryptographically signed session tokens for law enforcement systems handling chain-of-custody intelligence.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ background: 'var(--panel-2)', padding: '16px 20px', borderRadius: '9px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '13.5px' }}>Two-Factor OTP Enforcement</div>
                    <div style={{ fontSize: '11.5px', color: 'var(--text-faint)' }}>Enforce 6-digit cryptographic OTP generation on all investigator sign-ins.</div>
                  </div>
                  <span className="badge badge-low">ENFORCED</span>
                </div>

                <div style={{ background: 'var(--panel-2)', padding: '16px 20px', borderRadius: '9px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '13.5px' }}>Cryptographic Evidentiary Audit Trail</div>
                    <div style={{ fontSize: '11.5px', color: 'var(--text-faint)' }}>All wallet traces, node lookups, and report exports are logged to the tamper-evident journal.</div>
                  </div>
                  <span className="badge badge-low">ACTIVE</span>
                </div>

                <div style={{ background: 'var(--panel-2)', padding: '16px 20px', borderRadius: '9px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '13.5px' }}>Session Token Invalidation Window</div>
                    <div style={{ fontSize: '11.5px', color: 'var(--text-faint)' }}>Automatic expiration of investigator clearance tokens after 12 continuous hours.</div>
                  </div>
                  <span className="badge badge-neutral mono">12 HOURS</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Provision Investigator Modal */}
      {showProvisionModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(3, 7, 13, 0.85)',
            backdropFilter: 'blur(10px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px'
          }}
          onClick={() => setShowProvisionModal(false)}
        >
          <div
            className="panel"
            style={{
              width: '100%',
              maxWidth: '520px',
              padding: '28px',
              boxShadow: '0 30px 90px rgba(0,0,0,0.85)',
              border: '1px solid var(--border-focus)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div>
                <h3 style={{ fontSize: '17px', fontWeight: 800 }}>Provision New Investigator Account</h3>
                <div style={{ fontSize: '11.5px', color: 'var(--text-faint)' }}>Super-Admin Direct Clearance Authorization</div>
              </div>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setShowProvisionModal(false)}
              >
                ✕
              </button>
            </div>

            {modalError && (
              <div style={{ background: 'rgba(243,80,107,.1)', color: 'var(--crit)', padding: '10px', borderRadius: '8px', fontSize: '12px', marginBottom: '14px' }}>
                {modalError}
              </div>
            )}

            <form onSubmit={handleCreateUser}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-faint)', marginBottom: '4px', fontWeight: 600 }}>
                    Badge ID / Username *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. agent_cooper"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    style={{ width: '100%' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-faint)', marginBottom: '4px', fontWeight: 600 }}>
                    Full Legal Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Dale Cooper"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    style={{ width: '100%' }}
                    required
                  />
                </div>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-faint)', marginBottom: '4px', fontWeight: 600 }}>
                  Official Email Address *
                </label>
                <input
                  type="email"
                  placeholder="e.g. cooper@fbi.gov"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  style={{ width: '100%' }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-faint)', marginBottom: '4px', fontWeight: 600 }}>
                    Clearance Role
                  </label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    style={{ width: '100%' }}
                  >
                    <option value="investigator">Investigator (LEO)</option>
                    <option value="senior_analyst">Senior Forensic Lead</option>
                    <option value="admin">Chief Administrator</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-faint)', marginBottom: '4px', fontWeight: 600 }}>
                    Initial Passkey *
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    style={{ width: '100%' }}
                    required
                  />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-faint)', marginBottom: '4px', fontWeight: 600 }}>
                  Agency / Department
                </label>
                <input
                  type="text"
                  placeholder="e.g. Federal Bureau of Investigation"
                  value={newDepartment}
                  onChange={(e) => setNewDepartment(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => setShowProvisionModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                  disabled={modalSubmitting}
                >
                  {modalSubmitting ? 'Provisioning…' : 'Authorize & Create Account →'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
