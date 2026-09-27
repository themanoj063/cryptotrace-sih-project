import React, { useState } from 'react';
import { useCase } from '../context/CaseContext';
import { fmtUSD, fmtAddr, fmtDate, riskBadgeClass } from '../utils/formatters';

export default function FundFlowGraphPage() {
  const { activeCase, setActivePage, addToast } = useCase();
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedNodeIdx, setSelectedNodeIdx] = useState(null);

  const r = activeCase;

  const handleZoom = (delta) => {
    setZoomLevel((prev) => Math.max(0.6, Math.min(1.6, prev + delta * 0.15)));
  };

  const nodeColor = (type) => {
    switch (type) {
      case 'victim': return '#4E8FE0';
      case 'suspect': return '#F3506B';
      case 'intermediary': return '#E8B94A';
      case 'exchange': return '#3ED9A3';
      default: return '#9AA6B5';
    }
  };

  if (!r) {
    return (
      <div style={{ padding: '24px 28px' }}>
        <div className="panel">
          <div className="panel-head">
            <div>
              <h3>Fund-Flow Transaction Graph</h3>
              <div className="sub">Run a wallet analysis to build the transaction graph</div>
            </div>
          </div>
          <div className="empty-state">
            <div className="glyph">⌘</div>
            <h4>No graph data available</h4>
            <p>Analyze a wallet from the Wallet Investigation page or load an active benchmark case dossier.</p>
          </div>
        </div>
      </div>
    );
  }

  // Construct node flow
  const nodes = [
    { type: 'victim', label: 'Victim Wallet', addr: r.victimAddress, tx: 1, amt: r.totalReceived, risk: '—' },
    { type: 'suspect', label: 'Suspect Wallet', addr: r.address, tx: r.txCount, amt: r.totalReceived, risk: r.level },
    ...(r.intermediaries || []).map((w, i) => ({
      type: 'intermediary',
      label: `Intermediary ${i + 1}`,
      addr: w.address,
      tx: w.txCount,
      amt: w.amount,
      risk: w.risk,
      role: w.role
    })),
    { type: 'exchange', label: 'Suspected VASP', addr: r.exchange?.name || 'Exchange Cluster', tx: r.txCount > 50 ? 12 : 4, amt: r.totalSent, risk: '—' }
  ];

  const activeNode = selectedNodeIdx !== null ? nodes[selectedNodeIdx] : null;

  return (
    <div style={{ padding: '24px 28px' }}>
      <div className="panel">
        <div className="panel-head">
          <div>
            <h3>Fund-Flow Transaction Graph</h3>
            <div className="sub">
              Case {r.caseId || r.id} · {r.chain} · Click any node to inspect on-chain entity details
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="graph-toolbar">
          <button className="btn btn-ghost btn-sm" onClick={() => handleZoom(1)}>＋ Zoom</button>
          <button className="btn btn-ghost btn-sm" onClick={() => handleZoom(-1)}>－ Zoom</button>
          <button className="btn btn-ghost btn-sm" onClick={() => { setZoomLevel(1); setSelectedNodeIdx(null); }}>
            ⟲ Reset View
          </button>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => addToast('Path fully expanded to VASP deposit clusters')}
          >
            ⤢ Expand Path
          </button>
        </div>

        {/* Graph Canvas */}
        <div className="graph-canvas">
          <div
            className="flow-path"
            style={{
              transform: `scale(${zoomLevel})`,
              transformOrigin: 'top left',
              transition: 'transform 0.15s ease'
            }}
          >
            {nodes.map((n, idx) => {
              const isSelected = selectedNodeIdx === idx;
              return (
                <React.Fragment key={idx}>
                  <div
                    className={`flow-box ${isSelected ? 'selected' : ''}`}
                    onClick={() => setSelectedNodeIdx(idx)}
                  >
                    <div className="type-tag" style={{ color: nodeColor(n.type) }}>
                      {n.label}
                    </div>
                    <div className="addr">
                      {n.type === 'exchange' ? n.addr : fmtAddr(n.addr)}
                    </div>
                    <span className={`badge ${n.risk !== '—' ? riskBadgeClass(n.risk) : 'badge-neutral'}`}>
                      {n.risk !== '—' ? `${n.risk} risk` : n.type === 'victim' ? 'Origin' : 'Cash-out point'}
                    </span>
                  </div>

                  {idx < nodes.length - 1 && (
                    <div className="flow-arrow">
                      <span className="amt">{fmtUSD(nodes[idx + 1].amt)}</span>
                      <svg viewBox="0 0 56 24">
                        <line x1="0" y1="12" x2="44" y2="12" stroke="#2C3644" strokeWidth="2" />
                        <polygon points="44,6 54,12 44,18" fill="#2C3644" />
                      </svg>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Selected Node Details Drawer */}
        {activeNode && (
          <div className="node-detail">
            <div className="panel-head">
              <h3>{activeNode.label} {activeNode.role ? `— ${activeNode.role}` : ''}</h3>
              <span className={`badge ${activeNode.risk !== '—' ? riskBadgeClass(activeNode.risk) : 'badge-neutral'}`}>
                {activeNode.risk !== '—' ? `${activeNode.risk} Risk` : 'Entity Node'}
              </span>
            </div>

            <div className="kv-grid">
              <div className="kv-item">
                <div className="k">Address / Identifier</div>
                <div className="v">{activeNode.addr}</div>
              </div>
              <div className="kv-item">
                <div className="k">Entity Classification</div>
                <div className="v">{activeNode.type.toUpperCase()}</div>
              </div>
              <div className="kv-item">
                <div className="k">Recorded Transactions</div>
                <div className="v">{activeNode.tx}</div>
              </div>
              <div className="kv-item">
                <div className="k">Amount Flow</div>
                <div className="v">{fmtUSD(activeNode.amt)}</div>
              </div>
              <div className="kv-item">
                <div className="k">First Observed</div>
                <div className="v">{fmtDate(r.firstTx)}</div>
              </div>
              <div className="kv-item">
                <div className="k">Last Observed</div>
                <div className="v">{fmtDate(r.lastTx)}</div>
              </div>
              <div className="kv-item">
                <div className="k">Relationship to Case</div>
                <div className="v">
                  {activeNode.type === 'suspect'
                    ? 'Primary Target Wallet'
                    : activeNode.type === 'victim'
                    ? 'Source Victim Account'
                    : activeNode.type === 'exchange'
                    ? 'Suspected Cash-Out Destination'
                    : 'Layering Intermediate Transit'}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '14px' }}>
              <button className="btn btn-ghost btn-sm" onClick={() => setActivePage('transactions')}>
                View Associated Transactions →
              </button>
              <button className="btn btn-ghost btn-sm" onClick={() => setActivePage('counterparties')}>
                View Counterparty Intelligence →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
