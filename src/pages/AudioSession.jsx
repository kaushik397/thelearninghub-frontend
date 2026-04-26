import React from 'react';
import AppLayout from '../layouts/AppLayout';
import { useNavigate } from 'react-router-dom';

const AudioSession = () => {
  const navigate = useNavigate();
  return (
    <AppLayout title="FocusPath">
      <div className="text-center" style={{ marginBottom: 'var(--space-md)' }}>
        <div
          className="inline-flex items-center gap-2"
          style={{
            background: 'var(--primary-dim)',
            color: 'var(--primary)',
            borderRadius: 'var(--radius-pill)',
            padding: '6px 16px',
            marginBottom: 'var(--space-md)',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '11px',
            fontWeight: 500,
            letterSpacing: '0.10em',
            textTransform: 'uppercase',
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>headphones</span>
          <span>Audio Mode • Module 3</span>
        </div>
        <h2
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(32px, 4.5vw, 48px)',
            fontWeight: 900,
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
            color: 'var(--text)',
            margin: 0,
          }}
        >
          Cognitive Bias in <em style={{ color: 'var(--primary)', fontStyle: 'italic' }}>Decision Making.</em>
        </h2>
      </div>

      <div
        className="flex flex-col items-center relative overflow-hidden"
        style={{
          background: 'var(--white)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-light)',
          boxShadow: '0 4px 24px rgba(12, 26, 29, 0.06)',
          padding: 'var(--space-md)',
          gap: 'var(--space-md)',
        }}
      >
        <div
          className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2"
          style={{
            background: 'var(--primary-pale)',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-pill)',
            padding: '6px 16px',
          }}
        >
          <span className="material-symbols-outlined" style={{ color: 'var(--primary)', fontSize: '18px' }}>history</span>
          <span
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '12px',
              color: 'var(--text-mid)',
            }}
          >
            Ready to resume from 04:12?
          </span>
        </div>

        <div className="w-full h-48 flex items-end justify-center gap-1.5 px-6" style={{ marginTop: 'var(--space-lg)' }}>
          {[12, 16, 24, 20, 32, 40, 36, 44, 28, 36, 48, 32, 20, 24, 16, 12].map((h, i) => (
            <div
              key={i}
              className="w-1.5 rounded-full transition-all duration-200"
              style={{
                height: `${h * 4}px`,
                background: 'var(--primary)',
                opacity: i < 4 || i > 11 ? 0.3 : i === 4 || i === 12 ? 0.5 : 1,
              }}
            />
          ))}
        </div>

        <div className="w-full px-6">
          <div className="flex justify-between" style={{ marginBottom: '8px' }}>
            <span
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '12px',
                color: 'var(--text-mid)',
              }}
            >
              04:12
            </span>
            <span
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '12px',
                color: 'var(--text-mid)',
              }}
            >
              12:45
            </span>
          </div>
          <div className="progress-track" style={{ height: '6px' }}>
            <div className="progress-fill" style={{ width: '33%' }}></div>
          </div>
        </div>

        <div className="flex items-center" style={{ gap: 'var(--space-md)' }}>
          <button
            className="w-12 h-12 flex items-center justify-center transition-all active:scale-90"
            style={{
              color: 'var(--text-mid)',
              background: 'transparent',
              border: 'none',
              borderRadius: '100%',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--primary-pale)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>replay_5</span>
          </button>
          <button
            className="w-20 h-20 flex items-center justify-center transition-transform active:scale-95"
            style={{
              background: 'var(--primary)',
              color: '#FFFFFF',
              borderRadius: '100%',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 0 0 8px var(--primary-glow), 0 16px 40px rgba(255, 96, 10, 0.30)',
            }}
          >
            <span className="material-symbols-outlined fill" style={{ fontSize: '40px' }}>play_arrow</span>
          </button>
          <button
            className="w-12 h-12 flex items-center justify-center transition-all active:scale-90"
            style={{
              color: 'var(--text-mid)',
              background: 'transparent',
              border: 'none',
              borderRadius: '100%',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--primary-pale)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>forward_5</span>
          </button>
        </div>
      </div>

      <div className="w-full" style={{ marginTop: 'var(--space-md)' }}>
        <div
          className="relative flex items-center"
          style={{
            background: 'var(--white)',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-md)',
            boxShadow: '0 4px 24px rgba(12, 26, 29, 0.06)',
          }}
        >
          <input
            type="text"
            placeholder="Ask a question while listening..."
            className="w-full bg-transparent border-none focus:ring-0"
            style={{
              padding: '16px 24px',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '15px',
              color: 'var(--text)',
              outline: 'none',
            }}
          />
          <button
            className="mr-2 p-2 transition-all active:scale-95 flex items-center justify-center"
            style={{
              background: 'var(--primary)',
              color: '#FFFFFF',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <span className="material-symbols-outlined">send</span>
          </button>
        </div>
      </div>

      <div style={{ marginTop: 'var(--space-xl)', marginBottom: 'var(--space-xl)' }}>
        <button
          onClick={() => navigate('/dashboard')}
          className="btn-primary w-full"
          style={{ paddingTop: '18px', paddingBottom: '18px', fontSize: '16px' }}
        >
          Finish Session
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>check</span>
        </button>
      </div>
    </AppLayout>
  );
};

export default AudioSession;
