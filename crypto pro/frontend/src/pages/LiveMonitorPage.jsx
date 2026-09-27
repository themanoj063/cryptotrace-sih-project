import React, { useState } from 'react';
import { useCase } from '../context/CaseContext';

export default function LiveMonitorPage() {
  const { liveEvents, cases } = useCase();
  const [filter, setFilter] = useState('ALL');

  const getSeverity = (ev) => {
    if (ev.c === 'var(--crit)') return 'CRITICAL';
    if (ev.c === 'var(--high)') return 'HIGH';
    if (ev.c === 'var(--warn)') return 'MEDIUM';
    return 'INFO';
  };

  const counts = { CRITICAL: 0, HIGH: 0, MEDIUM: 0, INFO: 0 };
  liveEvents.forEach((e) => {
    counts[getSeverity(e)]++;
  });

  const filtered = liveEvents.filter((e) => {
    if (filter === 'ALL') return true;
    return getSeverity(e) === filter;
  });

  return (
    <div style={{ padding: '24px 28px' }}>
      {/* Stats Row */}
      <div className="lm-stat-row">
        <div className="stat-card">
          <div className="val">{liveEvents.length}</div>
          <div className="lbl">Events Captured</div>
        </div>
        <div className="stat-card">
          <div className="val" style={{ color: 'var(--crit)' }}>{counts.CRITICAL}</div>
          <div className="lbl">Critical Incidents</div>
        </div>
        <div className="stat-card">
          <div className="val" style={{ color: 'var(--high)' }}>{counts.HIGH}</div>
          <div className="lbl">High Severity Events</div>
        </div>
        <div className="stat-card">
          <div className="val" style={{ color: 'var(--accent)' }}>{cases.length}</div>
          <div className="lbl">Active Case Wallets</div>
        </div>
      </div>

      {/* Main Stream */}
      <div className="panel">
        <div className="lm-toolbar">
          <div>
            <h3>Live Blockchain Event Stream</h3>
            <div className="sub">Real-time monitoring across Ethereum, Bitcoin, Tron, BNB Chain & Polygon</div>
          </div>

          <div className="lm-filters">
            {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'INFO'].map((f) => (
              <span
                key={f}
                className={`lm-filter ${filter === f ? 'active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f}
              </span>
            ))}
          </div>
        </div>

        <div className="lm-feed">
          {filtered.length > 0 ? (
            filtered.map((e, idx) => (
              <div key={idx} className="lm-item">
                <div className="lm-dot" style={{ background: e.c }}></div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 500 }}>{e.t}</div>
                  <div className="t">{e.time}</div>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state" style={{ padding: '40px' }}>
              <p>No events match the selected severity filter.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
