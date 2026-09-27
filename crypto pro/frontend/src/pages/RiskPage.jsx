import React from 'react';
import { useCase } from '../context/CaseContext';
import { riskColor, riskBadgeClass } from '../utils/formatters';

const FACTOR_CATALOGUE = [
  { t: 'Interaction with a previously flagged suspicious wallet', w: '+18' },
  { t: 'High-frequency transfers within a short window', w: '+12' },
  { t: 'Rapid fund movement (in-and-out under 10 minutes)', w: '+15' },
  { t: 'Layering through 2+ intermediary wallets', w: '+14' },
  { t: 'Interaction with a known mixer/tumbler service', w: '+22' },
  { t: 'Cross-chain bridge activity to obscure origin', w: '+10' },
  { t: 'Transfer to a known exchange deposit cluster', w: '+9' },
  { t: 'Unusual transaction size / round-number pattern', w: '+6' }
];

export default function RiskPage() {
  const { activeCase } = useCase();
  const r = activeCase;

  if (!r) {
    return (
      <div style={{ padding: '24px 28px' }}>
        <div className="panel">
          <div className="panel-head">
            <h3>Explainable Risk Analysis</h3>
            <div className="sub">Deterministic scoring for target wallet</div>
          </div>
          <div className="empty-state">
            <div className="glyph">◆</div>
            <h4>No risk analysis available</h4>
            <p>Analyze a target wallet to see its explainable risk score and weighted factor breakdown.</p>
          </div>
        </div>
      </div>
    );
  }

  const activeFactorTexts = new Set(r.factors?.map((f) => f.t) || []);

  return (
    <div style={{ padding: '24px 28px' }}>
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
            <p>{r.chain} · Case {r.caseId || r.id} · Evaluated by Automated Forensic Threat Matrix</p>
            <div className="risk-hero-tags">
              <span className={`badge ${riskBadgeClass(r.level)}`}>{r.level || 'Medium'} Risk</span>
              <span className="badge badge-neutral">{r.factors?.length || 0} Contributing Indicators</span>
              <span className="badge badge-info">Evidentiary Standard: FATF / OFAC</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid-2">
        {/* Indicators for this case */}
        <div className="panel">
          <div className="panel-head">
            <div>
              <h3>Active Risk Indicators (Evidence-Based)</h3>
              <div className="sub">Weighted and summed to produce the composite score</div>
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

        {/* AI Findings */}
        <div className="panel">
          <div className="panel-head">
            <div>
              <h3>AI-Assisted Findings</h3>
              <div className="sub">Behavioral signature matching</div>
            </div>
          </div>
          <div className="factor-list">
            {r.aiFindings?.map((f, i) => (
              <div key={i} className="factor">
                <div className="fi" style={{ background: 'rgba(78,143,224,.12)', color: 'var(--info)' }}>✦</div>
                <div className="ft">{f.t}</div>
                <div className="fw">{f.c}% Conf.</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Catalogue Reference */}
      <div className="panel" style={{ marginTop: '18px' }}>
        <div className="panel-head">
          <div>
            <h3>Risk Factor Reference Catalogue</h3>
            <div className="sub">Full spectrum of indicators evaluated on every target wallet</div>
          </div>
        </div>

        <div className="factor-list">
          {FACTOR_CATALOGUE.map((f, i) => {
            const isMatched = activeFactorTexts.has(f.t);
            return (
              <div key={i} className="factor" style={{ opacity: isMatched ? 1 : 0.65 }}>
                <div
                  className="fi"
                  style={{
                    background: isMatched ? 'rgba(62,217,163,.15)' : 'var(--panel)',
                    color: isMatched ? 'var(--accent)' : 'var(--text-faint)'
                  }}
                >
                  {isMatched ? '✓' : '·'}
                </div>
                <div className="ft" style={{ fontWeight: isMatched ? 600 : 400 }}>
                  {f.t}
                </div>
                <div className="fw">{f.w}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
