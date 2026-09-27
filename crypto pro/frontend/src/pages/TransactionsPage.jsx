import React, { useState } from 'react';
import { useCase } from '../context/CaseContext';

export default function TransactionsPage() {
  const { activeCase, setSelectedTx, setActivePage } = useCase();
  const [searchTerm, setSearchTerm] = useState('');
  const [dirFilter, setDirFilter] = useState('');

  const r = activeCase;

  if (!r) {
    return (
      <div style={{ padding: '24px 28px' }}>
        <div className="panel">
          <div className="panel-head">
            <div>
              <h3>Transaction Evidence Ledger</h3>
              <div className="sub">Run a wallet analysis to populate transaction evidence</div>
            </div>
          </div>
          <div className="empty-state">
            <div className="glyph">≡</div>
            <h4>No transactions available</h4>
            <p>Analyze a wallet to see its full cryptographic transaction evidence list here.</p>
          </div>
        </div>
      </div>
    );
  }

  const txs = r.transactions || [];

  const filtered = txs.filter((t) => {
    if (dirFilter && t.direction !== dirFilter) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const hashMatch = t.hash?.toLowerCase().includes(q);
      const cpMatch = t.counterparty?.toLowerCase().includes(q);
      const labelMatch = t.counterpartyLabel?.toLowerCase().includes(q);
      if (!hashMatch && !cpMatch && !labelMatch) return false;
    }
    return true;
  });

  const fmtUSD = (n) => '$' + (n || 0).toLocaleString('en-US', { maximumFractionDigits: 0 });
  const fmtAddr = (a) => (a && a.length > 16 ? a.slice(0, 6) + '...' + a.slice(-4) : a || '');

  const handleRowClick = (t) => {
    setSelectedTx(t);
    setActivePage('txdetail');
  };

  return (
    <div style={{ padding: '24px 28px' }}>
      <div className="panel">
        <div className="panel-head">
          <div>
            <h3>Transaction Evidence Ledger</h3>
            <div className="sub">
              Case {r.caseId || r.id} · {fmtAddr(r.address)} · {r.chain} · Click any row to inspect immutable block evidence
            </div>
          </div>
          <span className="badge badge-info">Sampled {r.sampleSize || txs.length} of {r.txCount} On-Chain</span>
        </div>

        {/* Toolbar */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Search hash or counterparty…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '260px' }}
          />
          <select value={dirFilter} onChange={(e) => setDirFilter(e.target.value)} style={{ width: '160px' }}>
            <option value="">All directions</option>
            <option value="IN">Incoming (▼ IN)</option>
            <option value="OUT">Outgoing (▲ OUT)</option>
          </select>
        </div>

        {/* Table */}
        {filtered.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Hash</th>
                <th>Direction</th>
                <th>Counterparty</th>
                <th>Asset</th>
                <th>Amount</th>
                <th>Block</th>
                <th>Timestamp</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t, idx) => (
                <tr key={idx} className="tx-row" onClick={() => handleRowClick(t)}>
                  <td className="mono">{fmtAddr(t.hash)}</td>
                  <td>
                    <span className={t.direction === 'IN' ? 'dir-in' : 'dir-out'}>
                      {t.direction === 'IN' ? '▼ IN' : '▲ OUT'}
                    </span>
                  </td>
                  <td className="mono" title={t.counterparty}>{t.counterpartyLabel || fmtAddr(t.counterparty)}</td>
                  <td>{t.asset}</td>
                  <td style={{ fontWeight: 600 }}>{fmtUSD(t.amountUsd)}</td>
                  <td className="mono">{t.block}</td>
                  <td>{new Date(t.timestamp).toLocaleString()}</td>
                  <td>
                    <span className={`badge ${t.riskFlag ? 'badge-high' : 'badge-neutral'}`}>
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-state" style={{ padding: '30px' }}>
            <p>No transactions match this filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
