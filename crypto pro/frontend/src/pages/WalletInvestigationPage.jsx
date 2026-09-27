import React, { useState } from 'react';
import { useCase } from '../context/CaseContext';
import { fmtUSD, fmtAddr, fmtDate, riskColor, riskBadgeClass } from '../utils/formatters';

const EXAMPLE_WALLETS = [
  {
    suspect: '0x7a41f3c9b2e6d0a184f7c3b9e8a2d15f6c7e91f',
    victim: '0x4b10293847561029384756102938475610293847',
    chain: 'Ethereum',
    label: 'Case #2026-089 · Lazarus Ronin Bridge Peeling (ETH)'
  },
  {
    suspect: 'bc1q9x3k2p8m7n4v6c1z0a5s8d3f7g2h9j4',
    victim: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
    chain: 'Bitcoin',
    label: 'Case #2026-114 · LockBit Ransomware Extortion (BTC)'
  },
  {
    suspect: 'TXn82Kf9dPq3mZ7yLcR1vB8sN4hT6wA2fE',
    victim: 'TE45678901234567890123456789012345',
    chain: 'Tron',
    label: 'Case #2026-302 · Pig Butchering Scam Ring (TRX)'
  }
];

const STEPS = [
  'Ingesting on-chain block history for suspect & victim wallets',
  'Reconstructing cryptographic fund-flow graph',
  'Detecting intermediary money-mule & layering nodes',
  'Evaluating risk heuristics across on-chain threat models',
  'Attributing destination VASP exchange cluster'
];

