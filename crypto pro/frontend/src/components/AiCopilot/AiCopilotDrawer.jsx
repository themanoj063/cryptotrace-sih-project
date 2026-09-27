import React, { useState, useRef, useEffect } from 'react';
import { useCase } from '../../context/CaseContext';

export default function AiCopilotDrawer() {
  const {
    copilotOpen,
    setCopilotOpen,
    copilotMessages,
    sendCopilotMessage,
    activeCase
  } = useCase();

  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (copilotOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [copilotMessages, copilotOpen]);

  if (!copilotOpen) return null;

  const handleSend = async (text) => {
    const q = text || inputVal;
    if (!q.trim() || loading) return;
    setInputVal('');
    setLoading(true);
    await sendCopilotMessage(q);
    setLoading(false);
  };

  const suggestions = [
    'Draft urgent freeze notice for VASP',
    'Why is this wallet scored Critical?',
    'Explain the intermediary layering wallets',
    'Summarize cross-chain bridge hops'
  ];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      right: 0,
      bottom: 0,
      width: '440px',
      maxWidth: '90vw',
      background: 'var(--panel)',
      borderLeft: '1px solid var(--border)',
      zIndex: 100,
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '-10px 0 40px rgba(0, 0, 0, 0.7)',
      animation: 'slidein 0.25s ease'
    }}>
      <style>{`
        @keyframes slidein {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>

      {/* Header */}
      <div style={{
        padding: '18px 20px',
        borderBottom: '1px solid var(--border-soft)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '7px',
            background: 'rgba(78, 143, 224, 0.15)',
            color: 'var(--info)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '13px'
          }}>✦</div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 700 }}>Forensic AI Copilot</div>
            <div style={{ fontSize: '11px', color: 'var(--text-faint)' }}>
              Powered by Cryptographic Threat Intelligence Core
            </div>
          </div>
        </div>
        <button
          onClick={() => setCopilotOpen(false)}
          style={{
            fontSize: '18px',
            color: 'var(--text-faint)',
            padding: '4px 8px',
            borderRadius: '6px'
          }}
        >
          ✕
        </button>
      </div>

      {/* Active Case Context Bar */}
      {activeCase && (
        <div style={{
          padding: '8px 20px',
          background: 'var(--panel-2)',
          borderBottom: '1px solid var(--border-soft)',
          fontSize: '11.5px',
          display: 'flex',
          justifyContent: 'space-between',
          color: 'var(--text-faint)'
        }}>
          <span>Case: <b style={{ color: 'var(--text)' }}>{activeCase.caseId || activeCase.id}</b></span>
          <span className="mono">{activeCase.address ? activeCase.address.slice(0, 8) + '...' : ''}</span>
          <span className={`badge ${activeCase.level ? 'badge-' + activeCase.level.toLowerCase() : 'badge-neutral'}`}>
            {activeCase.score || 0}/100
          </span>
        </div>
      )}

      {/* Message Stream */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px'
      }}>
        {copilotMessages.map((m, idx) => {
          const isUser = m.sender === 'user';
          return (
            <div
              key={idx}
              style={{
                alignSelf: isUser ? 'flex-end' : 'flex-start',
                maxWidth: '92%',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
              }}
            >
              <div
                style={{
                  background: isUser ? 'var(--info)' : 'var(--panel-2)',
                  color: isUser ? '#FFFFFF' : 'var(--text)',
                  border: isUser ? 'none' : '1px solid var(--border-soft)',
                  padding: '12px 16px',
                  borderRadius: isUser ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                  fontSize: '13px',
                  lineHeight: '1.5',
                  whiteSpace: 'pre-line'
                }}
              >
                {m.text}
              </div>
              <span style={{
                fontSize: '10px',
                color: 'var(--text-faint)',
                alignSelf: isUser ? 'flex-end' : 'flex-start'
              }}>
                {m.time}
              </span>
            </div>
          );
        })}
        {loading && (
          <div style={{
            alignSelf: 'flex-start',
            background: 'var(--panel-2)',
            padding: '10px 16px',
            borderRadius: '12px',
            fontSize: '12px',
            color: 'var(--text-dim)'
          }}>
            Analyzing blockchain transaction graph with AI…
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      <div style={{
        padding: '10px 16px',
        borderTop: '1px solid var(--border-soft)',
        display: 'flex',
        gap: '6px',
        overflowX: 'auto',
        background: 'var(--panel-2)'
      }}>
        {suggestions.map((s, i) => (
          <button
            key={i}
            className="chip"
            style={{ whiteSpace: 'nowrap', fontSize: '11px', padding: '4px 9px' }}
            onClick={() => handleSend(s)}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Input box */}
      <div style={{
        padding: '14px 18px',
        borderTop: '1px solid var(--border)',
        display: 'flex',
        gap: '10px'
      }}>
        <input
          type="text"
          placeholder="Ask AI Copilot about this case…"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          style={{ flex: 1, fontSize: '13px' }}
        />
        <button
          className="btn btn-primary"
          onClick={() => handleSend()}
          disabled={loading}
          style={{ padding: '0 16px' }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
