import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProgressBar from '../components/ProgressBar';

const ConceptView = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      <header
        className="fixed w-full z-50"
        style={{
          background: 'rgba(253, 248, 216, 0.85)',
          WebkitBackdropFilter: 'blur(24px)',
          backdropFilter: 'blur(24px)',
          borderBottom: '1px solid var(--border-light)',
        }}
      >
        <div className="flex justify-between items-center h-16 px-6 w-full max-w-[1180px] mx-auto">
          <span
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 700,
              fontSize: '22px',
              letterSpacing: '-0.02em',
              color: 'var(--text)',
            }}
          >
            Focus<span style={{ color: 'var(--primary)' }}>Path</span>
          </span>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="material-symbols-outlined transition-transform active:scale-95"
              style={{ color: 'var(--primary)', cursor: 'pointer', background: 'transparent', border: 'none' }}
            >
              close
            </button>
          </div>
        </div>
      </header>

      <main
        className="w-full max-w-[800px] mx-auto min-h-screen flex flex-col items-center"
        style={{
          paddingTop: 'var(--space-2xl)',
          paddingBottom: 'var(--space-3xl)',
          paddingLeft: 'var(--space-md)',
          paddingRight: 'var(--space-md)',
        }}
      >
        <div className="w-full">
          <ProgressBar progress={8.33} label="Probability Theory: Introduction" />
        </div>
        <div className="mt-2 w-full flex justify-end" style={{ marginBottom: 'var(--space-xl)' }}>
          <span
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '12px',
              fontWeight: 500,
              color: 'var(--text-mid)',
            }}
          >
            1 of 12 concepts
          </span>
        </div>

        <div
          className="w-full flex flex-col justify-center"
          style={{
            background: 'var(--white)',
            borderRadius: 'var(--radius-lg)',
            padding: 'clamp(28px, 4vw, 48px)',
            border: '1px solid var(--border-light)',
            boxShadow: '0 4px 24px rgba(12, 26, 29, 0.06)',
            marginBottom: 'var(--space-xl)',
            minHeight: '320px',
          }}
        >
          <span className="section-label" style={{ display: 'block', marginBottom: 'var(--space-sm)' }}>Concept</span>
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(36px, 5vw, 56px)',
              fontWeight: 900,
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
              color: 'var(--text)',
              margin: 0,
              marginBottom: 'var(--space-md)',
            }}
          >
            The <em style={{ color: 'var(--primary)', fontStyle: 'italic' }}>Sample Space.</em>
          </h1>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '18px',
              fontWeight: 300,
              lineHeight: 1.7,
              color: 'var(--text-mid)',
              margin: 0,
              maxWidth: '560px',
            }}
          >
            In probability theory, the sample space of an experiment is the set of all possible outcomes. For example, if you toss a single coin, the sample space contains two outcomes: heads and tails.
          </p>
          <div className="flex flex-col items-center" style={{ marginTop: 'var(--space-lg)' }}>
            <div
              className="w-full max-w-[440px] aspect-video overflow-hidden flex items-center justify-center"
              style={{
                background: 'var(--bg-warm)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-light)',
              }}
            >
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBiDz2TG7XseFOCHCRhca5GFYtcXhNqKhOFH34tcE0ubRmN-XpNYHIl8uX45OXy3i132XIa2nhjPNy6BAhgT-yb_KHnsGLVg1A0kqrM9EZ2AW3hvmKKVrmtPPBK3WTIZfkl9vPUINMulXbMMbGgPBwWcLP8Ar_-8e_JSrzcd3e4lstWCuY3YuT7vQATK1856x8uoC9rB1__sIvxP5CjNUiuHeJxkRuHT-Z4eyne9TM_siw_5_psLjX0d5mjlFvGesfAigZRiLJp9g8"
                alt="Coin toss"
                className="w-full h-full object-cover mix-blend-multiply opacity-80"
              />
            </div>
            <p
              className="text-center"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '11px',
                fontWeight: 500,
                letterSpacing: '0.10em',
                textTransform: 'uppercase',
                color: 'var(--text-soft)',
                marginTop: 'var(--space-sm)',
                marginBottom: 0,
              }}
            >
              Fig 1.1 — Visualizing outcomes {"{Heads, Tails}"}
            </p>
          </div>
        </div>

        <div className="w-full" style={{ marginBottom: 'var(--space-xl)' }}>
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Ask a question about this concept..."
              className="w-full"
              style={{
                background: 'var(--white)',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-md)',
                padding: '16px 56px 16px 24px',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '15px',
                color: 'var(--text)',
                boxShadow: '0 4px 24px rgba(12, 26, 29, 0.06)',
                outline: 'none',
                transition: 'border-color 0.2s, box-shadow 0.2s',
              }}
              onFocus={(e) => {
                e.target.style.border = '1.5px solid var(--primary)';
                e.target.style.boxShadow = '0 0 0 4px var(--primary-pale), 0 4px 24px rgba(12, 26, 29, 0.06)';
              }}
              onBlur={(e) => {
                e.target.style.border = '1px solid var(--border-light)';
                e.target.style.boxShadow = '0 4px 24px rgba(12, 26, 29, 0.06)';
              }}
            />
            <button
              className="absolute right-2 p-2 transition-transform"
              style={{
                color: 'var(--primary)',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <span className="material-symbols-outlined fill">send</span>
            </button>
          </div>
        </div>

        <div className="w-full mt-auto">
          <button
            onClick={() => navigate('/audio')}
            className="btn-primary w-full"
            style={{ paddingTop: '18px', paddingBottom: '18px', fontSize: '16px' }}
          >
            Continue
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>arrow_forward</span>
          </button>
        </div>
      </main>
    </div>
  );
};

export default ConceptView;
