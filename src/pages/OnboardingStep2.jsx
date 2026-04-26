import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const OnboardingStep2 = () => {
  const navigate = useNavigate();
  const [methodology, setMethodology] = useState('mix');

  const optionLabel = (label) => ({
    fontFamily: "'Playfair Display', serif",
    fontSize: '22px',
    fontWeight: 700,
    letterSpacing: '-0.02em',
    color: 'var(--text)',
    margin: 0,
  });

  const optionDesc = {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '14px',
    fontWeight: 300,
    lineHeight: 1.6,
    color: 'var(--text-mid)',
    margin: 0,
  };

  const cardStyle = (active) => ({
    height: '100%',
    background: 'var(--white)',
    padding: 'var(--space-md) 28px',
    borderRadius: 'var(--radius-lg)',
    border: active ? '1.5px solid var(--primary)' : '1px solid var(--border-light)',
    boxShadow: active
      ? '0 0 0 4px var(--primary-pale), 0 16px 40px rgba(12, 26, 29, 0.08)'
      : '0 4px 24px rgba(12, 26, 29, 0.06)',
    transition: 'border-color 0.3s var(--ease), box-shadow 0.3s var(--ease), transform 0.3s var(--ease)',
    cursor: 'pointer',
  });

  return (
    <div
      className="min-h-screen flex flex-col items-center"
      style={{
        background: 'var(--bg)',
        paddingTop: 'var(--space-xl)',
        paddingBottom: 'var(--space-xl)',
        paddingLeft: 'var(--space-md)',
        paddingRight: 'var(--space-md)',
      }}
    >
      <div className="w-full max-w-[800px]" style={{ marginBottom: 'var(--space-xl)' }}>
        <div className="flex justify-between items-center" style={{ marginBottom: 'var(--space-sm)' }}>
          <span className="section-label" style={{ color: 'var(--text-soft)' }}>Step 2 of 4</span>
          <span className="section-label">Methodology</span>
        </div>
        <div className="flex gap-2">
          <div className="h-1.5 flex-1 rounded-full" style={{ background: 'var(--primary)' }}></div>
          <div className="h-1.5 flex-1 rounded-full" style={{ background: 'var(--primary)' }}></div>
          <div className="h-1.5 flex-1 rounded-full" style={{ background: 'var(--primary-dim)' }}></div>
          <div className="h-1.5 flex-1 rounded-full" style={{ background: 'var(--primary-dim)' }}></div>
        </div>
      </div>

      <main className="w-full max-w-[800px] flex-1 flex flex-col">
        <header className="text-center" style={{ marginBottom: 'var(--space-lg)' }}>
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(36px, 5vw, 52px)',
              fontWeight: 900,
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
              color: 'var(--text)',
              margin: 0,
              marginBottom: 'var(--space-sm)',
            }}
          >
            How do you <em style={{ color: 'var(--primary)', fontStyle: 'italic' }}>learn best?</em>
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
            Select your preferred format. We'll adapt your sessions to match your cognitive style.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          {['text', 'video', 'audio'].map((type) => {
            const active = methodology === type;
            return (
              <label key={type} className="cursor-pointer group relative">
                <input
                  className="peer sr-only"
                  name="methodology"
                  type="radio"
                  value={type}
                  checked={active}
                  onChange={() => setMethodology(type)}
                />
                <div
                  style={cardStyle(active)}
                  className="flex flex-col items-center text-center"
                >
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center transition-colors"
                    style={{
                      background: active ? 'var(--primary-dim)' : 'var(--primary-pale)',
                      color: active ? 'var(--primary)' : 'var(--text-mid)',
                      marginBottom: 'var(--space-md)',
                    }}
                  >
                    <span className="material-symbols-outlined text-3xl">
                      {type === 'text' ? 'article' : type === 'video' ? 'play_circle' : 'headphones'}
                    </span>
                  </div>
                  <h3 style={optionLabel()} className="mb-2">
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </h3>
                  <p style={optionDesc} className="measure">
                    {type === 'text'
                      ? 'Read at your own pace with structured micro-blocks.'
                      : type === 'video'
                      ? 'Visual explanations with key takeaways highlighted.'
                      : 'Listen while on the go, perfect for multi-tasking.'}
                  </p>
                </div>
              </label>
            );
          })}

          <label className="cursor-pointer group relative sm:col-span-2">
            <input
              className="peer sr-only"
              name="methodology"
              type="radio"
              value="mix"
              checked={methodology === 'mix'}
              onChange={() => setMethodology('mix')}
            />
            <div style={cardStyle(methodology === 'mix')} className="flex flex-col">
              <div className="flex items-center gap-4" style={{ marginBottom: 'var(--space-md)' }}>
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center shrink-0"
                  style={{
                    background: methodology === 'mix' ? 'var(--primary-dim)' : 'var(--primary-pale)',
                    color: methodology === 'mix' ? 'var(--primary)' : 'var(--text-mid)',
                  }}
                >
                  <span className="material-symbols-outlined text-3xl">tune</span>
                </div>
                <div>
                  <h3 style={optionLabel()} className="mb-1">Custom Mix</h3>
                  <p style={optionDesc}>Fine-tune your perfect blend of learning modalities.</p>
                </div>
              </div>

              {methodology === 'mix' && (
                <div
                  style={{
                    paddingTop: 'var(--space-md)',
                    borderTop: '1px solid var(--border-light)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--space-md)',
                  }}
                >
                  {['Text', 'Video', 'Audio'].map((label, idx) => (
                    <div key={label} className="flex flex-col gap-2">
                      <div className="flex justify-between items-center">
                        <span
                          className="flex items-center gap-2"
                          style={{
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: '15px',
                            fontWeight: 500,
                            color: 'var(--text)',
                          }}
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'var(--text-mid)' }}>
                            {label === 'Text' ? 'article' : label === 'Video' ? 'play_circle' : 'headphones'}
                          </span>
                          {label}
                        </span>
                        <span
                          className="chip chip-active"
                          style={{ padding: '4px 12px', fontSize: '12px' }}
                        >
                          {idx === 2 ? '20%' : '40%'}
                        </span>
                      </div>
                      <input
                        className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                        style={{
                          background: 'var(--primary-dim)',
                          accentColor: 'var(--primary)',
                        }}
                        max="100"
                        min="0"
                        type="range"
                        defaultValue={idx === 2 ? 20 : 40}
                      />
                    </div>
                  ))}
                  <div className="flex justify-between items-center" style={{ paddingTop: 'var(--space-xs)' }}>
                    <span className="caption">Total allocation</span>
                    <span
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: '12px',
                        fontWeight: 500,
                        color: 'var(--primary)',
                      }}
                    >
                      100% Complete
                    </span>
                  </div>
                </div>
              )}
            </div>
          </label>
        </div>
      </main>

      <div
        className="w-full max-w-[800px] flex justify-between items-center mt-auto"
        style={{ paddingTop: 'var(--space-lg)' }}
      >
        <button
          onClick={() => navigate('/onboarding/1')}
          className="btn-ghost"
        >
          Back
        </button>
        <button
          onClick={() => navigate('/onboarding/3')}
          className="btn-primary"
        >
          Continue
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>arrow_forward</span>
        </button>
      </div>
    </div>
  );
};

export default OnboardingStep2;
