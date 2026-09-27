import React from 'react';
import { useCase } from '../context/CaseContext';
import { riskBadgeClass } from '../utils/formatters';

export default function DashboardPage() {
  const { stats, cases, liveEvents, setActivePage, setActiveCase } = useCase();

  const cardsData = [
    { ic: '⌕', color: 'var(--info)', val: stats?.walletsAnalyzed?.toLocaleString() || '2,847', lbl: 'Wallets Analyzed', delta: '+14 this session' },
    { ic: '▲', color: 'var(--crit)', val: stats?.highCriticalRisk || '412', lbl: 'High / Critical Risk', delta: 'live alerts' },
    { ic: '◎', color: 'var(--accent)', val: stats?.suspectedExchanges || '96', lbl: 'Suspected Exchanges', delta: '+3 this week' },
    { ic: '⌘', color: 'var(--warn)', val: stats?.activeInvestigations || '58', lbl: 'Active Investigations', delta: 'Vault Synced' },
    { ic: '⇄', color: 'var(--info)', val: stats?.crossChainTx || '214', lbl: 'Cross-Chain Transactions', delta: '+11 today' },
    { ic: '◧', color: 'var(--accent)', val: stats?.totalFundsTraced || '$18.4M', lbl: 'Total Funds Traced', delta: 'cumulative' }
  ];

  const riskDist = [
    { l: 'Low', v: 38, c: 'var(--accent)' },
    { l: 'Medium', v: 29, c: 'var(--warn)' },
    { l: 'High', v: 21, c: 'var(--high)' },
    { l: 'Critical', v: 12, c: 'var(--crit)' }
  ];

  const chainActivity = [
    { l: 'Ethereum', v: 64, c: '#4E8FE0' },
    { l: 'Tron', v: 52, c: '#F3506B' },
    { l: 'BNB Chain', v: 41, c: '#E8B94A' },
    { l: 'Bitcoin', v: 35, c: '#E8B94A' },
    { l: 'Polygon', v: 22, c: '#8A6EF0' }
  ];

  const handleSelectCase = (c) => {
    setActiveCase(c);
    setActivePage('workspace');
  };

  return (
    <div style={{ padding: '24px 28px' }}>
      {/* 6 Metric Cards */}
      <div className="cards-row">
        {cardsData.map((c, i) => (
          <div key={i} className="stat-card">
            <div className="top">
              <div className="ic" style={{ background: `${c.color}22`, color: c.color }}>
                {c.ic}
              </div>
            </div>
            <div className="val">{c.val}</div>
            <div className="lbl">{c.lbl}</div>
            <div className="delta">{c.delta}</div>
          </div>
        ))}
      </div>

      {/* Grid 1: Recent Cases & Live Ticker */}
      <div className="grid-2">
        {/* Recent Investigations */}
        <div className="panel">
          <div className="panel-head">
            <div>
              <h3>Recent Investigations</h3>
              <div className="sub">Latest wallet records secured in evidence vault</div>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => setActivePage('wallet')}>
              + New Investigation
            </button>
          </div>

          <table>
            <thead>
              <tr>
                <th>Wallet</th>
                <th>Chain</th>
                <th>Fraud Type</th>
                <th>Risk</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {cases && cases.length > 0 ? (
                cases.slice(0, 6).map((c) => (
                  <tr key={c.caseId || c.address} className="tx-row" onClick={() => handleSelectCase(c)}>
                    <td className="mono">{c.address.slice(0, 6)}...{c.address.slice(-4)}</td>
                    <td>{c.chain}</td>
                    <td>{c.fraudType}</td>
                    <td>
                      <span className={`badge ${riskBadgeClass(c.level)}`}>
                        {c.level || 'Medium'}
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-info">Case {c.caseId || c.id}</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '36px', color: 'var(--text-faint)' }}>
                    No investigations yet — submit a wallet or load an active benchmark case.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Live Blockchain Monitoring Ticker */}
        <div className="panel">
          <div className="panel-head">
            <div>
              <h3>Live Blockchain Ticker</h3>
              <div className="sub">Real-time surveillance event stream</div>
            </div>
            <span className="live-pill"><span className="pulse"></span> Active Stream</span>
          </div>

          <div className="ticker">
            {liveEvents.map((ev, i) => (
              <div key={i} className="ticker-item">
                <div className="ticker-dot" style={{ background: ev.c }}></div>
                <div style={{ flex: 1 }}>
                  <div>{ev.t}</div>
                  <div className="t">{ev.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grid 2: Risk Distribution & Chain Activity */}
      <div className="grid-2" style={{ marginTop: '20px' }}>
        <div className="panel">
          <div className="panel-head">
            <div>
              <h3>Risk Distribution</h3>
              <div className="sub">Wallets evaluated this cycle by risk severity</div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {riskDist.map((d, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '13px' }}>
                <div style={{ width: '64px', color: 'var(--text-dim)', fontWeight: 500 }}>{d.l}</div>
                <div style={{ flex: 1, height: '8px', background: 'var(--panel-2)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${d.v}%`, height: '100%', background: d.c, borderRadius: '4px' }}></div>
                </div>
                <div style={{ width: '40px', textAlign: 'right', fontFamily: 'var(--mono)', fontSize: '12px' }}>{d.v}%</div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="panel-head">
            <div>
              <h3>Chain Activity</h3>
              <div className="sub">Suspicious volume index by blockchain</div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {chainActivity.map((d, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '13px' }}>
                <div style={{ width: '80px', color: 'var(--text-dim)', fontWeight: 500 }}>{d.l}</div>
                <div style={{ flex: 1, height: '8px', background: 'var(--panel-2)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${d.v}%`, height: '100%', background: d.c, borderRadius: '4px' }}></div>
                </div>
                <div style={{ width: '40px', textAlign: 'right', fontFamily: 'var(--mono)', fontSize: '12px' }}>{d.v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
