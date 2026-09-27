import React, { useState, useEffect } from 'react';
import { useCase } from '../context/CaseContext';

export default function LoginPage() {
  const { setActivePage, login, register, requestOtp, verifyOtp } = useCase();

  // Mode: 'signin' | 'signup'
  const [authTab, setAuthTab] = useState('signin');

  // Sign In Method: 'password' | 'otp'
  const [signInMethod, setSignInMethod] = useState('password');

  // Form Fields for Sign In
  const [username, setUsername] = useState('investigator01');
  const [password, setPassword] = useState('demo1234');

  // Form Fields for OTP
  const [otpIdentifier, setOtpIdentifier] = useState('investigator01');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [devOtpCode, setDevOtpCode] = useState('');
  const [otpCountdown, setOtpCountdown] = useState(0);

  // Form Fields for Sign Up (New User)
  const [regUsername, setRegUsername] = useState('');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regDepartment, setRegDepartment] = useState('Cyber Crime Directorate / LEO');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Countdown timer for OTP
  useEffect(() => {
    let interval = null;
    if (otpCountdown > 0) {
      interval = setInterval(() => {
        setOtpCountdown((c) => c - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpCountdown]);

  // Handle Standard Password Login
  const handlePasswordLogin = async (e) => {
    e?.preventDefault();
    if (!username.trim() || !password.trim()) {
      setErrorMsg('Please enter your investigator badge ID and clearance passkey.');
      return;
    }
    setErrorMsg('');
    setSuccessMsg('');
    setIsSubmitting(true);
    const res = await login(username.trim(), password.trim());
    setIsSubmitting(false);
    if (!res?.success) {
      setErrorMsg(res?.error || 'Authentication rejected. Please check your credentials or contact administrator.');
    }
  };

  // Handle Request OTP
  const handleGenerateOtp = async (e) => {
    e?.preventDefault();
    if (!otpIdentifier.trim()) {
      setErrorMsg('Please enter your Badge ID or registered official email to request an OTP.');
      return;
    }
    setErrorMsg('');
    setSuccessMsg('');
    setIsSubmitting(true);
    const res = await requestOtp(otpIdentifier.trim());
    setIsSubmitting(false);
    if (res?.success && res.data) {
      setOtpSent(true);
      setDevOtpCode(res.data.devOtp || '');
      setOtpCountdown(300); // 5 minutes
      setSuccessMsg(`Security OTP generated. Check your authorized terminal.`);
    } else {
      setErrorMsg(res?.error || 'Unable to generate security OTP. Ensure Badge ID or email is registered.');
    }
  };

  // Handle Verify OTP
  const handleVerifyOtpSubmit = async (e) => {
    e?.preventDefault();
    if (!otpCode.trim() || otpCode.trim().length !== 6) {
      setErrorMsg('Please enter the 6-digit security OTP code.');
      return;
    }
    setErrorMsg('');
    setIsSubmitting(true);
    const res = await verifyOtp(otpIdentifier.trim(), otpCode.trim());
    setIsSubmitting(false);
    if (!res?.success) {
      setErrorMsg(res?.error || 'OTP verification failed. Please check the code.');
    }
  };

  // Handle New User Registration
  const handleRegisterSubmit = async (e) => {
    e?.preventDefault();
    if (!regUsername.trim() || !regName.trim() || !regEmail.trim() || !regPassword.trim()) {
      setErrorMsg('All mandatory fields (Badge ID, Full Name, Email, Passkey) are required.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setErrorMsg('Passkeys do not match. Please re-enter your security passkey.');
      return;
    }
    if (regPassword.length < 6) {
      setErrorMsg('Passkey must be at least 6 characters long.');
      return;
    }

    setErrorMsg('');
    setSuccessMsg('');
    setIsSubmitting(true);
    const res = await register({
      username: regUsername.trim(),
      name: regName.trim(),
      email: regEmail.trim(),
      password: regPassword.trim(),
      department: regDepartment.trim()
    });
    setIsSubmitting(false);
    if (!res?.success) {
      setErrorMsg(res?.error || 'Registration rejected. Please check fields.');
    }
  };

  // Quick Preset Helper
  const setQuickCredentials = (u, p) => {
    setAuthTab('signin');
    setSignInMethod('password');
    setUsername(u);
    setPassword(p);
    setErrorMsg('');
    setSuccessMsg('');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(1100px 480px at 82% -8%, rgba(78,143,224,0.14), transparent 60%), radial-gradient(900px 460px at -6% 10%, rgba(62,217,163,0.10), transparent 55%), var(--bg)',
      padding: '24px'
    }}>
      <div className="panel" style={{
        width: '460px',
        padding: '36px',
        boxShadow: '0 30px 70px -30px rgba(0,0,0,0.85)',
        border: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        {/* Brand */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '11px',
          fontWeight: 800,
          fontSize: '20px',
          marginBottom: '4px'
        }}>
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

        <div style={{
          textAlign: 'center',
          color: 'var(--text-faint)',
          fontSize: '11.5px',
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          marginBottom: '20px'
        }}>
          Financial Crimes Intelligence Network · Tier-3 Portal
        </div>

        {/* Auth Tab Switcher: Sign In vs New User (Sign Up) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          background: 'var(--panel-2)',
          padding: '4px',
          borderRadius: '9px',
          marginBottom: '22px',
          border: '1px solid var(--border-soft)'
        }}>
          <button
            type="button"
            style={{
              padding: '8px 0',
              borderRadius: '7px',
              border: 'none',
              background: authTab === 'signin' ? 'var(--panel)' : 'transparent',
              color: authTab === 'signin' ? 'var(--text)' : 'var(--text-dim)',
              fontWeight: 600,
              fontSize: '12.5px',
              cursor: 'pointer',
              boxShadow: authTab === 'signin' ? '0 2px 6px rgba(0,0,0,0.2)' : 'none',
              transition: 'all 0.15s ease'
            }}
            onClick={() => {
              setAuthTab('signin');
              setErrorMsg('');
              setSuccessMsg('');
            }}
          >
            Investigator Sign In
          </button>
          <button
            type="button"
            style={{
              padding: '8px 0',
              borderRadius: '7px',
              border: 'none',
              background: authTab === 'signup' ? 'var(--panel)' : 'transparent',
              color: authTab === 'signup' ? 'var(--accent)' : 'var(--text-dim)',
              fontWeight: 600,
              fontSize: '12.5px',
              cursor: 'pointer',
              boxShadow: authTab === 'signup' ? '0 2px 6px rgba(0,0,0,0.2)' : 'none',
              transition: 'all 0.15s ease'
            }}
            onClick={() => {
              setAuthTab('signup');
              setErrorMsg('');
              setSuccessMsg('');
            }}
          >
            + New Investigator
          </button>
        </div>

        {/* Error / Success Feedback */}
        {errorMsg && (
          <div style={{
            background: 'rgba(243,80,107,.1)',
            border: '1px solid rgba(243,80,107,.3)',
            color: 'var(--crit)',
            fontSize: '12px',
            padding: '10px 14px',
            borderRadius: '8px',
            marginBottom: '16px',
            lineHeight: 1.4
          }}>
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div style={{
            background: 'rgba(62,217,163,.08)',
            border: '1px solid rgba(62,217,163,.25)',
            color: 'var(--accent)',
            fontSize: '12px',
            padding: '10px 14px',
            borderRadius: '8px',
            marginBottom: '16px',
            lineHeight: 1.4
          }}>
            {successMsg}
          </div>
        )}

        {/* TAB 1: SIGN IN */}
        {authTab === 'signin' && (
          <div>
            {/* Sub-method: Password vs OTP */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '16px',
              marginBottom: '18px',
              fontSize: '12px'
            }}>
              <span
                style={{
                  cursor: 'pointer',
                  color: signInMethod === 'password' ? 'var(--info)' : 'var(--text-faint)',
                  fontWeight: signInMethod === 'password' ? 700 : 500,
                  borderBottom: signInMethod === 'password' ? '2px solid var(--info)' : '2px solid transparent',
                  paddingBottom: '3px'
                }}
                onClick={() => {
                  setSignInMethod('password');
                  setErrorMsg('');
                }}
              >
                Passkey Authentication
              </span>
              <span style={{ color: 'var(--border)' }}>|</span>
              <span
                style={{
                  cursor: 'pointer',
                  color: signInMethod === 'otp' ? 'var(--accent)' : 'var(--text-faint)',
                  fontWeight: signInMethod === 'otp' ? 700 : 500,
                  borderBottom: signInMethod === 'otp' ? '2px solid var(--accent)' : '2px solid transparent',
                  paddingBottom: '3px'
                }}
                onClick={() => {
                  setSignInMethod('otp');
                  setErrorMsg('');
                }}
              >
                2FA / Security OTP Login
              </span>
            </div>

            {/* Mode A: Standard Passkey */}
            {signInMethod === 'password' && (
              <form onSubmit={handlePasswordLogin}>
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '11.5px', color: 'var(--text-faint)', marginBottom: '6px', fontWeight: 600 }}>
                    Investigator Badge ID / Username
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. investigator01 or admin"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={{ width: '100%' }}
                    required
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '11.5px', color: 'var(--text-faint)', marginBottom: '6px', fontWeight: 600 }}>
                    Security Passkey
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ width: '100%' }}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center', padding: '10px' }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Verifying Passkey…' : 'Authenticate Access →'}
                </button>
              </form>
            )}

            {/* Mode B: 2FA / OTP Login */}
            {signInMethod === 'otp' && (
              <div>
                {!otpSent ? (
                  <form onSubmit={handleGenerateOtp}>
                    <div style={{ marginBottom: '18px' }}>
                      <label style={{ display: 'block', fontSize: '11.5px', color: 'var(--text-faint)', marginBottom: '6px', fontWeight: 600 }}>
                        Badge ID or Registered Email
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. investigator01 or admin@cryptotrace.agency"
                        value={otpIdentifier}
                        onChange={(e) => setOtpIdentifier(e.target.value)}
                        style={{ width: '100%' }}
                        required
                      />
                      <div style={{ fontSize: '11px', color: 'var(--text-faint)', marginTop: '6px' }}>
                        A one-time 6-digit cryptographic security code will be generated for your clearance session.
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary"
                      style={{ width: '100%', justifyContent: 'center', padding: '10px' }}
                      disabled={isSubmitting || !otpIdentifier.trim()}
                    >
                      {isSubmitting ? 'Generating Security OTP…' : 'Generate Security OTP →'}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtpSubmit}>
                    <div style={{ marginBottom: '14px', textAlign: 'center' }}>
                      <div style={{ fontSize: '12px', color: 'var(--text-dim)', marginBottom: '6px' }}>
                        Enter 6-digit OTP code sent for <b className="mono" style={{ color: 'var(--accent)' }}>{otpIdentifier}</b>:
                      </div>

                      {devOtpCode && (
                        <div
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            background: 'rgba(62,217,163,0.1)',
                            border: '1px solid rgba(62,217,163,0.3)',
                            padding: '4px 10px',
                            borderRadius: '6px',
                            fontSize: '11.5px',
                            color: 'var(--accent)',
                            marginBottom: '10px',
                            cursor: 'pointer'
                          }}
                          onClick={() => setOtpCode(devOtpCode)}
                          title="Click to auto-fill test code"
                        >
                          <span>✦ Test OTP: <b className="mono">{devOtpCode}</b> (Click to Fill)</span>
                        </div>
                      )}

                      <input
                        type="text"
                        maxLength={6}
                        placeholder="000000"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                        style={{
                          width: '180px',
                          textAlign: 'center',
                          fontSize: '24px',
                          fontWeight: 800,
                          letterSpacing: '0.3em',
                          fontFamily: 'var(--mono)',
                          margin: '0 auto',
                          display: 'block'
                        }}
                        autoFocus
                        required
                      />

                      <div style={{ fontSize: '11px', color: 'var(--text-faint)', marginTop: '8px' }}>
                        Expires in {Math.floor(otpCountdown / 60)}:{(otpCountdown % 60).toString().padStart(2, '0')}
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary"
                      style={{ width: '100%', justifyContent: 'center', padding: '10px', marginBottom: '10px' }}
                      disabled={isSubmitting || otpCode.length !== 6}
                    >
                      {isSubmitting ? 'Verifying OTP…' : 'Verify & Authorize Clearance →'}
                    </button>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-faint)' }}>
                      <span
                        style={{ cursor: 'pointer', textDecoration: 'underline' }}
                        onClick={() => {
                          setOtpSent(false);
                          setOtpCode('');
                        }}
                      >
                        ← Change Identifier
                      </span>
                      <span
                        style={{ cursor: 'pointer', textDecoration: 'underline' }}
                        onClick={handleGenerateOtp}
                      >
                        Resend OTP
                      </span>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: SIGN UP (NEW INVESTIGATOR) */}
        {authTab === 'signup' && (
          <form onSubmit={handleRegisterSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-faint)', marginBottom: '4px', fontWeight: 600 }}>
                  Badge ID / Username *
                </label>
                <input
                  type="text"
                  placeholder="e.g. agent_reyes"
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  style={{ width: '100%' }}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-faint)', marginBottom: '4px', fontWeight: 600 }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Det. Marcos Reyes"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  style={{ width: '100%' }}
                  required
                />
              </div>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-faint)', marginBottom: '4px', fontWeight: 600 }}>
                Official Agency / Department
              </label>
              <input
                type="text"
                placeholder="e.g. State Cyber Fraud Unit / LEO"
                value={regDepartment}
                onChange={(e) => setRegDepartment(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-faint)', marginBottom: '4px', fontWeight: 600 }}>
                Official Email *
              </label>
              <input
                type="email"
                placeholder="e.g. reyes@cyberpolice.gov"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                style={{ width: '100%' }}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '18px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-faint)', marginBottom: '4px', fontWeight: 600 }}>
                  Security Passkey *
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  style={{ width: '100%' }}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-faint)', marginBottom: '4px', fontWeight: 600 }}>
                  Confirm Passkey *
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                  style={{ width: '100%' }}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '10px' }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Registering Account…' : 'Register Investigator & Authenticate →'}
            </button>
          </form>
        )}

        {/* Quick Credentials Chips for Easy Evaluation */}
        <div style={{ marginTop: '22px', borderTop: '1px solid var(--border-soft)', paddingTop: '16px' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-faint)', marginBottom: '8px', textAlign: 'center' }}>
            Quick Clearance Preset (1-Click Fill):
          </div>
          <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="chip"
              style={{ fontSize: '11px', cursor: 'pointer', borderColor: 'rgba(138, 110, 240, 0.4)', color: '#a78bfa' }}
              onClick={() => setQuickCredentials('admin', 'cyber2026!')}
            >
              🛡 Chief Admin (admin)
            </button>
            <button
              type="button"
              className="chip"
              style={{ fontSize: '11px', cursor: 'pointer' }}
              onClick={() => setQuickCredentials('investigator01', 'demo1234')}
            >
              👤 Investigator (investigator01)
            </button>
            <button
              type="button"
              className="chip"
              style={{ fontSize: '11px', cursor: 'pointer' }}
              onClick={() => setQuickCredentials('forensics_lead', 'trace1234')}
            >
              🔬 Forensics Lead
            </button>
          </div>
        </div>

        {/* Official Restricted Legal Notice */}
        <div style={{
          marginTop: '18px',
          padding: '10px 14px',
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid var(--border-soft)',
          borderRadius: '8px',
          fontSize: '10.5px',
          color: 'var(--text-faint)',
          lineHeight: 1.45
        }}>
          <div style={{ color: 'var(--accent)', fontWeight: 700, marginBottom: '3px', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span>🔒</span> RESTRICTED INVESTIGATION NETWORK
          </div>
          All session actions, wallet lookups, and attribution notices are cryptographically audited for evidentiary chain-of-custody.
        </div>

        <div
          onClick={() => setActivePage('landing')}
          style={{
            display: 'block',
            textAlign: 'center',
            marginTop: '16px',
            color: 'var(--text-faint)',
            fontSize: '12px',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-faint)'}
        >
          ← Return to Public Presentation
        </div>
      </div>
    </div>
  );
}
