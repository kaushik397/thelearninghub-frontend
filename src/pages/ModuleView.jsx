import React from 'react';
import AppLayout from '../layouts/AppLayout';
import { useNavigate } from 'react-router-dom';

const ModuleView = () => {
  const navigate = useNavigate();
  return (
    <AppLayout title="FocusPath">
      <div style={{ marginBottom: 'var(--space-lg)' }}>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: '66%' }}></div>
        </div>
      </div>

      <section style={{ marginBottom: 'var(--space-lg)' }}>
        <span className="section-label" style={{ display: 'block', marginBottom: 'var(--space-xs)' }}>Module 02</span>
        <h2
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(32px, 4.5vw, 48px)',
            fontWeight: 900,
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
            color: 'var(--text)',
            margin: 0,
            marginBottom: 'var(--space-sm)',
          }}
        >
          Probability <em style={{ color: 'var(--primary)', fontStyle: 'italic' }}>Theory.</em>
        </h2>
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '17px',
            fontWeight: 300,
            lineHeight: 1.7,
            color: 'var(--text-mid)',
            margin: 0,
            marginBottom: 'var(--space-lg)',
            maxWidth: '560px',
          }}
        >
          Mastering the language of uncertainty and randomness.
        </p>

        <div
          className="relative w-full aspect-video overflow-hidden group"
          style={{
            borderRadius: 'var(--radius-lg)',
            background: 'var(--dark)',
            border: '1px solid var(--border-light)',
            boxShadow: '0 16px 40px rgba(12, 26, 29, 0.10)',
            marginBottom: 'var(--space-md)',
          }}
        >
          <img
            className="w-full h-full object-cover opacity-80"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAU1jEtu-Gmmy0npC_GI4TDP88kwrObGf_iSbEsBD-O0cNXw6Zm-KVrQ90nUlBILfnDeOPyp0e1Qu_qkwgqA12KhwfQavTNMZzUiyNU2uRNNj0NGbFmSLNIkgL8F241t6sw0nOv59ZkUmIIUeBkz4ox0TvRDG4hZmVKNyWmjM71KRkjHzW5XLE_rMS5ITy2Czhp9aQ4ikhhNrwmZMZiRbGMESXkzluA8xkd4vgGnicW4NWu7XH4BPpa-GbbRGM_7PU5ftzEbZ6PoRs"
            alt="Probability Theory"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              className="w-20 h-20 flex items-center justify-center transition-transform active:scale-95"
              style={{
                background: 'var(--primary)',
                color: '#FFFFFF',
                borderRadius: '100%',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 0 0 8px rgba(255, 96, 10, 0.20), 0 16px 40px rgba(12, 26, 29, 0.30)',
              }}
            >
              <span className="material-symbols-outlined fill" style={{ fontSize: '40px' }}>play_arrow</span>
            </button>
          </div>
          <div
            className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity"
            style={{
              background: 'linear-gradient(to top, rgba(12, 26, 29, 0.9), transparent)',
            }}
          >
            <div
              className="flex items-center gap-4"
              style={{
                color: 'var(--cream)',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '12px',
              }}
            >
              <span className="material-symbols-outlined">pause</span>
              <div className="flex-grow h-1 rounded-full overflow-hidden" style={{ background: 'rgba(253, 248, 216, 0.30)' }}>
                <div style={{ background: 'var(--primary)', width: '33%', height: '100%' }}></div>
              </div>
              <span>04:12 / 12:45</span>
              <span className="material-symbols-outlined">fullscreen</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3" style={{ marginBottom: 'var(--space-md)' }}>
          {[
            { time: "00:00 - 02:30", title: "Defining Randomness", active: true },
            { time: "02:30 - 07:15", title: "The Sample Space", active: false },
            { time: "07:15 - 12:45", title: "Independent Events", active: false }
          ].map((chap, i) => (
            <div
              key={i}
              className="cursor-pointer transition-all"
              style={{
                padding: '14px 16px',
                borderRadius: 'var(--radius-md)',
                background: chap.active ? 'var(--white)' : 'rgba(255, 255, 255, 0.6)',
                border: chap.active ? '1.5px solid var(--primary)' : '1px solid var(--border-light)',
                boxShadow: chap.active ? '0 4px 12px rgba(255, 96, 10, 0.10)' : 'none',
              }}
            >
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '11px',
                  fontWeight: 500,
                  letterSpacing: '0.10em',
                  textTransform: 'uppercase',
                  color: chap.active ? 'var(--primary)' : 'var(--text-soft)',
                  margin: 0,
                  marginBottom: '4px',
                }}
              >
                {chap.time}
              </p>
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '14px',
                  fontWeight: 500,
                  lineHeight: 1.3,
                  color: 'var(--text)',
                  margin: 0,
                }}
              >
                {chap.title}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section
        className="card"
        style={{ padding: 'var(--space-md) 28px', marginBottom: 'var(--space-md)' }}
      >
        <div className="flex items-center gap-3" style={{ marginBottom: 'var(--space-sm)' }}>
          <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>auto_awesome</span>
          <h3
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '22px',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: 'var(--text)',
              margin: 0,
            }}
          >
            3-Point Summary
          </h3>
        </div>
        <ul className="flex flex-col" style={{ gap: 'var(--space-sm)' }}>
          {[
            "Probability measures the likelihood of an event on a scale from 0 (impossible) to 1 (certainty).",
            "The Sample Space is the set of all possible outcomes of a random experiment.",
            "Events are independent if the outcome of one does not affect the probability of the other."
          ].map((point, i) => (
            <li key={i} className="flex gap-4">
              <span
                className="flex-shrink-0 w-8 h-8 flex items-center justify-center"
                style={{
                  background: 'var(--primary-dim)',
                  color: 'var(--primary)',
                  borderRadius: '100%',
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 700,
                  fontSize: '15px',
                }}
              >
                {i + 1}
              </span>
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '15px',
                  fontWeight: 300,
                  lineHeight: 1.7,
                  color: 'var(--text-mid)',
                  margin: 0,
                }}
              >
                {point}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <div
        className="flex items-center gap-2"
        style={{
          background: 'var(--white)',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-md)',
          padding: '8px',
          marginBottom: 'var(--space-md)',
          boxShadow: '0 4px 24px rgba(12, 26, 29, 0.06)',
        }}
      >
        <input
          type="text"
          placeholder="Ask about this video..."
          className="flex-grow border-none focus:ring-0"
          style={{
            background: 'transparent',
            padding: '8px 12px',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '15px',
            color: 'var(--text)',
            outline: 'none',
          }}
        />
        <button
          className="flex items-center justify-center w-10 h-10 transition-transform active:scale-95"
          style={{
            background: 'var(--primary)',
            color: '#FFFFFF',
            borderRadius: 'var(--radius-sm)',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>send</span>
        </button>
      </div>

      <button
        onClick={() => navigate('/concept')}
        className="btn-primary w-full"
        style={{ paddingTop: '18px', paddingBottom: '18px', fontSize: '16px' }}
      >
        Continue to Concept
        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>arrow_forward</span>
      </button>
    </AppLayout>
  );
};

export default ModuleView;
