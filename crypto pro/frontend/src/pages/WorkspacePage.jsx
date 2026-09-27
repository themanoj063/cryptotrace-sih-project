import React, { useState } from 'react';
import { useCase } from '../context/CaseContext';

export default function WorkspacePage() {
  const { activeCase, setActivePage } = useCase();
  const [activeTab, setActiveTab] = useState('overview');

  const r = activeCase;

  if (!r) {
    return (
      <div style={{ padding: '24px 28px' }}>
        <div className="empty-state">
          <div className="glyph">🗂</div>
          <h4>No active investigation selected</h4>
          <p>Start an investigation or select a case from the Dashboard to open its workspace.</p>
          <div style={{ marginTop: '16px' }}>
            <button className="btn btn-primary btn-sm" onClick={() => setActivePage('wallet')}>
              Start Investigation →
            </button>
          </div>
        </div>
      </div>
    );
  }

  const fmtUSD = (n) => '$' + (n || 0).toLocaleString('en-US', { maximumFractionDigits: 0 });
  const fmtAddr = (a) => (a && a.length > 16 ? a.slice(0, 6) + '...' + a.slice(-4) : a || '');

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'timeline', label: 'Timeline & Events' },
    { id: 'counterparties', label: `Counterparties (${r.counterparties?.length || 0})` },
    { id: 'intermediaries', label: `Layering Wallets (${r.intermediaries?.length || 0})` },
    { id: 'recommendations', label: 'Recommendations' }
  ];

  return (
    <div style={{ padding: '24px 28px' }}>
      {/* Workspace Header */}
      <div className="ws-header">
        <div>
          <h2 className="mono">
            {r.address}{' '}
            <span style={{ fontFamily: 'var(--sans)', fontWeight: 600, fontSize: '13px', color: 'var(--text-faint)' }}>
              · {r.chain}
            </span>
          </h2>
          <div className="sub">
            Case <b>{r.caseId || r.id}</b> · {r.fraudType} ·{' '}
            <span className={`badge badge-${r.level.toLowerCase()}`}>{r.level} Risk ({r.score}/100)</span>
          </div>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={() => setActivePage('reports')}>
          Open Court Report →
        </button>
      </div>

      {/* Tabs */}
      <div className="ws-tabs">
        {tabs.map((t) => (
          <div
            key={t.id}
            className={`ws-tab ${activeTab === t.id ? 'active' : ''}`}
            onClick={() => setActiveTab(t.id)}
          >
            {t.label}
          </div>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div>
          <div className="kv-grid" style={{ marginBottom: '18px' }}>
            <div className="kv-item">
              <div className="k">Target Wallet</div>
              <div className="v">{r.address}</div>
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
              <div className="k">Recorded On-Chain Transactions</div>
              <div className="v">{r.txCount}</div>
            </div>
            <div className="kv-item">
              <div className="k">First Observed</div>
              <div className="v">{new Date(r.firstTx).toDateString()}</div>
            </div>
            <div className="kv-item">
              <div className="k">Last Observed</div>
              <div className="v">{new Date(r.lastTx).toDateString()}</div>
            </div>
            <div className="kv-item">
              <div className="k">Attributed VASP</div>
              <div className="v">{r.exchange?.name}</div>
            </div>
            <div className="kv-item">
              <div className="k">Cluster ID</div>
              <div className="v">{r.exchange?.clusterId || 'EX-1180'}</div>
            </div>
          </div>

          <div className="grid-2">
            <div className="panel">
              <div className="panel-head">
                <h3>Quick Navigation</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button className="btn btn-ghost btn-sm" style={{ justifyContent: 'flex-start' }} onClick={() => setActivePage('graph')}>
                  ⌘ Open Interactive Fund Flow Graph
                </button>
                <button className="btn btn-ghost btn-sm" style={{ justifyContent: 'flex-start' }} onClick={() => setActivePage('transactions')}>
                  ≡ View Complete Transaction Evidence Ledger
                </button>
                <button className="btn btn-ghost btn-sm" style={{ justifyContent: 'flex-start' }} onClick={() => setActivePage('vasp')}>
                  ◎ Inspect VASP Cluster Attribution & Intelligence
                </button>
                <button className="btn btn-ghost btn-sm" style={{ justifyContent: 'flex-start' }} onClick={() => setActivePage('crosschain')}>
                  ⇄ View Cross-Chain Bridge Routes
                </button>
              </div>
            </div>

            <div className="panel">
              <div className="panel-head">
                <h3>AI Typology Verdict</h3>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-dim)', lineHeight: 1.6 }}>
                The target wallet displays behavior indicative of high-frequency layering commonly associated with <b>{r.fraudType}</b> schemes. Fund structuring is observed before depositing to <b>{r.exchange?.name}</b> with an attribution confidence of <b>{r.confidence}%</b>.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'timeline' && (
        <div className="panel">
          <div className="panel-head">
            <h3>Chronological Investigation Timeline</h3>
          </div>
          <ul className="report-list">
            <li>{new Date(r.firstTx).toDateString()} — Initial activity observed on target suspect address.</li>
            <li>Inflow received from victim address: {fmtAddr(r.victimAddress)} ({fmtUSD(r.totalReceived)}).</li>
            <li>Funds routed across {r.intermediaries?.length || 0} intermediary layering node(s).</li>
            <li>
              {r.crossChain?.length
                ? `${r.crossChain.length} cross-chain bridge hop(s) detected across chains.`
                : 'Transactions remained native to ' + r.chain + ' network.'}
            </li>
            <li>Deposit traced to suspected exchange cluster: {r.exchange?.name} ({r.confidence}% confidence).</li>
            <li>{new Date(r.lastTx).toDateString()} — Latest transaction activity logged in evidence ledger.</li>
          </ul>
        </div>
      )}

      {activeTab === 'counterparties' && (
        <div className="panel">
          <div className="panel-head">
            <h3>Counterparty Profiles</h3>
            <span className="badge badge-neutral">{r.counterparties?.length || 0} Entities</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {r.counterparties?.map((c, i) => (
              <div key={i} className="panel" style={{ background: 'var(--panel-2)', padding: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span className="mono" style={{ fontSize: '13px', fontWeight: 600 }}>{c.address}</span>
                  <span className={`badge badge-${c.risk.toLowerCase()}`}>{c.risk} Risk</span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-dim)', marginBottom: '8px' }}>{c.label}</div>
                <div style={{ display: 'flex', gap: '18px', fontSize: '11.5px', color: 'var(--text-faint)' }}>
                  <span>Transactions: <b style={{ color: 'var(--text)' }}>{c.txCount}</b></span>
                  <span>Received: <b style={{ color: 'var(--text)' }}>{fmtUSD(c.totalIn)}</b></span>
                  <span>Sent: <b style={{ color: 'var(--text)' }}>{fmtUSD(c.totalOut)}</b></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'intermediaries' && (
        <div className="panel">
          <div className="panel-head">
            <h3>Intermediary Layering Wallets</h3>
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
                    <td><span className={`badge badge-${w.risk.toLowerCase()}`}>{w.risk}</span></td>
                    <td>{w.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state">
              <p>No intermediary hops detected.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'recommendations' && (
        <div className="panel">
          <div className="panel-head">
            <h3>Law Enforcement Guidance</h3>
          </div>
          <ul className="report-list">
            {r.recommendations?.map((rec, i) => (
              <li key={i}>{rec}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
