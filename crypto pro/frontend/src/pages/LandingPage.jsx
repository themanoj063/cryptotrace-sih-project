import React, { useState } from 'react';
import { useCase } from '../context/CaseContext';

const FEATURES = [
  { ic: '⌕', c: 'var(--info)', h: 'Real-Time Wallet Analysis', p: 'Submit any wallet address and get risk scoring, transaction history, and typology classification in seconds.' },
  { ic: '⌘', c: 'var(--accent)', h: 'Fund-Flow Visualization', p: 'An interactive graph traces victim → suspect → intermediary → exchange, with drill-down on every node.' },
  { ic: '◎', c: 'var(--warn)', h: 'VASP Attribution', p: 'Confidence-scored attribution links suspect wallets to the exchange cluster most likely to hold cash-out funds.' },
  { ic: '⇄', c: 'var(--info)', h: 'Cross-Chain Intelligence', p: 'Follows funds as they bridge between Ethereum, BNB Chain, Tron, Bitcoin, and Polygon.' },
  { ic: '✦', c: 'var(--accent)', h: 'AI-Assisted Risk Detection', p: 'Pattern-matching highlights layering, mixer use, and rapid forwarding powered by automated cyber threat intelligence.' },
  { ic: '▤', c: 'var(--warn)', h: 'Investigation Reports', p: 'One click compiles a complete, court-ready evidence report ready to print or export to PDF.' }
];

const HOW_STEPS = [
  { n: '01', h: 'Victim reports wallet', p: 'Investigator submits the suspect address reported in the cyber fraud complaint.' },
  { n: '02', h: 'Data ingestion & graph build', p: 'Transaction history is ingested and the fund-flow graph is reconstructed automatically.' },
  { n: '03', h: 'Intermediary & VASP detection', p: 'Layering wallets are flagged and the likely cash-out exchange cluster is attributed.' },
  { n: '04', h: 'Risk scoring & report', p: 'A risk score, alerts, and court-ready forensic reports are compiled into an immutable evidence dossier.' }
];

const SUPPORTED_CHAINS = [
  {
    name: 'Ethereum',
    symbol: 'ETH',
    color: '#4E8FE0',
    rpc: 'Node #19,842,091',
    speed: '12s block',
    type: 'ERC-20 & Smart Contracts',
    bridges: 'Arbitrum, Optimism, Base, Stargate',
    surveillance: 'DEX wash trading & Tornado.Cash tracing'
  },
  {
    name: 'Bitcoin',
    symbol: 'BTC',
    color: '#F7931A',
    rpc: 'Node #835,119',
    speed: '10m block',
    type: 'UTXO Ledger Architecture',
    bridges: 'Lightning Network & Wrapped BTC',
    surveillance: 'Wasabi CoinJoin & peel chain analysis'
  },
  {
    name: 'TRON',
    symbol: 'TRX',
    color: '#EF0027',
    rpc: 'Node #59,841,202',
    speed: '3s block',
    type: 'TRC-20 High-Speed Tether',
    bridges: 'SunSwap & Cross-Chain Bridges',
    surveillance: 'Pig butchering scams & OTC cashout'
  },
  {
    name: 'BNB Chain',
    symbol: 'BNB',
    color: '#F3BA2F',
    rpc: 'Node #37,109,420',
    speed: '3s block',
    type: 'BEP-20 & EVM Compatible',
    bridges: 'Binance Bridge & Celer Network',
    surveillance: 'Flash-loan attacks & rapid liquidity drain'
  },
  {
    name: 'Polygon',
    symbol: 'POL',
    color: '#8247E5',
    rpc: 'Node #54,912,830',
    speed: '2.1s block',
    type: 'PoS Sidechain & Plasma',
    bridges: 'Polygon PoS & Wormhole',
    surveillance: 'High-frequency micro-layering hops'
  }
];

