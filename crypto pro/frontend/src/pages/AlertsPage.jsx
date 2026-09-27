import React, { useState } from 'react';
import { useCase } from '../context/CaseContext';

const PRESETS = [
  {
    label: 'Mixer Hop',
    sev: 'CRITICAL',
    msg: 'Sanctioned mixer interaction detected on fund path',
    reason: 'OFAC SDN router contract interaction with unhosted hops',
    action: 'Generate immediate emergency freeze request to downstream VASP'
  },
  {
    label: 'Rapid Layering',
    sev: 'HIGH',
    msg: 'Abnormal transfer velocity: 3 hops under 15 minutes',
    reason: 'Pass-through peeling chain detected matching automated laundering playbooks',
    action: 'Subpoena account creation KYC and IP logs for intermediate nodes'
  },
  {
    label: 'VASP Cashout',
    sev: 'CRITICAL',
    msg: 'Deposit sweep to known offshore VASP hot wallet cluster',
    reason: 'Omnibus exchange cluster deposit confirmed by heuristic attribution',
    action: 'Serve statutory preservation request upon exchange compliance desk'
  },
  {
    label: 'Cross-Chain Bridge',
    sev: 'MEDIUM',
    msg: 'Bridged asset transfer across heterogenous chains',
    reason: 'EVM to non-EVM protocol swap used to sever transaction graph continuity',
    action: 'Cross-reference bridge transaction payload and destination chain'
  }
];

