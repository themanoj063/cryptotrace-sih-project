import React from 'react';
import { useCase } from '../context/CaseContext';
import { fmtUSD, fmtDate, riskBadgeClass } from '../utils/formatters';

const CHAIN_COLORS = {
  Ethereum: '#4E8FE0',
  Bitcoin: '#E8B94A',
  Tron: '#F3506B',
  'BNB Chain': '#E8B94A',
  Polygon: '#8A6EF0'
};

export default function CrossChainPage() {
  const { activeCase } = useCase();
  const r = activeCase;

  if (!r) {
    return (
      <div style={{ padding: '24px 28px' }}>
        <div className="panel">
          <div className="panel-head">
            <h3>Cross-Chain Fund Movement</h3>
            <div className="sub">Run a wallet analysis to inspect cross-chain bridging</div>
          </div>
          <div className="empty-state">
            <div className="glyph">⇄</div>
            <h4>No cross-chain data</h4>
            <p>Run a wallet analysis first — cross-chain hops for that case will appear here.</p>
          </div>
        </div>
      </div>
    );
  }

  const hops = r.crossChain || [];

  return (
    <div style={{ padding: '24px 28px' }}>
      <div className="panel">
        <div className="panel-head">
          <div>
            <h3>Cross-Chain Fund Movement</h3>
            <div className="sub">Case {r.caseId || r.id} · Bridge traversal tracking across networks</div>
          </div>
          <span className="badge badge-info">{hops.length} Bridge Hop(s)</span>
        </div>

        {hops.length > 0 ? (
          <div>
            <div className="evidence-banner">
              🛡 EVIDENTIARY AUDIT TRAIL — Cross-chain bridge telemetry confirms asset hopping across liquidity pools to obfuscate transaction provenance.
            </div>

            {/* Visual Route Flow */}
            <div className="flow-path" style={{ marginBottom: '22px' }}>
              <div className="flow-box" style={{ cursor: 'default' }}>
                <div className="type-tag" style={{ color: CHAIN_COLORS[r.chain] || 'var(--accent)' }}>
                  Origin Chain
                </div>
                <div className="addr">{r.chain}</div>
                <span className="badge badge-neutral">Native Source</span>
              </div>

              {hops.map((h, i) => (
                <React.Fragment key={i}>
                  <div className="flow-arrow">
                    <span className="amt">{fmtUSD(h.amount)}</span>
                    <svg viewBox="0 0 56 24">
                      <line x1="0" y1="12" x2="44" y2="12" stroke="#2C3644" strokeWidth="2" />
                      <polygon points="44,6 54,12 44,18" fill="#2C3644" />
                    </svg>
                  </div>

                  <div className="flow-box" style={{ cursor: 'default' }}>
                    <div className="type-tag" style={{ color: CHAIN_COLORS[h.to] || 'var(--info)' }}>
                      {i === hops.length - 1 ? 'Final Chain' : `Hop ${i + 1}`}
                    </div>
                    <div className="addr">{h.to}</div>
                    <span className="badge badge-neutral">{h.bridge}</span>
                  </div>
                </React.Fragment>
              ))}
            </div>

            {/* Table */}
            <table>
              <thead>
                <tr>
                  <th>Source Chain</th>
                  <th>Destination Chain</th>
                  <th>Bridge / Relay Protocol</th>
                  <th>Amount</th>
                  <th>Tx Reference</th>
                  <th>Timestamp</th>
                  <th>Risk Level</th>
                </tr>
              </thead>
              <tbody>
                {hops.map((h, i) => (
                  <tr key={i}>
                    <td>{h.from}</td>
                    <td><b>{h.to}</b></td>
                    <td>{h.bridge}</td>
                    <td style={{ fontWeight: 600 }}>{fmtUSD(h.amount)}</td>
                    <td className="mono">{h.hash}</td>
                    <td>{fmtDate(h.time)}</td>
                    <td>
                      <span className={`badge ${riskBadgeClass(h.risk)}`}>
                        {h.risk || 'Medium'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state" style={{ padding: '40px' }}>
            <h4>No cross-chain hops detected</h4>
            <p>Funds stayed entirely on the {r.chain} network for this investigation.</p>
          </div>
        )}
      </div>
    </div>
  );
}