export default function LandingPage() {
  const { setActivePage, runDemo, isLoggedIn, investigatorUser } = useCase();
  const [showDocs, setShowDocs] = useState(false);
  const [activeDocTab, setActiveDocTab] = useState('sop');
  const [activeNav, setActiveNav] = useState('');

  const scrollToSection = (id) => {
    setActiveNav(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(1100px 480px at 82% -8%, rgba(78,143,224,0.14), transparent 60%), radial-gradient(900px 460px at -6% 10%, rgba(62,217,163,0.10), transparent 55%), var(--bg)',
      color: 'var(--text)'
    }}>
      {/* Navigation */}
      <nav style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '24px 56px',
        maxWidth: '1320px',
        margin: '0 auto',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backdropFilter: 'blur(12px)',
        background: 'rgba(7, 12, 20, 0.85)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
      }}>
        <div
          style={{ display: 'flex', alignItems: 'center', gap: '11px', fontWeight: 800, fontSize: '18px', cursor: 'pointer' }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, var(--accent), var(--info))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#04110C',
            fontSize: '15px',
            fontWeight: 800
          }}>C</div>
          CryptoTrace
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            type="button"
            className={`landing-nav-link ${activeNav === 'platform' ? 'active' : ''}`}
            onClick={() => scrollToSection('platform')}
          >
            Platform
          </button>
          <button
            type="button"
            className={`landing-nav-link ${activeNav === 'intelligence' ? 'active' : ''}`}
            onClick={() => scrollToSection('intelligence')}
          >
            Intelligence
          </button>
          <button
            type="button"
            className={`landing-nav-link ${activeNav === 'multichain' ? 'active' : ''}`}
            onClick={() => scrollToSection('multichain')}
          >
            Multi-Chain Intelligence
          </button>
          <button
            type="button"
            className="landing-nav-link"
            onClick={() => setShowDocs(true)}
            style={{ color: 'var(--accent)', fontWeight: 600 }}
          >
            Documentation ↗
          </button>
        </div>

        {isLoggedIn ? (
          <button className="btn btn-primary btn-sm" onClick={() => setActivePage('dashboard')}>
            Open Workspace ({investigatorUser}) →
          </button>
        ) : (
          <button className="btn btn-ghost btn-sm" onClick={() => setActivePage('login')}>
            Investigator Sign In →
          </button>
        )}
      </nav>

      {/* Hero */}
      <div style={{
        maxWidth: '1320px',
        margin: '0 auto',
        padding: '60px 56px 40px',
        display: 'grid',
        gridTemplateColumns: '1.05fr 0.95fr',
        gap: '56px',
        alignItems: 'center'
      }}>
        <div>
          <h1 style={{
            fontSize: '52px',
            lineHeight: 1.08,
            fontWeight: 800,
            letterSpacing: '-0.025em',
            marginBottom: '22px'
          }}>
            Trace the wallet.<br />
            Find the <span style={{
              background: 'linear-gradient(100deg, var(--accent), var(--info) 65%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent'
            }}>exchange.</span><br />
            Stop the fraud.
          </h1>

          <p style={{
            color: 'var(--text-dim)',
            fontSize: '16.5px',
            maxWidth: '520px',
            marginBottom: '34px',
            lineHeight: 1.6
          }}>
            CryptoTrace turns a single victim-reported wallet address into a complete fund-flow map — intermediary hops, cross-chain bridges, and the exchange cluster that cashed it out — delivering court-admissible forensic evidence.
          </p>

          <div style={{ display: 'flex', gap: '14px', marginBottom: '44px' }}>
            {isLoggedIn ? (
              <button className="btn btn-primary" onClick={() => setActivePage('dashboard')}>
                Resume Investigation →
              </button>
            ) : (
              <button className="btn btn-primary" onClick={() => setActivePage('login')}>
                Start Investigation →
              </button>
            )}
            <button className="btn btn-ghost" onClick={runDemo}>
              ▶ Launch Active Case Dossier
            </button>
          </div>

          <div style={{ display: 'flex', gap: '34px' }}>
            <div>
              <b style={{ display: 'block', fontSize: '24px', fontWeight: 700, letterSpacing: '-0.02em' }}>2,847</b>
              <span style={{ color: 'var(--text-faint)', fontSize: '12.5px' }}>Wallets analyzed</span>
            </div>
            <div>
              <b style={{ display: 'block', fontSize: '24px', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--crit)' }}>412</b>
              <span style={{ color: 'var(--text-faint)', fontSize: '12.5px' }}>High/critical risk</span>
            </div>
            <div>
              <b style={{ display: 'block', fontSize: '24px', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--accent)' }}>96</b>
              <span style={{ color: 'var(--text-faint)', fontSize: '12.5px' }}>Suspected VASPs</span>
            </div>
            <div>
              <b style={{ display: 'block', fontSize: '24px', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--info)' }}>5</b>
              <span style={{ color: 'var(--text-faint)', fontSize: '12.5px' }}>Chains supported</span>
            </div>
          </div>
        </div>

        {/* Hero Visual Card */}
        <div className="panel" style={{ padding: '24px', boxShadow: '0 30px 60px -30px rgba(0,0,0,0.8)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <span style={{ fontSize: '12.5px', color: 'var(--text-dim)', fontWeight: 600 }}>
              ACTIVE INTELLIGENCE LEDGER · DOSSIER CT-2026-0142
            </span>
            <span className="live-pill"><span className="pulse"></span> LIVE</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0', margin: '8px 0 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '11px', padding: '11px 14px', background: 'var(--panel-2)', border: '1px solid var(--border-soft)', borderRadius: '9px' }}>
              <div style={{ width: '30px', height: '30px', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700, background: 'rgba(78,143,224,.15)', color: 'var(--info)' }}>V</div>
              <div>
                <b style={{ fontSize: '12.5px' }}>Victim Wallet</b>
                <div style={{ color: 'var(--text-faint)', fontSize: '11px' }}>0x9f2...c41a</div>
              </div>
            </div>
            <div style={{ width: '1px', height: '16px', background: 'var(--border)', marginLeft: '26px' }}></div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '11px', padding: '11px 14px', background: 'var(--panel-2)', border: '1px solid var(--border-soft)', borderRadius: '9px' }}>
              <div style={{ width: '30px', height: '30px', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700, background: 'rgba(243,80,107,.15)', color: 'var(--crit)' }}>S</div>
              <div>
                <b style={{ fontSize: '12.5px' }}>Suspect Wallet · Critical Risk</b>
                <div style={{ color: 'var(--text-faint)', fontSize: '11px' }}>0x7a41...e91f</div>
              </div>
            </div>
            <div style={{ width: '1px', height: '16px', background: 'var(--border)', marginLeft: '26px' }}></div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '11px', padding: '11px 14px', background: 'var(--panel-2)', border: '1px solid var(--border-soft)', borderRadius: '9px' }}>
              <div style={{ width: '30px', height: '30px', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700, background: 'rgba(232,185,74,.15)', color: 'var(--warn)' }}>I</div>
              <div>
                <b style={{ fontSize: '12.5px' }}>Intermediary (Layering Hop)</b>
                <div style={{ color: 'var(--text-faint)', fontSize: '11px' }}>0x3d08...2ab7</div>
              </div>
            </div>
            <div style={{ width: '1px', height: '16px', background: 'var(--border)', marginLeft: '26px' }}></div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '11px', padding: '11px 14px', background: 'var(--panel-2)', border: '1px solid var(--border-soft)', borderRadius: '9px' }}>
              <div style={{ width: '30px', height: '30px', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700, background: 'rgba(62,217,163,.15)', color: 'var(--accent)' }}>E</div>
              <div>
                <b style={{ fontSize: '12.5px' }}>Suspected VASP · 92% Conf.</b>
                <div style={{ color: 'var(--text-faint)', fontSize: '11px' }}>NovaSwap Global (Cluster #EX-1180)</div>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            <div style={{ background: 'var(--panel-2)', border: '1px solid var(--border-soft)', borderRadius: '9px', padding: '10px 12px' }}>
              <b style={{ display: 'block', fontSize: '18px', color: 'var(--crit)' }}>81</b>
              <span style={{ color: 'var(--text-faint)', fontSize: '11px' }}>RISK SCORE</span>
            </div>
            <div style={{ background: 'var(--panel-2)', border: '1px solid var(--border-soft)', borderRadius: '9px', padding: '10px 12px' }}>
              <b style={{ display: 'block', fontSize: '18px', color: 'var(--warn)' }}>3</b>
              <span style={{ color: 'var(--text-faint)', fontSize: '11px' }}>HOPS TRACED</span>
            </div>
            <div style={{ background: 'var(--panel-2)', border: '1px solid var(--border-soft)', borderRadius: '9px', padding: '10px 12px' }}>
              <b style={{ display: 'block', fontSize: '18px', color: 'var(--accent)' }}>92%</b>
              <span style={{ color: 'var(--text-faint)', fontSize: '11px' }}>ATTRIBUTION</span>
            </div>
          </div>
        </div>
      </div>

      {/* Capabilities Section */}
      <div id="platform" style={{ maxWidth: '1320px', margin: '40px auto 0', padding: '50px 56px', scrollMarginTop: '80px' }}>
        <div style={{ maxWidth: '640px', marginBottom: '36px' }}>
          <div style={{ color: 'var(--info)', fontSize: '12.5px', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '8px' }}>
            PLATFORM CAPABILITIES
          </div>
          <h2 style={{ fontSize: '32px', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '10px' }}>
            Everything an investigator needs, in one unified flow
          </h2>
          <p style={{ color: 'var(--text-dim)', fontSize: '15px' }}>
            From raw wallet addresses to court-ready evidence packs — CryptoTrace automates multi-hop fund-flow tracing, cluster identification, and VASP attribution.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '16px'
        }}>
          {FEATURES.map((f, i) => (
            <div key={i} className="panel" style={{ padding: '24px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: `${f.c}1f`,
                color: f.c,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
                fontSize: '16px',
                fontWeight: 800
              }}>
                {f.ic}
              </div>
              <h3 style={{ fontSize: '15.5px', fontWeight: 700, marginBottom: '8px' }}>{f.h}</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-dim)', lineHeight: 1.55 }}>{f.p}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Intelligence / How it works */}
      <div id="intelligence" style={{ maxWidth: '1320px', margin: '0 auto', padding: '20px 56px 70px', scrollMarginTop: '80px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ maxWidth: '640px' }}>
            <div style={{ color: 'var(--accent)', fontSize: '12.5px', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '8px' }}>
              INTELLIGENCE &amp; EVIDENTIARY FLOW
            </div>
            <h2 style={{ fontSize: '32px', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '8px' }}>
              From victim report to exchange attribution
            </h2>
            <p style={{ color: 'var(--text-dim)', fontSize: '14.5px' }}>
              Standardized forensic protocol transforming fragmented on-chain records into court-admissible case files.
            </p>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => setActivePage('graph')}>
            Inspect Fund Flow Graph →
          </button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '14px'
        }}>
          {HOW_STEPS.map((s, i) => (
            <div key={i} className="panel" style={{ padding: '22px' }}>
              <div style={{ fontFamily: 'var(--mono)', color: 'var(--text-faint)', fontSize: '12px', fontWeight: 700, marginBottom: '10px' }}>
                {s.n}
              </div>
              <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '6px' }}>{s.h}</h4>
              <p style={{ fontSize: '12.5px', color: 'var(--text-faint)' }}>{s.p}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Multi-Chain Intelligence Section */}
      <div id="multichain" style={{ maxWidth: '1320px', margin: '0 auto', padding: '20px 56px 80px', scrollMarginTop: '80px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ maxWidth: '680px' }}>
            <div style={{ color: 'var(--info)', fontSize: '12.5px', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '8px' }}>
              MULTI-CHAIN SURVEILLANCE &amp; BRIDGES
            </div>
            <h2 style={{ fontSize: '32px', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '8px' }}>
              Cross-chain telemetry across 5 major ecosystems
            </h2>
            <p style={{ color: 'var(--text-dim)', fontSize: '14.5px' }}>
              Criminals hop between chains to break surveillance. CryptoTrace correlates bridge contracts and liquidity pools with verified full-node RPC telemetry.
            </p>
          </div>
          <button className="btn btn-primary" onClick={() => setActivePage('crosschain')}>
            Launch Cross-Chain Console →
          </button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '14px'
        }}>
          {SUPPORTED_CHAINS.map((c, i) => (
            <div key={i} className="panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: c.color }}></div>
                    <h3 style={{ fontSize: '15px', fontWeight: 700 }}>{c.name}</h3>
                  </div>
                  <span className="badge badge-neutral mono" style={{ fontSize: '10px' }}>{c.symbol}</span>
                </div>
                <div style={{ fontSize: '11.5px', color: 'var(--text-dim)', marginBottom: '14px', lineHeight: 1.4 }}>
                  {c.type}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-faint)', borderTop: '1px solid var(--border-soft)', paddingTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Telemetry:</span>
                    <span className="mono" style={{ color: 'var(--accent)' }}>{c.rpc}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Block Interval:</span>
                    <span className="mono">{c.speed}</span>
                  </div>
                  <div style={{ marginTop: '4px' }}>
                    <div style={{ color: 'var(--text-dim)', marginBottom: '2px' }}>Bridges:</div>
                    <div style={{ fontSize: '10.5px' }}>{c.bridges}</div>
                  </div>
                </div>
              </div>
              <div style={{ marginTop: '16px', paddingTop: '10px', borderTop: '1px solid var(--border-soft)', fontSize: '11px', color: 'var(--info)' }}>
                Focus: {c.surveillance}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border)',
        padding: '24px 56px',
        maxWidth: '1320px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '12px',
        color: 'var(--text-faint)'
      }}>
        <span>CryptoTrace · Enterprise Cyber Forensics &amp; Blockchain Financial Crime Intelligence</span>
        <span>Built for Law Enforcement &amp; Financial Intelligence Investigations</span>
      </footer>

      {/* Documentation Modal */}
      {showDocs && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(3, 7, 13, 0.85)',
            backdropFilter: 'blur(10px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px'
          }}
          onClick={() => setShowDocs(false)}
        >
          <div
            className="panel"
            style={{
              width: '100%',
              maxWidth: '960px',
              maxHeight: '88vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 30px 90px rgba(0,0,0,0.85)',
              overflow: 'hidden',
              border: '1px solid rgba(255, 255, 255, 0.12)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{
              padding: '22px 28px',
              borderBottom: '1px solid var(--border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              background: 'var(--panel-2)'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span className="badge badge-info">EVIDENTIARY ARCHITECTURE</span>
                  <span className="badge badge-low">FATF REC 16 COMPLIANT</span>
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '-0.01em' }}>
                  CryptoTrace Forensic Documentation &amp; Evidentiary Reference
                </h3>
                <div style={{ fontSize: '12.5px', color: 'var(--text-dim)', marginTop: '4px' }}>
                  Standard Operating Procedures (SOPs), Regulatory Compliance, and Cryptographic Attribution Guidelines
                </div>
              </div>
              <button
                onClick={() => setShowDocs(false)}
                style={{
                  background: 'transparent',
                  border: '1px solid var(--border-soft)',
                  borderRadius: '8px',
                  color: 'var(--text-faint)',
                  fontSize: '16px',
                  padding: '6px 12px',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-faint)'}
              >
                ✕
              </button>
            </div>

            {/* Modal Nav Tabs */}
            <div style={{
              display: 'flex',
              padding: '0 28px',
              borderBottom: '1px solid var(--border)',
              background: 'var(--panel)',
              gap: '4px'
            }}>
              <button
                type="button"
                className={`docs-tab-btn ${activeDocTab === 'sop' ? 'active' : ''}`}
                onClick={() => setActiveDocTab('sop')}
              >
                Investigator Manual (SOP)
              </button>
              <button
                type="button"
                className={`docs-tab-btn ${activeDocTab === 'standards' ? 'active' : ''}`}
                onClick={() => setActiveDocTab('standards')}
              >
                Regulatory Standards &amp; FATF
              </button>
              <button
                type="button"
                className={`docs-tab-btn ${activeDocTab === 'api' ? 'active' : ''}`}
                onClick={() => setActiveDocTab('api')}
              >
                REST API &amp; Webhooks
              </button>
              <button
                type="button"
                className={`docs-tab-btn ${activeDocTab === 'heuristics' ? 'active' : ''}`}
                onClick={() => setActiveDocTab('heuristics')}
              >
                Attribution Heuristics
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '28px', overflowY: 'auto', flex: 1, fontSize: '13px', lineHeight: 1.6 }}>
              {activeDocTab === 'sop' && (
                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px', color: 'var(--accent)' }}>
                    Standard Operating Procedure: Criminal Crypto Investigation
                  </h4>
                  <p style={{ color: 'var(--text-dim)', marginBottom: '16px' }}>
                    Follow this court-vetted 5-stage protocol when investigating cryptocurrency theft, ransomware extortion, pig butchering (Sha Zhu Pan), and illicit laundering schemes:
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
                    <div style={{ background: 'var(--panel-2)', padding: '14px 18px', borderRadius: '8px', border: '1px solid var(--border-soft)' }}>
                      <b style={{ color: 'var(--info)' }}>1. Evidence Ingestion:</b> Record the victim's wallet origin and target suspect address. CryptoTrace will cross-reference the transaction hashes against native archive nodes.
                    </div>
                    <div style={{ background: 'var(--panel-2)', padding: '14px 18px', borderRadius: '8px', border: '1px solid var(--border-soft)' }}>
                      <b style={{ color: 'var(--warn)' }}>2. Hop &amp; Layering Analysis:</b> Track intermediate wallets used to split and peel stolen funds. Flag smart contracts, mixers, and unhosted intermediary hops.
                    </div>
                    <div style={{ background: 'var(--panel-2)', padding: '14px 18px', borderRadius: '8px', border: '1px solid var(--border-soft)' }}>
                      <b style={{ color: 'var(--crit)' }}>3. VASP Attribution:</b> Identify final deposit sweep transactions terminating at regulated exchanges (Binance, Coinbase, NovaSwap, OKX).
                    </div>
                    <div style={{ background: 'var(--panel-2)', padding: '14px 18px', borderRadius: '8px', border: '1px solid var(--border-soft)' }}>
                      <b style={{ color: 'var(--accent)' }}>4. Emergency Statutory Freeze:</b> Generate the formal 24-Hour Law Enforcement Preservation Notice via the VASP intelligence tab to initiate emergency asset freezing.
                    </div>
                    <div style={{ background: 'var(--panel-2)', padding: '14px 18px', borderRadius: '8px', border: '1px solid var(--border-soft)' }}>
                      <b style={{ color: 'var(--info)' }}>5. Court-Ready Dossier:</b> Compile the cryptographic chain of custody report into a signed PDF evidence package.
                    </div>
                  </div>
                </div>
              )}

              {activeDocTab === 'standards' && (
                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px', color: 'var(--info)' }}>
                    Regulatory Compliance &amp; Chain of Custody
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                    <div style={{ background: 'var(--panel-2)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-soft)' }}>
                      <h5 style={{ fontSize: '14px', marginBottom: '6px', color: 'var(--accent)' }}>FATF Recommendation 16 (Travel Rule)</h5>
                      <p style={{ color: 'var(--text-dim)', fontSize: '12.5px' }}>
                        Mandates VASPs to obtain, hold, and transmit originator and beneficiary information on crypto transfers exceeding $1,000 USD to suppress cross-border terrorist financing.
                      </p>
                    </div>
                    <div style={{ background: 'var(--panel-2)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-soft)' }}>
                      <h5 style={{ fontSize: '14px', marginBottom: '6px', color: 'var(--crit)' }}>OFAC SDN Sanctions Screening</h5>
                      <p style={{ color: 'var(--text-dim)', fontSize: '12.5px' }}>
                        All investigated addresses are checked against OFAC Specially Designated Nationals, including sanctioned mixers (Tornado.Cash, Blender.io, Sinbad) and state-sponsored cybercrime groups (Lazarus).
                      </p>
                    </div>
                  </div>
                  <div style={{ background: 'rgba(62,217,163,0.06)', border: '1px solid rgba(62,217,163,0.25)', padding: '14px 18px', borderRadius: '8px', color: 'var(--text)' }}>
                    <b>Cryptographic Chain of Custody:</b> Every block hash, state root, and transaction receipt is verified and salted with SHA-256 for judicial admissibility under federal cybercrime evidence laws.
                  </div>
                </div>
              )}

              {activeDocTab === 'api' && (
                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px', color: 'var(--warn)' }}>
                    REST API &amp; Webhook Dispatch Architecture
                  </h4>
                  <p style={{ color: 'var(--text-dim)', marginBottom: '14px' }}>
                    Integrate your agency's incident management system (NCRP, SAHYOG, Interpol) directly via authenticated REST endpoints:
                  </p>
                  <div style={{ background: '#03080e', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-soft)', fontFamily: 'var(--mono)', fontSize: '12px', marginBottom: '18px', overflowX: 'auto' }}>
                    <div style={{ color: 'var(--accent)', marginBottom: '8px' }}># Analyze Suspect &amp; Victim Wallet Pair</div>
                    <div style={{ color: 'var(--text-dim)' }}>
                      curl -X POST https://cryptotrace.agency/api/analyze \<br />
                      &nbsp;&nbsp;-H "Authorization: Bearer &lt;LEA_CLEARANCE_KEY&gt;" \<br />
                      &nbsp;&nbsp;-H "Content-Type: application/json" \<br />
                      &nbsp;&nbsp;-d &#39;&#123;"address": "0x7a41f3c9b2e6d0a184f7c3b9e8a2d15f6c7e91f", "victimAddress": "0x4b10293847561029384756102938475610293847", "chain": "Ethereum"&#125;&#39;
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                    <div style={{ background: 'var(--panel-2)', padding: '12px', borderRadius: '8px' }}>
                      <b className="mono" style={{ color: 'var(--accent)' }}>POST /api/analyze</b>
                      <div style={{ fontSize: '11px', color: 'var(--text-faint)' }}>Initiates multi-hop fund flow reconstruction.</div>
                    </div>
                    <div style={{ background: 'var(--panel-2)', padding: '12px', borderRadius: '8px' }}>
                      <b className="mono" style={{ color: 'var(--warn)' }}>POST /api/alerts</b>
                      <div style={{ fontSize: '11px', color: 'var(--text-faint)' }}>Registers on-chain trigger for wallet movements.</div>
                    </div>
                    <div style={{ background: 'var(--panel-2)', padding: '12px', borderRadius: '8px' }}>
                      <b className="mono" style={{ color: 'var(--info)' }}>GET /api/cases</b>
                      <div style={{ fontSize: '11px', color: 'var(--text-faint)' }}>Queries active cases from forensic evidence vault.</div>
                    </div>
                  </div>
                </div>
              )}

              {activeDocTab === 'heuristics' && (
                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px', color: 'var(--accent)' }}>
                    Attribution Heuristics &amp; Cluster Modeling
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ background: 'var(--panel-2)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-soft)' }}>
                      <b style={{ color: 'var(--info)' }}>Common-Input Ownership Heuristic:</b>
                      <div style={{ color: 'var(--text-dim)', fontSize: '12px', marginTop: '4px' }}>
                        If multiple addresses are spent as inputs within the same transaction, CryptoTrace mathematically attributes them to the same operational controller.
                      </div>
                    </div>
                    <div style={{ background: 'var(--panel-2)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-soft)' }}>
                      <b style={{ color: 'var(--warn)' }}>Peel Chain Dissection:</b>
                      <div style={{ color: 'var(--text-dim)', fontSize: '12px', marginTop: '4px' }}>
                        Detects sequential transfers where large balances are systematically "peeled" into small wash amounts while forwarding the remainder to secondary mules.
                      </div>
                    </div>
                    <div style={{ background: 'var(--panel-2)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-soft)' }}>
                      <b style={{ color: 'var(--accent)' }}>VASP Deposit Sweep Fingerprinting:</b>
                      <div style={{ color: 'var(--text-dim)', fontSize: '12px', marginTop: '4px' }}>
                        Matches batch forwarding patterns characteristic of centralized exchange hot-wallet aggregation sweeps, confirming cash-out destinations with up to 96% probabilistic confidence.
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '16px 28px',
              borderTop: '1px solid var(--border)',
              background: 'var(--panel-2)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ fontSize: '12px', color: 'var(--text-faint)' }}>
                CryptoTrace Cyber Forensics Manual · Publication 2026.4
              </span>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => setShowDocs(false)}
                >
                  Close
                </button>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    setShowDocs(false);
                    setActivePage('wallet');
                  }}
                >
                  Launch Investigation Console →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
