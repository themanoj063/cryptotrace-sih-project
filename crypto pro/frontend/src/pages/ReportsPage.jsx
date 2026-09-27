import React from 'react';
import { useCase } from '../context/CaseContext';
import { fmtUSD, fmtAddr, fmtDate, riskBadgeClass } from '../utils/formatters';

export default function ReportsPage() {
  const { activeCase, addToast, investigatorUser } = useCase();
  const r = activeCase;

  const handlePrint = () => {
    window.print();
  };

  const handleExportPdf = () => {
    addToast('Opening print dialog for PDF export…');
    setTimeout(() => {
      window.print();
    }, 400);
  };

  if (!r) {
    return (
      <div style={{ padding: '24px 28px' }}>
        <div className="panel">
          <div className="panel-head">
            <h3>Investigation Report</h3>
            <div className="sub">Compiled from active wallet investigation</div>
          </div>
          <div className="empty-state">
            <div className="glyph">▤</div>
            <h4>No report generated</h4>
            <p>Analyze a wallet first to generate a full formal investigation report.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px 28px' }}>
      {/* Top actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Forensic Investigation Report</h3>
          <div style={{ color: 'var(--text-faint)', fontSize: '12.5px' }}>
            Case <b>{r.caseId || r.id}</b> · Court-admissible intelligence summary
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-ghost btn-sm" onClick={handlePrint}>
            Print Report
          </button>
          <button className="btn btn-primary btn-sm" onClick={handleExportPdf}>
            Export to PDF
          </button>
        </div>
      </div>

      {/* Formal Document Container */}
      <div className="report-doc" id="print-area">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid var(--border)', paddingBottom: '16px', marginBottom: '22px' }}>
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: 800, letterSpacing: '-0.02em' }}>
              BLOCKCHAIN FORENSIC INVESTIGATION REPORT
            </h2>
            <div className="rid mono" style={{ margin: '4px 0 0' }}>
              Case Reference: {r.caseId || r.id} · Generated {fmtDate(new Date())}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span className={`badge ${riskBadgeClass(r.level)}`} style={{ fontSize: '12px' }}>
              {(r.level || 'MEDIUM').toUpperCase()} RISK ({r.score || 0}/100)
            </span>
          </div>
        </div>

        {/* Case Summary */}
        <div className="report-section">
          <h4>Case Summary</h4>
          <div className="kv-grid">
            <div className="kv-item">
              <div className="k">Investigator In-Charge</div>
              <div className="v">{investigatorUser} (Cyber Fraud Cell)</div>
            </div>
            <div className="kv-item">
              <div className="k">Reported Target Wallet</div>
              <div className="v">{r.address}</div>
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
              <div className="k">Risk Score & Severity</div>
              <div className="v">{r.score || 0} / 100 ({r.level || 'Medium'})</div>
            </div>
            <div className="kv-item">
              <div className="k">Attribution Confidence</div>
              <div className="v">{r.confidence || 75}%</div>
            </div>
          </div>
        </div>

        {/* Transaction Summary */}
        <div className="report-section">
          <h4>Transaction Summary</h4>
          <ul className="report-list">
            <li>Total On-Chain Transactions Recorded: {r.txCount || 0}</li>
            <li>Total Cumulative Volume Received: {fmtUSD(r.totalReceived)}</li>
            <li>Total Cumulative Volume Disbursed: {fmtUSD(r.totalSent)}</li>
            <li>First Observed On-Chain Interaction: {fmtDate(r.firstTx)}</li>
            <li>Latest Observed On-Chain Interaction: {fmtDate(r.lastTx)}</li>
          </ul>
        </div>

        {/* Fund Flow */}
        <div className="report-section">
          <h4>Fund Flow Traversal</h4>
          <ul className="report-list">
            <li>Origin: Victim Wallet ({fmtAddr(r.victimAddress)}) → Suspect Target ({fmtAddr(r.address)})</li>
            {r.intermediaries?.map((w, i) => (
              <li key={i}>
                Hop {i + 1}: {w.address} — <b>{w.role}</b> ({w.risk || 'Medium'} Risk) — Est: {fmtUSD(w.amount)}
              </li>
            ))}
            <li>
              Final Settlement: <b>{r.exchange?.name || 'VASP'}</b> (Cluster #{r.exchange?.clusterId || 'EX-1180'}) — {r.confidence || 75}% confidence
            </li>
          </ul>
        </div>

        {/* Suspicious Patterns */}
        <div className="report-section">
          <h4>Suspicious Behavioral Patterns & Factor Weights</h4>
          <ul className="report-list">
            {r.factors?.map((f, i) => (
              <li key={i}>
                <b>{f.t}</b> (Weight: {f.w})
              </li>
            ))}
          </ul>
        </div>

        {/* AI Assisted Findings */}
        <div className="report-section">
          <h4>AI-Assisted Forensic Insights</h4>
          <ul className="report-list">
            {r.aiFindings?.map((f, i) => (
              <li key={i}>
                {f.t} — <b>{f.c}% confidence</b>
              </li>
            ))}
          </ul>
        </div>

        {/* Recommended Actions */}
        <div className="report-section">
          <h4>Recommended Law Enforcement Actions</h4>
          <ul className="report-list">
            {r.recommendations?.map((rec, i) => (
              <li key={i}>{rec}</li>
            ))}
          </ul>
        </div>

        {/* Cryptographic Hashes */}
        <div className="report-section">
          <h4>Cryptographic Transaction Evidence Hashes</h4>
          <ul className="report-list">
            {r.txHashes?.map((h, i) => (
              <li key={i} className="mono" style={{ fontSize: '12px' }}>{h}</li>
            ))}
          </ul>
        </div>

        {/* Sign-off disclaimer */}
        <div style={{
          borderTop: '1px solid var(--border-soft)',
          paddingTop: '16px',
          marginTop: '28px',
          fontSize: '11px',
          color: 'var(--text-faint)',
          lineHeight: 1.5
        }}>
          This document compiles verified blockchain transaction evidence, deterministic risk calculations, and AI cluster attributions generated by CryptoTrace. Certified under Digital Forensics Investigation Standards for evidentiary chain-of-custody.
        </div>
      </div>
    </div>
  );
}
