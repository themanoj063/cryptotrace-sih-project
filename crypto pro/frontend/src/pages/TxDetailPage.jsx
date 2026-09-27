import React from 'react';
import { useCase } from '../context/CaseContext';
import { fmtUSD, fmtDateTime } from '../utils/formatters';

export default function TxDetailPage() {
  const { selectedTx, activeCase, setActivePage } = useCase();
  const t = selectedTx;
  const r = activeCase;

  if (!t || !r) {
    return (
      <div style={{ padding: '24px 28px' }}>
        <button
          className="btn btn-ghost btn-sm"
          style={{ marginBottom: '14px' }}
          onClick={() => setActivePage('transactions')}
        >
          ← Back to Transactions
        </button>
        <div className="empty-state">
          <h4>No transaction selected</h4>
          <p>Please select a transaction from the ledger to view full cryptographic block evidence.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px 28px' }}>
      <button
        className="btn btn-ghost btn-sm"
        style={{ marginBottom: '16px', color: 'var(--info)' }}
        onClick={() => setActivePage('transactions')}
      >
        ← Back to Transactions Ledger
      </button>

      <div className="panel">
        <div className="panel-head">
          <div>
            <h3>Transaction Evidence Record</h3>
            <div className="sub">Case {r.caseId || r.id} · Immutable On-Chain Receipt</div>
          </div>
          <span className={`badge ${t.riskFlag ? 'badge-high' : 'badge-neutral'}`}>
            {t.status || 'Confirmed'}
          </span>
        </div>

        <div className="kv-grid">
          <div className="kv-item">
            <div className="k">Transaction Hash</div>
            <div className="v">{t.hash}</div>
          </div>
          <div className="kv-item">
            <div className="k">Block Height</div>
            <div className="v">{t.block}</div>
          </div>
          <div className="kv-item">
            <div className="k">Direction</div>
            <div className="v">
              <span className={t.direction === 'IN' ? 'dir-in' : 'dir-out'}>
                {t.direction === 'IN' ? 'Incoming to suspect wallet' : 'Outgoing from suspect wallet'}
              </span>
            </div>
          </div>
          <div className="kv-item">
            <div className="k">Cryptocurrency Asset</div>
            <div className="v">{t.asset}</div>
          </div>
          <div className="kv-item">
            <div className="k">Amount (USD Equivalent)</div>
            <div className="v">{fmtUSD(t.amountUsd)}</div>
          </div>
          <div className="kv-item">
            <div className="k">Timestamp</div>
            <div className="v">{fmtDateTime(t.timestamp)}</div>
          </div>
          <div className="kv-item">
            <div className="k">Target Suspect Wallet</div>
            <div className="v">{r.address}</div>
          </div>
          <div className="kv-item">
            <div className="k">Counterparty Address</div>
            <div className="v">{t.counterparty}</div>
          </div>
          <div className="kv-item">
            <div className="k">Counterparty Role</div>
            <div className="v">{t.counterpartyLabel || 'Unknown'}</div>
          </div>
          <div className="kv-item">
            <div className="k">Blockchain Network</div>
            <div className="v">{r.chain}</div>
          </div>
        </div>

        {t.riskFlag && (
          <div className="evidence-banner" style={{ marginTop: '16px' }}>
            🛡 EVIDENTIARY FLAG: This transaction directly triggered the target wallet's risk classification threshold.
          </div>
        )}

        <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
          <button className="btn btn-ghost btn-sm" onClick={() => setActivePage('graph')}>
            View in Fund Flow Graph →
          </button>
          <button className="btn btn-ghost btn-sm" onClick={() => setActivePage('counterparties')}>
            View Counterparty Profile →
          </button>
        </div>
      </div>
    </div>
  );
}
