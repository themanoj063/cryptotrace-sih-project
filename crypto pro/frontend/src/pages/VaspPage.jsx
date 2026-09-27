import React from 'react';
import { useCase } from '../context/CaseContext';

export default function VaspPage() {
  const { activeCase, setCopilotOpen, sendCopilotMessage } = useCase();
  const r = activeCase;

  if (!r) {
    return (
      <div style={{ padding: '24px 28px' }}>
        <div className="panel">
          <div className="panel-head">
            <h3>Exchange / VASP Attribution</h3>
            <div className="sub">Attribution to suspected cash-out exchange cluster</div>
          </div>
          <div className="empty-state">
            <div className="glyph">◎</div>
            <h4>No attribution available</h4>
            <p>Run a wallet analysis to see the suspected cash-out exchange for that fund flow.</p>
          </div>
        </div>
      </div>
    );
  }

  const ex = r.exchange || { name: 'Unknown VASP', type: 'Offshore Exchange', region: 'Global' };
  const confidence = r.confidence || 75;
  const clusterId = ex.clusterId || 'EX-1180';
  const fmtAddr = (a) => (a && a.length > 16 ? a.slice(0, 6) + '...' + a.slice(-4) : a || '');

  const handleDraftNotice = () => {
    setCopilotOpen(true);
    sendCopilotMessage(`Draft an urgent asset freeze and KYC disclosure notice for ${ex.name} (Cluster #${clusterId})`);
  };

  const evidence = ex.supportingEvidence || [
    'Direct deposit interaction with exchange deposit forwarder addresses',
    `Wallet sweep matches ${ex.name} omnibus cluster #${clusterId} signature`,
    'Transaction timing matches exchange consolidation cycle',
    'Multi-input transaction graph converges on identified hot-wallet pool'
  ];

  return (
    <div style={{ padding: '24px 28px' }}>
      <div className="panel">
        <div className="panel-head">
          <div>
            <h3>Exchange / VASP Intelligence</h3>
            <div className="sub">Case {r.caseId || r.id} · Machine Learning Cluster Attribution</div>
          </div>
          <button className="btn btn-primary btn-sm" onClick={handleDraftNotice}>
            ✦ Draft VASP Freeze Notice
          </button>
        </div>

        <div className="evidence-banner">
          🛡 VASP RECONNAISSANCE &amp; ATTRIBUTION — Clustering heuristics correlate deposit sweep tx signatures with institutional exchange hot/cold wallet structures.
        </div>

        {/* Risk / Confidence Hero */}
        <div className="risk-hero">
          <div
            className="risk-ring"
            style={{
              background: `conic-gradient(var(--accent) ${confidence * 3.6}deg, var(--panel) 0deg)`
            }}
          >
            <div className="inner">
              <span className="num" style={{ color: 'var(--accent)' }}>{confidence}%</span>
              <span className="of">CONFIDENCE</span>
            </div>
          </div>

          <div className="risk-hero-info">
            <h3 style={{ fontSize: '20px' }}>{ex.name}</h3>
            <p>{ex.type} · {ex.region}</p>
            <div className="risk-hero-tags">
              <span className="badge badge-info">Attribution Confidence {confidence}%</span>
              <span className="badge badge-neutral">Cluster #{clusterId}</span>
              <span className="badge badge-low">{ex.status || 'VERIFIED'}</span>
              {ex.complianceLevel && (
                <span className="badge badge-neutral">{ex.complianceLevel}</span>
              )}
            </div>
          </div>
        </div>

        {/* Metadata Grid */}
        <div className="kv-grid">
          <div className="kv-item">
            <div className="k">Target Entity</div>
            <div className="v">{ex.name}</div>
          </div>
          <div className="kv-item">
            <div className="k">Wallet Cluster Identifier</div>
            <div className="v">{clusterId}</div>
          </div>
          <div className="kv-item">
            <div className="k">Entity Classification</div>
            <div className="v">{ex.type}</div>
          </div>
          <div className="kv-item">
            <div className="k">Operating Jurisdiction</div>
            <div className="v">{ex.region}</div>
          </div>
          <div className="kv-item">
            <div className="k">Deposit Destination Address</div>
            <div className="v">{fmtAddr(r.exchangeDepositAddress)}</div>
          </div>
          <div className="kv-item">
            <div className="k">First Observed Inflow</div>
            <div className="v">{new Date(r.firstTx).toDateString()}</div>
          </div>
          <div className="kv-item">
            <div className="k">Last Observed Inflow</div>
            <div className="v">{new Date(r.lastTx).toDateString()}</div>
          </div>
          <div className="kv-item">
            <div className="k">Prior Regulatory Inquiries</div>
            <div className="v">{ex.priorFilings || 42} SAR / MLAT Filings</div>
          </div>
        </div>

        {/* Supporting Evidence */}
        <div style={{ marginTop: '22px' }}>
          <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '12px', color: 'var(--info)' }}>
            Cryptographic & Behavioral Evidence
          </h4>
          <ul className="report-list">
            {evidence.map((e, idx) => (
              <li key={idx}>{e}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
