import React, { useState } from 'react';
import { useCase } from '../../context/CaseContext';

export default function ProfileModal() {
  const {
    profileModalOpen,
    setProfileModalOpen,
    investigatorUser,
    investigatorDetails,
    userRole,
    changePassword,
    setActivePage,
    logout,
    addToast
  } = useCase();

  const [activeTab, setActiveTab] = useState('dossier'); // 'dossier' | 'passkey' | 'badge'

  // Change passkey local form
  const [currentPasskey, setCurrentPasskey] = useState('');
  const [newPasskey, setNewPasskey] = useState('');
  const [confirmPasskey, setConfirmPasskey] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  if (!profileModalOpen) return null;

  const isAdmin = userRole === 'admin';
  const displayName = investigatorDetails?.name || (isAdmin ? 'Chief Administrator' : investigatorUser);
  const badgeNum = investigatorDetails?.badgeNumber || (isAdmin ? 'LEA-ADMIN-001' : 'CFU-4402');
  const agency = investigatorDetails?.department || (isAdmin ? 'Financial Crimes Intelligence HQ' : 'Cyber Fraud Cell');
  const email = investigatorDetails?.email || `${investigatorUser}@cryptotrace.internal`;

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!newPasskey) {
      addToast('Please enter a new security passkey.');
      return;
    }
    if (newPasskey.length < 6) {
      addToast('Passkey must be at least 6 characters.');
      return;
    }
    if (newPasskey !== confirmPasskey) {
      addToast('New passkey confirmation does not match.');
      return;
    }

    setIsUpdating(true);
    const res = await changePassword(currentPasskey, newPasskey);
    setIsUpdating(false);
    if (res.success) {
      setCurrentPasskey('');
      setNewPasskey('');
      setConfirmPasskey('');
    }
  };

  const handleDownloadCredentials = () => {
    const credData = {
      agency: "CryptoTrace Global Cyber-Forensics Network",
      officer: displayName,
      badge: badgeNum,
      cell: agency,
      clearance: isAdmin ? "SUPER-ADMIN (ROOT)" : "TIER-3 (LEO)",
      issuedAt: new Date().toISOString(),
      cryptographicHash: "SHA256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069"
    };
    const blob = new Blob([JSON.stringify(credData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CryptoTrace_Credentials_${investigatorUser}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addToast('Investigator credential token exported successfully.');
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(5, 8, 12, 0.78)',
        backdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={() => setProfileModalOpen(false)}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '560px',
          background: 'var(--panel)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.65)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div style={{
          padding: '24px 26px 18px',
          background: 'var(--panel-2)',
          borderBottom: '1px solid var(--border-soft)',
          position: 'relative'
        }}>
          <button
            onClick={() => setProfileModalOpen(false)}
            style={{
              position: 'absolute',
              top: '18px',
              right: '20px',
              color: 'var(--text-faint)',
              fontSize: '18px',
              cursor: 'pointer'
            }}
            title="Close modal"
          >
            ✕
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '58px',
              height: '58px',
              borderRadius: '50%',
              background: isAdmin ? 'rgba(217, 119, 6, 0.18)' : 'rgba(62, 217, 163, 0.15)',
              border: `2px solid ${isAdmin ? '#F59E0B' : 'var(--accent)'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              fontWeight: 800,
              color: isAdmin ? '#F59E0B' : 'var(--accent)',
              boxShadow: `0 0 20px ${isAdmin ? 'rgba(217, 119, 6, 0.25)' : 'rgba(62, 217, 163, 0.2)'}`
            }}>
              {investigatorUser.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>{displayName}</h2>
                <span className="badge" style={{
                  background: isAdmin ? 'rgba(217, 119, 6, 0.18)' : 'rgba(62, 217, 163, 0.15)',
                  color: isAdmin ? '#F59E0B' : 'var(--accent)',
                  border: `1px solid ${isAdmin ? 'rgba(217, 119, 6, 0.4)' : 'rgba(62, 217, 163, 0.4)'}`,
                  fontSize: '10px',
                  fontWeight: 700
                }}>
                  {isAdmin ? 'SUPER-ADMIN' : 'CLEARANCE: LEO TIER-3'}
                </span>
              </div>
              <div style={{ fontSize: '12.5px', color: 'var(--text-dim)' }}>
                {agency} • <span className="mono" style={{ color: 'var(--text-faint)' }}>Badge: {badgeNum}</span>
              </div>
            </div>
          </div>

          {/* Segmented Sub-Tabs */}
          <div style={{
            display: 'flex',
            gap: '8px',
            marginTop: '20px',
            background: 'var(--bg)',
            padding: '4px',
            borderRadius: '8px',
            border: '1px solid var(--border-soft)'
          }}>
            <button
              style={{
                flex: 1,
                padding: '7px 12px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: activeTab === 'dossier' ? 700 : 500,
                color: activeTab === 'dossier' ? 'var(--text)' : 'var(--text-faint)',
                background: activeTab === 'dossier' ? 'var(--panel-2)' : 'transparent',
                transition: 'all 0.15s ease'
              }}
              onClick={() => setActiveTab('dossier')}
            >
              Officer Dossier
            </button>
            <button
              style={{
                flex: 1,
                padding: '7px 12px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: activeTab === 'passkey' ? 700 : 500,
                color: activeTab === 'passkey' ? 'var(--text)' : 'var(--text-faint)',
                background: activeTab === 'passkey' ? 'var(--panel-2)' : 'transparent',
                transition: 'all 0.15s ease'
              }}
              onClick={() => setActiveTab('passkey')}
            >
              Change Passkey
            </button>
            <button
              style={{
                flex: 1,
                padding: '7px 12px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: activeTab === 'badge' ? 700 : 500,
                color: activeTab === 'badge' ? 'var(--text)' : 'var(--text-faint)',
                background: activeTab === 'badge' ? 'var(--panel-2)' : 'transparent',
                transition: 'all 0.15s ease'
              }}
              onClick={() => setActiveTab('badge')}
            >
              Digital Badge &amp; Token
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '22px 26px', maxHeight: '380px', overflowY: 'auto' }}>
          {activeTab === 'dossier' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '12px'
              }}>
                <div style={{ background: 'var(--panel-2)', padding: '12px 14px', borderRadius: '8px', border: '1px solid var(--border-soft)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-faint)', textTransform: 'uppercase', marginBottom: '3px' }}>Officer Identifier</div>
                  <div className="mono" style={{ fontSize: '13px', fontWeight: 600 }}>{investigatorUser}</div>
                </div>

                <div style={{ background: 'var(--panel-2)', padding: '12px 14px', borderRadius: '8px', border: '1px solid var(--border-soft)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-faint)', textTransform: 'uppercase', marginBottom: '3px' }}>Official Email</div>
                  <div style={{ fontSize: '12.5px', fontWeight: 500, color: 'var(--text)' }}>{email}</div>
                </div>

                <div style={{ background: 'var(--panel-2)', padding: '12px 14px', borderRadius: '8px', border: '1px solid var(--border-soft)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-faint)', textTransform: 'uppercase', marginBottom: '3px' }}>Account Status</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', color: 'var(--accent)', fontWeight: 600 }}>
                    <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--accent)' }}></span>
                    Active Duty / Verified
                  </div>
                </div>

                <div style={{ background: 'var(--panel-2)', padding: '12px 14px', borderRadius: '8px', border: '1px solid var(--border-soft)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-faint)', textTransform: 'uppercase', marginBottom: '3px' }}>2FA Compliance</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', color: 'var(--info)', fontWeight: 600 }}>
                    <span>🛡</span> Security OTP Enabled
                  </div>
                </div>
              </div>

              <div style={{
                background: 'var(--bg)',
                border: '1px solid var(--border-soft)',
                borderRadius: '8px',
                padding: '12px 14px',
                fontSize: '11.5px'
              }}>
                <div style={{ fontWeight: 600, color: 'var(--text-dim)', marginBottom: '6px' }}>Terminal Session Security</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-faint)', marginBottom: '4px' }}>
                  <span>Node Address:</span>
                  <span className="mono">127.0.0.1:3000 (Local Cluster)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-faint)' }}>
                  <span>Chain-of-Custody Vault:</span>
                  <span className="mono" style={{ color: 'var(--accent)' }}>AES-256 Tamper-Proof Sync</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'passkey' && (
            <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-dim)', marginBottom: '5px' }}>
                  Current Security Passkey
                </label>
                <input
                  type="password"
                  value={currentPasskey}
                  onChange={(e) => setCurrentPasskey(e.target.value)}
                  placeholder="Enter current passkey / password"
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-dim)', marginBottom: '5px' }}>
                  New Security Passkey
                </label>
                <input
                  type="password"
                  value={newPasskey}
                  onChange={(e) => setNewPasskey(e.target.value)}
                  placeholder="Min 6 characters (e.g. ForensicsSecure2026!)"
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-dim)', marginBottom: '5px' }}>
                  Confirm New Passkey
                </label>
                <input
                  type="password"
                  value={confirmPasskey}
                  onChange={(e) => setConfirmPasskey(e.target.value)}
                  placeholder="Re-type new security passkey"
                  style={{ width: '100%' }}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={isUpdating}
                style={{ width: '100%', justifyContent: 'center', marginTop: '4px' }}
              >
                {isUpdating ? 'Synchronizing Passkey...' : 'Update Security Passkey →'}
              </button>
            </form>
          )}

          {activeTab === 'badge' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', alignItems: 'center', textAlign: 'center' }}>
              <div style={{
                width: '100%',
                background: 'linear-gradient(135deg, rgba(20, 25, 34, 0.95), rgba(16, 20, 27, 0.95))',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                padding: '18px',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-20px',
                  right: '-20px',
                  width: '90px',
                  height: '90px',
                  borderRadius: '50%',
                  background: isAdmin ? 'rgba(217, 119, 6, 0.08)' : 'rgba(62, 217, 163, 0.08)'
                }}></div>

                <div style={{ fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-faint)', marginBottom: '6px' }}>
                  Federal Digital Forensics ID
                </div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text)', marginBottom: '2px' }}>
                  {displayName}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--accent)', fontWeight: 600, marginBottom: '12px' }}>
                  {agency}
                </div>
                <div className="mono" style={{ fontSize: '11px', background: 'var(--panel-2)', padding: '6px 12px', borderRadius: '6px', display: 'inline-block', color: 'var(--text-dim)' }}>
                  ID: {badgeNum} • HASH: e4b0...192f
                </div>
              </div>

              <button
                type="button"
                className="btn btn-ghost"
                onClick={handleDownloadCredentials}
                style={{ width: '100%', justifyContent: 'center', gap: '8px' }}
              >
                <span>📥</span> Download Official LEO Credential Token (.json)
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div style={{
          padding: '14px 26px',
          background: 'var(--panel-2)',
          borderTop: '1px solid var(--border-soft)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => {
              setProfileModalOpen(false);
              setActivePage('settings');
            }}
            style={{ gap: '6px' }}
          >
            <span>⚙</span> Open Settings
          </button>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => {
                setProfileModalOpen(false);
                logout();
              }}
              style={{ color: 'var(--crit)', borderColor: 'rgba(243, 80, 107, 0.3)' }}
            >
              Sign Out ⎋
            </button>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => setProfileModalOpen(false)}
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
