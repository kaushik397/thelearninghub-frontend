import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { isSupabaseConfigured } from '../lib/supabase';
import { useAuth } from '../auth/auth-context';

const fieldFocus = (e) => {
  e.target.style.border = '1.5px solid var(--primary)';
  e.target.style.boxShadow = '0 0 0 4px var(--primary-pale)';
};

const fieldBlur = (e) => {
  e.target.style.border = '1px solid var(--border-light)';
  e.target.style.boxShadow = 'none';
};

const inputStyle = {
  fontFamily: "'DM Sans', sans-serif",
  fontSize: '15px',
  fontWeight: 400,
  color: 'var(--text)',
  background: 'var(--white)',
  border: '1px solid var(--border-light)',
  borderRadius: 'var(--radius-md)',
  padding: '14px 18px 14px 48px',
  width: '100%',
  transition: 'border-color 0.2s var(--ease), box-shadow 0.2s var(--ease)',
  outline: 'none',
};

const labelStyle = {
  fontFamily: "'DM Sans', sans-serif",
  fontSize: '11px',
  fontWeight: 500,
  letterSpacing: '0.10em',
  textTransform: 'uppercase',
  color: 'var(--text-mid)',
};

const messageStyle = {
  fontFamily: "'DM Sans', sans-serif",
  fontSize: '13px',
  lineHeight: 1.5,
  color: 'var(--text-mid)',
  background: 'var(--primary-pale)',
  border: '1px solid var(--primary-dim)',
  borderRadius: 'var(--radius-sm)',
  padding: '10px 12px',
};

const errorStyle = {
  ...messageStyle,
  color: '#BA1A1A',
  background: 'rgba(186, 26, 26, 0.08)',
  border: '1px solid rgba(186, 26, 26, 0.16)',
};

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const redirectTo = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!isSupabaseConfigured) {
      setError('Supabase is not configured yet. Add your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
      return;
    }

    setSubmitting(true);
    const { error: authError } = await signIn({ email: email.trim(), password });
    setSubmitting(false);

    if (authError) {
      setError(authError.message);
      return;
    }

    setMessage('Signed in. Taking you to your dashboard...');
    navigate(redirectTo, { replace: true });
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center"
      style={{ background: 'var(--bg)', padding: 'var(--space-md)' }}
    >
      <main
        className="w-full max-w-[520px] mx-auto flex flex-col"
        style={{
          background: 'var(--white)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 4px 24px rgba(12, 26, 29, 0.06)',
          border: '1px solid var(--border-light)',
          padding: 'var(--space-lg)',
          gap: 'var(--space-md)',
        }}
      >
        <header
          className="flex flex-col items-center text-center"
          style={{ gap: 'var(--space-sm)', marginBottom: 'var(--space-xs)' }}
        >
          <span className="section-label">Welcome back</span>
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 900,
              fontSize: 'clamp(32px, 4.5vw, 44px)',
              lineHeight: 1.08,
              letterSpacing: '-0.025em',
              color: 'var(--text)',
              margin: 0,
            }}
          >
            Sign in. Let's <em style={{ color: 'var(--primary)', fontStyle: 'italic' }}>continue.</em>
          </h1>
          <p
            className="measure"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '16px',
              fontWeight: 300,
              lineHeight: 1.72,
              color: 'var(--text-mid)',
              margin: 0,
            }}
          >
            Access your FocusPath dashboard and saved learning sessions.
          </p>
        </header>

        <form className="flex flex-col" style={{ gap: 'var(--space-md)' }} onSubmit={handleSubmit}>
          <div className="flex flex-col" style={{ gap: 'var(--space-xs)' }}>
            <label htmlFor="loginEmail" style={labelStyle}>Email Address</label>
            <div className="relative">
              <span
                className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2"
                style={{ color: 'var(--text-soft)', fontSize: '20px' }}
              >
                mail
              </span>
              <input
                style={inputStyle}
                id="loginEmail"
                placeholder="jane@example.com"
                required
                type="email"
                value={email}
                autoComplete="email"
                onChange={(e) => setEmail(e.target.value)}
                onFocus={fieldFocus}
                onBlur={fieldBlur}
              />
            </div>
          </div>

          <div className="flex flex-col" style={{ gap: 'var(--space-xs)' }}>
            <label htmlFor="loginPassword" style={labelStyle}>Password</label>
            <div className="relative">
              <span
                className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2"
                style={{ color: 'var(--text-soft)', fontSize: '20px' }}
              >
                lock
              </span>
              <input
                style={inputStyle}
                id="loginPassword"
                placeholder="Your password"
                required
                type="password"
                value={password}
                autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)}
                onFocus={fieldFocus}
                onBlur={fieldBlur}
              />
            </div>
          </div>

          {error && <div style={errorStyle}>{error}</div>}
          {message && <div style={messageStyle}>{message}</div>}

          <div className="flex flex-col" style={{ gap: 'var(--space-sm)', marginTop: 'var(--space-xs)' }}>
            <button
              className="btn-primary w-full"
              type="submit"
              disabled={submitting}
              style={{ paddingTop: '16px', paddingBottom: '16px', opacity: submitting ? 0.72 : 1 }}
            >
              {submitting ? 'Signing in...' : 'Sign in'}
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>arrow_forward</span>
            </button>
            <p
              className="text-center"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '14px',
                color: 'var(--text-soft)',
                margin: 0,
              }}
            >
              New here?{' '}
              <Link to="/onboarding/1" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>
                Create an account
              </Link>
            </p>
          </div>
        </form>
      </main>
    </div>
  );
}
