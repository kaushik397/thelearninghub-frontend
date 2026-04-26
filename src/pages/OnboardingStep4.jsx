import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const OnboardingStep4 = () => {
  const navigate = useNavigate();
  const [energy, setEnergy] = useState('medium');

  const options = [
    { value: 'low', label: 'Low', icon: 'battery_0_bar', description: 'I need a gentle start. Short blocks, frequent breaks.' },
    { value: 'medium', label: 'Medium', icon: 'battery_4_bar', description: 'Ready to learn, but pacing is key. Balanced focus.' },
    { value: 'high', label: 'High', icon: 'battery_charging_full', description: "Let's dive deep. Longer blocks, complex concepts." }
  ];

  const cardStyle = (active) => ({
    height: '100%',
    background: 'var(--white)',
    borderRadius: 'var(--radius-lg)',
    padding: 'var(--space-md) 28px',
    border: active ? '1.5px solid var(--primary)' : '1px solid var(--border-light)',
    boxShadow: active
      ? '0 0 0 4px var(--primary-pale), 0 16px 40px rgba(12, 26, 29, 0.08)'
      : '0 4px 24px rgba(12, 26, 29, 0.06)',
    transition: 'transform 0.3s var(--ease), box-shadow 0.3s var(--ease), border-color 0.3s var(--ease)',
    cursor: 'pointer',
    position: 'relative',
  });

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: 'var(--bg)', color: 'var(--text)' }}
    >
      <header
        className="w-full max-w-[1180px] mx-auto flex justify-between items-center"
        style={{ padding: 'var(--space-md)' }}
      >
        <button
          onClick={() => navigate('/onboarding/3')}
          className="p-2 rounded-full transition-colors"
          style={{ color: 'var(--text-mid)' }}
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <span className="section-label" style={{ color: 'var(--text-soft)' }}>Step 4 of 4</span>
        <div className="w-10"></div>
      </header>

      <main
        className="flex-grow w-full max-w-[1180px] mx-auto flex flex-col justify-center"
        style={{
          paddingLeft: 'var(--space-md)',
          paddingRight: 'var(--space-md)',
          paddingBottom: 'var(--space-xl)',
        }}
      >
        <div
          className="w-full max-w-[800px] mx-auto"
          style={{ marginBottom: 'var(--space-xl)' }}
        >
          <div className="progress-track">
            <div className="progress-fill" style={{ width: '100%' }}></div>
          </div>
        </div>

        <div className="text-center" style={{ marginBottom: 'var(--space-xl)' }}>
          <span className="section-label" style={{ marginBottom: 'var(--space-sm)', display: 'block' }}>One Last Question</span>
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(40px, 6vw, 64px)',
              fontWeight: 900,
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
              color: 'var(--text)',
              margin: 0,
              marginBottom: 'var(--space-sm)',
            }}
          >
            How's your <em style={{ color: 'var(--primary)', fontStyle: 'italic' }}>energy?</em>
          </h1>
          <p
            className="measure mx-auto"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '17px',
              fontWeight: 300,
              lineHeight: 1.7,
              color: 'var(--text-mid)',
              margin: 0,
            }}
          >
            We'll adapt your first session to match your current mental state.
          </p>
        </div>

        <div
          className="grid grid-cols-1 md:grid-cols-3 w-full max-w-3xl mx-auto"
          style={{ gap: 'var(--space-md)', marginBottom: 'var(--space-xl)' }}
        >
          {options.map((opt) => {
            const active = energy === opt.value;
            return (
              <label key={opt.value} className="group cursor-pointer">
                <input
                  className="peer sr-only"
                  name="energy_state"
                  type="radio"
                  value={opt.value}
                  checked={active}
                  onChange={() => setEnergy(opt.value)}
                />
                <div style={cardStyle(active)} className="flex flex-col items-center text-center">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{
                      background: active ? 'var(--primary-dim)' : 'var(--primary-pale)',
                      color: active ? 'var(--primary)' : 'var(--text-mid)',
                      marginBottom: 'var(--space-md)',
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>{opt.icon}</span>
                  </div>
                  <h3
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: '24px',
                      fontWeight: 700,
                      letterSpacing: '-0.02em',
                      color: 'var(--text)',
                      margin: 0,
                      marginBottom: 'var(--space-xs)',
                    }}
                  >
                    {opt.label}
                  </h3>
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
                    {opt.description}
                  </p>
                  {active && (
                    <div
                      className="absolute top-4 right-4"
                      style={{ color: 'var(--primary)' }}
                    >
                      <span className="material-symbols-outlined fill">check_circle</span>
                    </div>
                  )}
                </div>
              </label>
            );
          })}
        </div>

        <div className="flex justify-center mt-auto">
          <button
            onClick={() => navigate('/dashboard')}
            className="btn-primary"
            style={{ paddingLeft: '48px', paddingRight: '48px', paddingTop: '18px', paddingBottom: '18px' }}
          >
            Complete Setup
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>check</span>
          </button>
        </div>
      </main>
    </div>
  );
};

export default OnboardingStep4;
