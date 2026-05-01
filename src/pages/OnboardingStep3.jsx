import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { upsertLearnerProfile } from '../api/userData';
import { useAuth } from '../auth/auth-context';

const OnboardingStep3 = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [focusLength, setFocusLength] = useState(25);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const saveAndContinue = async () => {
    setError('');
    setSaving(true);

    try {
      await upsertLearnerProfile({
        userId: user?.id,
        updates: { focus_duration_minutes: Number(focusLength) },
      });
      navigate('/onboarding/4');
    } catch (err) {
      setError(err.message || 'Could not save your focus length.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: 'var(--bg)' }}
    >
      <header
        className="w-full max-w-[1180px] mx-auto flex items-center justify-between"
        style={{
          padding: 'var(--space-md)',
        }}
      >
        <button
          onClick={() => navigate('/onboarding/2')}
          className="p-2 -ml-2 rounded-full transition-colors"
          style={{ color: 'var(--text-mid)' }}
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div className="flex gap-2 items-center">
          <div className="w-2 h-2 rounded-full" style={{ background: 'var(--primary-dim)' }}></div>
          <div className="w-2 h-2 rounded-full" style={{ background: 'var(--primary-dim)' }}></div>
          <div className="w-8 h-2 rounded-full" style={{ background: 'var(--primary)' }}></div>
          <div className="w-2 h-2 rounded-full" style={{ background: 'var(--primary-dim)' }}></div>
        </div>
        <div className="w-10"></div>
      </header>

      <main
        className="flex-grow flex flex-col items-center justify-center w-full max-w-[800px] mx-auto"
        style={{
          paddingLeft: 'var(--space-md)',
          paddingRight: 'var(--space-md)',
          paddingBottom: 'var(--space-xl)',
        }}
      >
        <div className="text-center w-full max-w-[560px]" style={{ marginBottom: 'var(--space-xl)' }}>
          <span className="section-label" style={{ marginBottom: 'var(--space-sm)', display: 'block' }}>Focus Duration</span>
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(36px, 5.5vw, 56px)',
              fontWeight: 900,
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
              color: 'var(--text)',
              margin: 0,
              marginBottom: 'var(--space-sm)',
            }}
          >
            Set your <em style={{ color: 'var(--primary)', fontStyle: 'italic' }}>focus length.</em>
          </h1>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '17px',
              fontWeight: 300,
              lineHeight: 1.7,
              color: 'var(--text-mid)',
              margin: 0,
            }}
          >
            How long do you typically want to focus before taking a short break? We'll tailor your sessions accordingly.
          </p>
        </div>

        <div
          className="w-full max-w-[560px] flex flex-col items-center"
          style={{
            background: 'var(--white)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-light)',
            boxShadow: '0 4px 24px rgba(12, 26, 29, 0.06)',
            padding: 'var(--space-lg)',
          }}
        >
          <div className="text-center" style={{ marginBottom: 'var(--space-lg)' }}>
            <span
              style={{
                display: 'block',
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(64px, 12vw, 96px)',
                fontWeight: 900,
                lineHeight: 1,
                letterSpacing: '-0.04em',
                color: 'var(--primary)',
              }}
            >
              {focusLength}
            </span>
            <span
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '11px',
                fontWeight: 500,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'var(--text-soft)',
              }}
            >
              Minutes
            </span>
          </div>
          <div className="w-full px-2 relative">
            <input
              aria-label="Focus duration in minutes"
              className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
              style={{
                background: 'var(--primary-dim)',
                accentColor: 'var(--primary)',
              }}
              max="45"
              min="5"
              step="5"
              type="range"
              value={focusLength}
              onChange={(e) => setFocusLength(e.target.value)}
            />
            <div className="flex justify-between w-full mt-3 px-1">
              <span className="caption">5m</span>
              <span className="caption">45m</span>
            </div>
          </div>
          <div
            className="flex items-start gap-3 w-full"
            style={{
              marginTop: 'var(--space-lg)',
              background: 'var(--primary-pale)',
              padding: 'var(--space-sm)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-light)',
            }}
          >
            <span
              className="material-symbols-outlined fill mt-0.5"
              style={{ color: 'var(--primary)' }}
            >
              lightbulb
            </span>
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '14px',
                fontWeight: 300,
                lineHeight: 1.6,
                color: 'var(--text-mid)',
                margin: 0,
              }}
            >
              The Pomodoro technique suggests 25 minutes is optimal for sustained attention without cognitive fatigue.
            </p>
          </div>
        </div>
      </main>

      <footer
        className="w-full max-w-[800px] mx-auto flex justify-center"
        style={{
          paddingLeft: 'var(--space-md)',
          paddingRight: 'var(--space-md)',
          paddingBottom: 'var(--space-xl)',
          paddingTop: 'var(--space-md)',
        }}
      >
        <button
          onClick={saveAndContinue}
          className="btn-primary w-full max-w-[420px]"
          disabled={saving}
          style={{ paddingTop: '18px', paddingBottom: '18px', fontSize: '16px', opacity: saving ? 0.72 : 1 }}
        >
          {saving ? 'Saving...' : 'Continue'}
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>arrow_forward</span>
        </button>
      </footer>
      {error && (
        <p
          className="text-center"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '13px',
            color: '#BA1A1A',
            margin: 0,
            paddingBottom: 'var(--space-md)',
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default OnboardingStep3;
