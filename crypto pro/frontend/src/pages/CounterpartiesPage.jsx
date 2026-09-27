import React from 'react';
import { useCase } from '../context/CaseContext';
import { fmtUSD, fmtDate, riskBadgeClass } from '../utils/formatters';

export default function CounterpartiesPage() {
  const { activeCase, setActivePage } = useCase();
  const r = activeCase;

  if (!r) {
    return (
      <div style={{ padding: '24px 28px' }}>
        <div className="panel">
          <div className="panel-head">
            <h3>Counterparty Analysis</h3>
            <div className="sub">Every address the suspect wallet transacted with</div>
          </div>
          <div className="empty-state">
            <div className="glyph">⌗</div>
            <h4>No counterparties available</h4>
            <p>Analyze a wallet to see everyone it transacted with on-chain.</p>
          </div>
        </div>
      </div>
    );
  }

  const counterparties = r.counterparties || [];

  return (
    <div style={{ padding: '24px 28px' }}>
      <div className="panel">
        <div className="panel-head">
          <div>
            <h3>Counterparty Analysis</h3>
            <div className="sub">
              Case {r.caseId || r.id} · Discovered entities transacting with target wallet
            </div>
          </div>
          <span className="badge badge-info">{counterparties.length} Discovered Entities</span>
        </div>

        {counterparties.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {counterparties.map((c, i) => (
              <div
                key={i}
                className="panel"
                style={{
                  background: 'var(--panel-2)',
                  border: '1px solid var(--border-soft)',
                  padding: '16px',
                  cursor: 'pointer'
                }}
                onClick={() => setActivePage('transactions')}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span className="mono" style={{ fontSize: '13.5px', fontWeight: 600 }}>
                    {c.address}
                  </span>
                  <span className={`badge ${riskBadgeClass(c.risk)}`}>
                    {c.risk || 'Medium'} Risk
                  </span>
                </div>

                <div style={{ fontSize: '12.5px', color: 'var(--text-dim)', marginBottom: '10px' }}>
                  {c.label || 'Unknown Counterparty'}
                </div>

                <div style={{ display: 'flex', gap: '22px', fontSize: '12px', color: 'var(--text-faint)', flexWrap: 'wrap' }}>
                  <span>Transactions: <b style={{ color: 'var(--text-dim)' }}>{c.txCount || 0}</b></span>
                  <span>Sent to wallet: <b style={{ color: 'var(--text-dim)' }}>{fmtUSD(c.totalOut)}</b></span>
                  <span>Received from wallet: <b style={{ color: 'var(--text-dim)' }}>{fmtUSD(c.totalIn)}</b></span>
                  <span>First Seen: <b style={{ color: 'var(--text-dim)' }}>{fmtDate(c.first)}</b></span>
                  <span>Last Seen: <b style={{ color: 'var(--text-dim)' }}>{fmtDate(c.last)}</b></span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state" style={{ padding: '30px' }}>
            <p>No counterparties identified.</p>
          </div>
        )}
      </div>
    </div>
  );
}