export default function AlertsPage() {
  const { alerts, createAlert, activeCase } = useCase();
  const [filterSev, setFilterSev] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [wallet, setWallet] = useState(activeCase?.address || '');
  const [caseId, setCaseId] = useState(activeCase?.caseId || 'CT-2026-ALERT');
  const [sev, setSev] = useState('HIGH');
  const [msg, setMsg] = useState('');
  const [reason, setReason] = useState('');
  const [action, setAction] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Combine database alerts and active case alerts
  const allAlerts = [...alerts];
  if (activeCase && activeCase.alerts) {
    activeCase.alerts.forEach((a) => {
      if (!allAlerts.some((x) => x.msg === a.msg && x.caseId === activeCase.caseId)) {
        allAlerts.unshift({
          ...a,
          caseId: activeCase.caseId || activeCase.id,
          wallet: activeCase.address,
          time: activeCase.lastTx || new Date()
        });
      }
    });
  }

  const sevColor = (s) => {
    switch (s) {
      case 'CRITICAL': return 'var(--crit)';
      case 'HIGH': return 'var(--high)';
      case 'MEDIUM': return 'var(--warn)';
      default: return 'var(--info)';
    }
  };

  const fmtAddr = (a) => (a && a.length > 16 ? a.slice(0, 6) + '...' + a.slice(-4) : a || '');

  const filteredAlerts = allAlerts.filter((a) => {
    const matchesSev = filterSev === 'ALL' || a.sev === filterSev;
    const matchesSearch = !searchQuery || 
      (a.msg && a.msg.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (a.wallet && a.wallet.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (a.caseId && a.caseId.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSev && matchesSearch;
  });

  const handleApplyPreset = (p) => {
    setSev(p.sev);
    setMsg(p.msg);
    setReason(p.reason);
    setAction(p.action);
  };

  const handleSubmitAlert = async (e) => {
    e.preventDefault();
    if (!wallet.trim() || !msg.trim()) return;

    setIsSubmitting(true);
    const res = await createAlert({
      wallet: wallet.trim(),
      caseId: caseId.trim() || 'CT-2026-ALERT',
      sev,
      msg: msg.trim(),
      reason: reason.trim(),
      action: action.trim()
    });

    setIsSubmitting(false);
    if (res) {
      setShowAddModal(false);
      setMsg('');
      setReason('');
      setAction('');
    }
  };

  return (
    <div style={{ padding: '24px 28px' }}>
      <div className="panel">
        <div className="panel-head" style={{ flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <h3>Risk Alerts Center</h3>
            <div className="sub">Automated &amp; investigator-registered forensic risk alerts secured in evidence vault</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="badge badge-critical">{allAlerts.length} Total Alerts</span>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => {
                if (activeCase?.address) setWallet(activeCase.address);
                if (activeCase?.caseId) setCaseId(activeCase.caseId);
                setShowAddModal(true);
              }}
            >
              ＋ Add Alert
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div style={{
          display: 'flex',
          gap: '12px',
          alignItems: 'center',
          flexWrap: 'wrap',
          marginBottom: '20px',
          paddingBottom: '16px',
          borderBottom: '1px solid var(--border)'
        }}>
          <div style={{ display: 'flex', gap: '6px' }}>
            {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'INFO'].map((s) => (
              <button
                key={s}
                className={`btn btn-sm ${filterSev === s ? 'btn-primary' : 'btn-ghost'}`}
                style={{ fontSize: '11px', padding: '4px 10px' }}
                onClick={() => setFilterSev(s)}
              >
                {s}
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="Search alerts by message, wallet or case ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              minWidth: '220px',
              padding: '7px 12px',
              borderRadius: '6px',
              border: '1px solid var(--border)',
              background: 'var(--panel)',
              color: 'var(--text)',
              fontSize: '13px'
            }}
          />
        </div>

        {/* Add Alert Modal / Form */}
        {showAddModal && (
          <div style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid var(--border-focus)',
            borderRadius: '10px',
            padding: '20px 24px',
            marginBottom: '24px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.3)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text)' }}>
                Register New Forensic Risk Alert
              </div>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setShowAddModal(false)}
                style={{ padding: '2px 8px' }}
              >
                ✕ Close
              </button>
            </div>

            {/* Presets */}
            <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>Quick Templates:</span>
              {PRESETS.map((p, i) => (
                <button
                  key={i}
                  type="button"
                  className="chip"
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleApplyPreset(p)}
                >
                  {p.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmitAlert}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '14px', marginBottom: '12px' }}>
                <div className="field">
                  <label>Target Wallet Address *</label>
                  <input
                    type="text"
                    placeholder="e.g. 0x8921b03378907865219087110192837465912837"
                    value={wallet}
                    onChange={(e) => setWallet(e.target.value)}
                    required
                  />
                </div>
                <div className="field">
                  <label>Case Reference ID</label>
                  <input
                    type="text"
                    placeholder="e.g. CT-2026-0142"
                    value={caseId}
                    onChange={(e) => setCaseId(e.target.value)}
                  />
                </div>
                <div className="field">
                  <label>Severity Level</label>
                  <select value={sev} onChange={(e) => setSev(e.target.value)}>
                    <option value="CRITICAL">CRITICAL</option>
                    <option value="HIGH">HIGH</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="INFO">INFO</option>
                  </select>
                </div>
              </div>

              <div className="field" style={{ marginBottom: '12px' }}>
                <label>Alert Message *</label>
                <input
                  type="text"
                  placeholder="e.g. Suspicious transfer of $120,000 to unverified OTC intermediary"
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                <div className="field">
                  <label>Heuristic / AML Reason</label>
                  <input
                    type="text"
                    placeholder="e.g. Inflow directly preceded by stolen victim bridge exploit"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />
                </div>
                <div className="field">
                  <label>Recommended Enforcement Action</label>
                  <input
                    type="text"
                    placeholder="e.g. Issue immediate preservation notice to exchange"
                    value={action}
                    onChange={(e) => setAction(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                  disabled={isSubmitting || !wallet.trim() || !msg.trim()}
                >
                  {isSubmitting ? 'Securing in Vault…' : 'Commit Alert to Case Dossier'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Alerts List */}
        {filteredAlerts.length > 0 ? (
          <div>
            {filteredAlerts.map((a, i) => (
              <div key={i} className="alert-item">
                <div className="sev-bar" style={{ background: sevColor(a.sev) }}></div>
                <div className="body">
                  <div className="row1">
                    <span className="msg">{a.msg}</span>
                    <span className="badge" style={{ background: `${sevColor(a.sev)}22`, color: sevColor(a.sev) }}>
                      {a.sev}
                    </span>
                  </div>
                  {a.reason && (
                    <div style={{ fontSize: '12.5px', color: 'var(--text-dim)', marginBottom: '4px' }}>
                      {a.reason}
                    </div>
                  )}
                  <div className="meta">
                    <span className="mono">Target: {fmtAddr(a.wallet)}</span>
                    <span>Case Ref: {a.caseId || 'CT-2026'}</span>
                    <span>{new Date(a.time || a.createdAt).toLocaleString()}</span>
                  </div>
                  {a.action && (
                    <div className="rec">
                      → Action Required: {a.action}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="glyph">▲</div>
            <h4>No matching alerts registered</h4>
            <p>Try clearing your search query or click "＋ Add Alert" to record a new investigation alert.</p>
          </div>
        )}
      </div>
    </div>
  );
}
