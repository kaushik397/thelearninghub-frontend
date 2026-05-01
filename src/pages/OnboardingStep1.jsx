import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/auth-context';
import { isSupabaseConfigured } from '../lib/supabase';

const OnboardingStep1 = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [form, setForm] = useState({ fullName: '', email: '', password: '', dateOfBirth: '' });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

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

  const handleChange = (field) => (e) => {
    setForm((current) => ({ ...current, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!isSupabaseConfigured) {
      setError('Supabase is not configured yet. Add your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
      return;
    }

    setSubmitting(true);
    const { data, error: authError } = await signUp({
      email: form.email.trim(),
      password: form.password,
      fullName: form.fullName.trim(),
      dateOfBirth: form.dateOfBirth,
    });
    setSubmitting(false);

    if (authError) {
      setError(authError.message);
      return;
    }

    if (!data.session) {
      setMessage('Account created. Check your email to confirm it, then sign in.');
      return;
    }

    navigate('/onboarding/2');
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
          <span className="section-label">Step 1 of 4</span>
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
            Welcome. Let's <em style={{ color: 'var(--primary)', fontStyle: 'italic' }}>get started.</em>
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
            We just need a few basic details to set up your profile.
          </p>
        </header>

        <div
          aria-label="Progress: Step 1 of 4"
          className="flex items-center justify-center gap-2"
          style={{ marginTop: 'var(--space-xs)', marginBottom: 'var(--space-xs)' }}
        >
          <div className="w-12 h-1.5 rounded-full" style={{ background: 'var(--primary)' }} title="Step 1: Active"></div>
          <div className="w-12 h-1.5 rounded-full" style={{ background: 'var(--primary-dim)' }} title="Step 2"></div>
          <div className="w-12 h-1.5 rounded-full" style={{ background: 'var(--primary-dim)' }} title="Step 3"></div>
          <div className="w-12 h-1.5 rounded-full" style={{ background: 'var(--primary-dim)' }} title="Step 4"></div>
        </div>

        <form
          className="flex flex-col"
          style={{ gap: 'var(--space-md)' }}
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col" style={{ gap: 'var(--space-xs)' }}>
            <label
              htmlFor="fullName"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '11px',
                fontWeight: 500,
                letterSpacing: '0.10em',
                textTransform: 'uppercase',
                color: 'var(--text-mid)',
              }}
            >
              Full Name
            </label>
            <div className="relative">
              <span
                className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2"
                style={{ color: 'var(--text-soft)', fontSize: '20px' }}
              >
                person
              </span>
              <input
                style={inputStyle}
                id="fullName"
                placeholder="e.g. Jane Doe"
                required
                type="text"
                value={form.fullName}
                autoComplete="name"
                onChange={handleChange('fullName')}
                onFocus={(e) => {
                  e.target.style.border = '1.5px solid var(--primary)';
                  e.target.style.boxShadow = '0 0 0 4px var(--primary-pale)';
                }}
                onBlur={(e) => {
                  e.target.style.border = '1px solid var(--border-light)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>

          <div className="flex flex-col" style={{ gap: 'var(--space-xs)' }}>
            <label
              htmlFor="email"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '11px',
                fontWeight: 500,
                letterSpacing: '0.10em',
                textTransform: 'uppercase',
                color: 'var(--text-mid)',
              }}
            >
              Email Address
            </label>
            <div className="relative">
              <span
                className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2"
                style={{ color: 'var(--text-soft)', fontSize: '20px' }}
              >
                mail
              </span>
              <input
                style={inputStyle}
                id="email"
                placeholder="jane@example.com"
                required
                type="email"
                value={form.email}
                autoComplete="email"
                onChange={handleChange('email')}
                onFocus={(e) => {
                  e.target.style.border = '1.5px solid var(--primary)';
                  e.target.style.boxShadow = '0 0 0 4px var(--primary-pale)';
                }}
                onBlur={(e) => {
                  e.target.style.border = '1px solid var(--border-light)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>

          <div className="flex flex-col" style={{ gap: 'var(--space-xs)' }}>
            <label
              htmlFor="password"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '11px',
                fontWeight: 500,
                letterSpacing: '0.10em',
                textTransform: 'uppercase',
                color: 'var(--text-mid)',
              }}
            >
              Password
            </label>
            <div className="relative">
              <span
                className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2"
                style={{ color: 'var(--text-soft)', fontSize: '20px' }}
              >
                lock
              </span>
              <input
                style={inputStyle}
                id="password"
                placeholder="At least 8 characters"
                required
                type="password"
                minLength={8}
                autoComplete="new-password"
                value={form.password}
                onChange={handleChange('password')}
                onFocus={(e) => {
                  e.target.style.border = '1.5px solid var(--primary)';
                  e.target.style.boxShadow = '0 0 0 4px var(--primary-pale)';
                }}
                onBlur={(e) => {
                  e.target.style.border = '1px solid var(--border-light)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
            <span
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '12px',
                color: 'var(--text-soft)',
                marginTop: '4px',
              }}
            >
              We'll use this to create your FocusPath account.
            </span>
          </div>

          <div className="flex flex-col" style={{ gap: 'var(--space-xs)' }}>
            <label
              htmlFor="dob"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '11px',
                fontWeight: 500,
                letterSpacing: '0.10em',
                textTransform: 'uppercase',
                color: 'var(--text-mid)',
              }}
            >
              Date of Birth
            </label>
            <div className="relative">
              <span
                className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2"
                style={{ color: 'var(--text-soft)', fontSize: '20px' }}
              >
                calendar_today
              </span>
              <input
                style={inputStyle}
                id="dob"
                required
                type="date"
                value={form.dateOfBirth}
                onChange={handleChange('dateOfBirth')}
                onFocus={(e) => {
                  e.target.style.border = '1.5px solid var(--primary)';
                  e.target.style.boxShadow = '0 0 0 4px var(--primary-pale)';
                }}
                onBlur={(e) => {
                  e.target.style.border = '1px solid var(--border-light)';
                  e.target.style.boxShadow = 'none';
                }}
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
              {submitting ? 'Creating account...' : 'Continue'}
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>arrow_forward</span>
            </button>
            <button className="btn-ghost w-full" type="button">
              Back
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
              Already have an account?{' '}
              <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </main>
    </div>
  );
};

export default OnboardingStep1;