export default function WalletInvestigationPage() {
  const {
    activeCase,
    analyzeWallet,
    runDemo,
    isAnalyzing,
    analysisStep,
    setActivePage
  } = useCase();

  const [inputAddress, setInputAddress] = useState('');
  const [victimAddress, setVictimAddress] = useState('');
  const [chain, setChain] = useState('Ethereum');
  const [fraudType, setFraudType] = useState('Investment Scam');

  const handleAnalyze = () => {
    analyzeWallet(inputAddress, chain, fraudType, victimAddress);
  };

  const handleFillExample = (ex) => {
    setInputAddress(ex.suspect);
    setVictimAddress(ex.victim);
    setChain(ex.chain);
  };

  const r = activeCase;

  return (
    <div style={{ padding: '24px 28px' }}>
      {/* Search Panel */}
      <div className="search-panel">
        <div className="search-title">Enter Suspect & Victim Wallet Addresses</div>
        <div className="search-sub">
          Enter both the suspect/scammer address and the victim’s reported origin address. CryptoTrace traces fund flows from Victim ➔ Suspect ➔ Intermediaries ➔ VASP Cashout.
        </div>

        {/* Both Addresses Row */}
        <div className="search-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '14px' }}>
          <div className="field">
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: 'var(--crit)', fontSize: '10px' }}>●</span>
              <span>Suspect Wallet Address (Target / Destination)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. 0x7a41f3c9b2e6d0a184f7c3b9e8a2d15f6c7e91f"
              value={inputAddress}
              onChange={(e) => setInputAddress(e.target.value)}
            />
          </div>

          <div className="field">
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: 'var(--info)', fontSize: '10px' }}>●</span>
              <span>Victim Wallet Address (Origin of Stolen Funds)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. 0x4b10293847561029384756102938475610293847 (optional)"
              value={victimAddress}
              onChange={(e) => setVictimAddress(e.target.value)}
            />
          </div>
        </div>

        {/* Chain & Typology Row */}
        <div className="search-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div className="field">
            <label>Blockchain Network</label>
            <select value={chain} onChange={(e) => setChain(e.target.value)}>
              <option>Ethereum</option>
              <option>Bitcoin</option>
              <option>Tron</option>
              <option>BNB Chain</option>
              <option>Polygon</option>
            </select>
          </div>

          <div className="field">
            <label>Fraud Typology</label>
            <select value={fraudType} onChange={(e) => setFraudType(e.target.value)}>
              <option>Investment Scam</option>
              <option>Task Scam</option>
              <option>Phishing</option>
              <option>Ransomware</option>
              <option>Sextortion</option>
              <option>Darknet</option>
              <option>Other</option>
            </select>
          </div>
        </div>

        <div className="search-actions">
          <button className="btn btn-primary" onClick={handleAnalyze} disabled={isAnalyzing}>
            {isAnalyzing ? 'Ingesting & Analyzing…' : 'Initiate Fund Flow Trace'}
          </button>
          <button className="btn btn-ghost" onClick={runDemo} disabled={isAnalyzing} title="Load verified federal cybercrime case">
            Load Benchmark Case
          </button>
          <span className="evidence-chip" style={{ background: 'rgba(62,217,163,0.08)', color: 'var(--accent)', borderColor: 'rgba(62,217,163,0.25)' }}>
            ● Validator RPC Active · Multi-Chain Ingestion Live
          </span>
        </div>

        <div className="example-addrs">
          <span style={{ fontSize: '12px', color: 'var(--text-dim)', alignSelf: 'center', marginRight: '6px' }}>
            Active Case Dossiers:
          </span>
          {EXAMPLE_WALLETS.map((ex, i) => (
            <span
              key={i}
              className="chip"
              onClick={() => handleFillExample(ex)}
            >
              {ex.label}
            </span>
          ))}
        </div>
      </div>

      {/* Analysis Result Area */}
      {isAnalyzing ? (
        <div className="panel loading-state">
          <div className="spinner"></div>
          <div style={{ fontSize: '14px', marginBottom: '16px', color: 'var(--text-dim)', fontWeight: 600 }}>
            Analyzing target wallet across blockchain nodes…
          </div>
          <div className="loading-steps">
            {STEPS.map((s, idx) => {
              const isDone = analysisStep > idx;
              const isCurrent = analysisStep === idx;
              return (
                <div key={idx} className={`loading-step ${isDone ? 'done' : ''}`} style={{ fontWeight: isCurrent ? 600 : 400 }}>
                  <span style={{ color: isDone ? 'var(--accent)' : 'var(--text-faint)' }}>
                    {isDone ? '●' : '○'}
                  </span>
                  {s}
                </div>
              );
            })}
          </div>
        </div>
      ) : r ? (
        <div>
          {/* Risk Hero */}
          <div className="panel" style={{ marginBottom: '18px' }}>
            <div className="risk-hero">
              <div
                className="risk-ring"
                style={{
                  background: `conic-gradient(${riskColor(r.level)} ${(r.score || 0) * 3.6}deg, var(--panel) 0deg)`
                }}
              >
                <div className="inner">
                  <span className="num" style={{ color: riskColor(r.level) }}>{r.score || 0}</span>
                  <span className="of">/ 100</span>
                </div>
              </div>

              <div className="risk-hero-info">
                <h3 className="mono">{r.address}</h3>
                <p>{r.chain} · {r.fraudType} · Case {r.caseId || r.id}</p>
                <div className="risk-hero-tags">
                  <span className={`badge ${riskBadgeClass(r.level)}`}>{r.level || 'Medium'} Risk</span>
                  <span className="badge badge-info">{r.txCount || 0} transactions</span>
                  <span className="badge badge-neutral">Confidence {r.confidence || 75}%</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button className="btn btn-ghost btn-sm" onClick={() => setActivePage('graph')}>
                  View Graph →
                </button>
                <button className="btn btn-ghost btn-sm" onClick={() => setActivePage('reports')}>
                  Generate Report →
                </button>
                <button
                  className="btn btn-ghost btn-sm"
                  style={{ color: 'var(--crit)', borderColor: 'rgba(243,80,107,0.3)' }}
                  onClick={() => setActivePage('alerts')}
                >
                  ▲ Add Risk Alert →
                </button>
              </div>
            </div>

            {/* Forensic Path Banner */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto 1fr auto 1fr',
              gap: '12px',
              alignItems: 'center',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid var(--border)',
              borderRadius: '10px',
              padding: '16px 20px',
              margin: '18px 0'
            }}>
              {/* Victim Column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--info)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>●</span> Victim Origin Wallet
                </div>
                <div className="mono" style={{ fontSize: '12.5px', color: 'var(--text)', wordBreak: 'break-all' }}>
                  {r.victimAddress || 'Unassigned / Auto-detected'}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
                  Inflow Source · Initial Loss
                </div>
              </div>

              {/* Arrow 1 */}
              <div style={{ textAlign: 'center', padding: '0 8px' }}>
                <div style={{ color: 'var(--crit)', fontSize: '16px', fontWeight: 700 }}>➔</div>
                <div style={{ fontSize: '10px', color: 'var(--crit)', fontWeight: 600 }}>STOLEN</div>
              </div>

              {/* Suspect Column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--crit)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>●</span> Suspect Target Wallet
                </div>
                <div className="mono" style={{ fontSize: '12.5px', color: 'var(--text)', wordBreak: 'break-all' }}>
                  {r.address}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--crit)', fontWeight: 600 }}>
                  Risk Score {r.score}/100 · {r.level}
                </div>
              </div>

              {/* Arrow 2 */}
              <div style={{ textAlign: 'center', padding: '0 8px' }}>
                <div style={{ color: 'var(--accent)', fontSize: '16px', fontWeight: 700 }}>➔</div>
                <div style={{ fontSize: '10px', color: 'var(--accent)', fontWeight: 600 }}>CASHOUT</div>
              </div>

              {/* VASP Column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>●</span> Suspected VASP Cluster
                </div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>
                  {r.exchange?.name || 'VASP Hot Wallet'}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
                  {r.exchange?.region || 'Offshore'} · {r.confidence || 75}% Confidence
                </div>
              </div>
            </div>

            {/* Key Value Grid */}
            <div className="kv-grid">
              <div className="kv-item">
                <div className="k">Suspect Wallet (Target)</div>
                <div className="v mono" style={{ fontSize: '12px' }}>{r.address}</div>
              </div>
              <div className="kv-item">
                <div className="k">Victim Wallet (Origin)</div>
                <div className="v mono" style={{ fontSize: '12px' }}>{r.victimAddress || 'Auto-detected'}</div>
              </div>
              <div className="kv-item">
                <div className="k">Blockchain Network</div>
                <div className="v">{r.chain}</div>
              </div>
              <div className="kv-item">
                <div className="k">Fraud Typology</div>
                <div className="v">{r.fraudType}</div>
              </div>
              <div className="kv-item">
                <div className="k">Total Received</div>
                <div className="v">{fmtUSD(r.totalReceived)}</div>
              </div>
              <div className="kv-item">
                <div className="k">Total Sent</div>
                <div className="v">{fmtUSD(r.totalSent)}</div>
              </div>
              <div className="kv-item">
                <div className="k">First Activity</div>
                <div className="v">{fmtDate(r.firstTx)}</div>
              </div>
              <div className="kv-item">
                <div className="k">Last Activity</div>
                <div className="v">{fmtDate(r.lastTx)}</div>
              </div>
              <div className="kv-item">
                <div className="k">Suspected VASP</div>
                <div className="v">{r.exchange?.name || 'VASP Cluster'} ({r.confidence || 75}% conf.)</div>
              </div>
            </div>
          </div>

          {/* Grid: Risk Factors & AI Findings */}
          <div className="grid-2">
            <div className="panel">
              <div className="panel-head">
                <div>
                  <h3>Risk Score Explanation</h3>
                  <div className="sub">Contributing factors identified for score of {r.score}</div>
                </div>
              </div>
              <div className="factor-list">
                {r.factors?.map((f, i) => (
                  <div key={i} className="factor">
                    <div className="fi" style={{ background: 'rgba(240,137,74,.12)', color: 'var(--high)' }}>!</div>
                    <div className="ft">{f.t}</div>
                    <div className="fw">{f.w}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="panel">
              <div className="panel-head">
                <div>
                  <h3>AI-Assisted Findings</h3>
                  <div className="sub">Algorithmic threat pattern classification</div>
                </div>
              </div>
              <div className="factor-list">
                {r.aiFindings?.map((f, i) => (
                  <div key={i} className="factor">
                    <div className="fi" style={{ background: 'rgba(78,143,224,.12)', color: 'var(--info)' }}>✦</div>
                    <div className="ft">{f.t}</div>
                    <div className="fw">{f.c}%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Intermediaries */}
          <div className="panel" style={{ marginTop: '18px' }}>
            <div className="panel-head">
              <div>
                <h3>Intermediary / Layering Wallets</h3>
                <div className="sub">
                  {r.intermediaries?.length
                    ? `${r.intermediaries.length} suspicious intermediary wallets detected in the fund path`
                    : 'None detected — direct or short fund path'}
                </div>
              </div>
            </div>

            {r.intermediaries && r.intermediaries.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Wallet</th>
                    <th>Role</th>
                    <th>Transactions</th>
                    <th>Amount</th>
                    <th>Risk</th>
                    <th>Detection Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {r.intermediaries.map((w, i) => (
                    <tr key={i}>
                      <td className="mono">{fmtAddr(w.address)}</td>
                      <td>{w.role}</td>
                      <td>{w.txCount}</td>
                      <td>{fmtUSD(w.amount)}</td>
                      <td><span className={`badge ${riskBadgeClass(w.risk)}`}>{w.risk || 'Medium'}</span></td>
                      <td>{w.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="empty-state" style={{ padding: '30px' }}>
                <p>Fund path is short enough that no intermediary layering was detected.</p>
              </div>
            )}
          </div>

          {/* Investigator Recommendations */}
          <div className="panel" style={{ marginTop: '18px' }}>
            <div className="panel-head">
              <div>
                <h3>Investigator Recommendations</h3>
                <div className="sub">Forensic intelligence guidance for law enforcement proceedings</div>
              </div>
            </div>
            <ul className="report-list">
              {r.recommendations?.map((rec, i) => (
                <li key={i}>{rec}</li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div className="empty-state">
          <div className="glyph">⌕</div>
          <h4>No active investigation</h4>
          <p>Enter suspect and victim addresses above or select a benchmark dossier to initiate forensic reconstruction.</p>
        </div>
      )}
    </div>
  );
}
