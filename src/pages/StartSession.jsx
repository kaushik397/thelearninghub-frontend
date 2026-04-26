import React from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

const StartSession = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      <Navbar title="FocusPath" />
      <main
        className="min-h-screen flex flex-col items-center"
        style={{
          paddingTop: 'var(--space-xl)',
          paddingBottom: 'var(--space-xl)',
          paddingLeft: 'var(--space-md)',
          paddingRight: 'var(--space-md)',
        }}
      >
        <div className="w-full max-w-[680px]">
          <nav className="flex items-center" style={{ marginBottom: 'var(--space-md)' }}>
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center transition-colors group"
              style={{
                color: 'var(--text-mid)',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '14px',
                fontWeight: 500,
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '20px', marginRight: '6px' }}>arrow_back</span>
              Back to Dashboard
            </button>
          </nav>

          <div
            style={{
              background: 'var(--white)',
              borderRadius: 'var(--radius-lg)',
              padding: 'clamp(28px, 4vw, 48px)',
              border: '1px solid var(--border-light)',
              boxShadow: '0 4px 24px rgba(12, 26, 29, 0.06)',
            }}
          >
            <header style={{ marginBottom: 'var(--space-lg)' }}>
              <span className="section-label" style={{ display: 'block', marginBottom: 'var(--space-sm)' }}>New Session</span>
              <h1
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
                What would you like <em style={{ color: 'var(--primary)', fontStyle: 'italic' }}>to learn today?</em>
              </h1>
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '16px',
                  fontWeight: 300,
                  lineHeight: 1.7,
                  color: 'var(--text-mid)',
                  margin: 0,
                  maxWidth: '560px',
                }}
              >
                Define your focus area and session parameters to begin.
              </p>
            </header>

            <form
              onSubmit={(e) => { e.preventDefault(); navigate('/module'); }}
              className="flex flex-col"
              style={{ gap: 'var(--space-lg)' }}
            >
              <div className="flex flex-col" style={{ gap: 'var(--space-xs)' }}>
                <label
                  htmlFor="topic"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '11px',
                    fontWeight: 500,
                    letterSpacing: '0.10em',
                    textTransform: 'uppercase',
                    color: 'var(--primary)',
                  }}
                >
                  Topic
                </label>
                <div className="relative">
                  <input
                    id="topic"
                    placeholder="e.g. Cognitive Psychology Basics"
                    type="text"
                    style={{
                      width: '100%',
                      background: 'var(--white)',
                      border: '1px solid var(--border-light)',
                      borderRadius: 'var(--radius-md)',
                      padding: '14px 48px 14px 18px',
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: '15px',
                      color: 'var(--text)',
                      outline: 'none',
                      transition: 'border-color 0.2s, box-shadow 0.2s',
                    }}
                    onFocus={(e) => {
                      e.target.style.border = '1.5px solid var(--primary)';
                      e.target.style.boxShadow = '0 0 0 4px var(--primary-pale)';
                    }}
                    onBlur={(e) => {
                      e.target.style.border = '1px solid var(--border-light)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                  <span
                    className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2"
                    style={{ color: 'var(--text-soft)' }}
                  >
                    edit_note
                  </span>
                </div>
              </div>

              <div className="flex flex-col" style={{ gap: 'var(--space-sm)' }}>
                <h2
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '22px',
                    fontWeight: 700,
                    letterSpacing: '-0.02em',
                    color: 'var(--text)',
                    margin: 0,
                  }}
                >
                  Supporting Materials{' '}
                  <span
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: '14px',
                      fontWeight: 400,
                      color: 'var(--text-soft)',
                    }}
                  >
                    (Optional)
                  </span>
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { icon: 'link', label: 'Add Link' },
                    { icon: 'picture_as_pdf', label: 'Upload PDF' },
                    { icon: 'upload_file', label: 'Upload File' },
                    { icon: 'video_library', label: 'YouTube Link' }
                  ].map(m => (
                    <button
                      key={m.label}
                      type="button"
                      className="group flex flex-col items-center justify-center transition-all"
                      style={{
                        padding: '20px 12px',
                        border: '1px solid var(--border-light)',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--white)',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'var(--primary)';
                        e.currentTarget.style.background = 'var(--primary-pale)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'var(--border-light)';
                        e.currentTarget.style.background = 'var(--white)';
                      }}
                    >
                      <span
                        className="material-symbols-outlined"
                        style={{ color: 'var(--primary)', marginBottom: '8px' }}
                      >
                        {m.icon}
                      </span>
                      <span
                        style={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: '12px',
                          fontWeight: 500,
                          color: 'var(--text-mid)',
                        }}
                      >
                        {m.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col" style={{ gap: 'var(--space-md)' }}>
                <div className="flex justify-between items-end">
                  <label
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: '20px',
                      fontWeight: 700,
                      letterSpacing: '-0.02em',
                      color: 'var(--text)',
                    }}
                  >
                    Session Focus Duration
                  </label>
                  <span
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: '32px',
                      fontWeight: 900,
                      letterSpacing: '-0.03em',
                      color: 'var(--primary)',
                      lineHeight: 1,
                    }}
                  >
                    25{' '}
                    <span
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: '14px',
                        fontWeight: 400,
                        color: 'var(--text-mid)',
                      }}
                    >
                      mins
                    </span>
                  </span>
                </div>
                <div className="relative px-2">
                  <input
                    type="range"
                    max="45"
                    min="5"
                    defaultValue="25"
                    className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                    style={{ background: 'var(--primary-dim)', accentColor: 'var(--primary)' }}
                  />
                  <div
                    className="flex justify-between mt-3"
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: '12px',
                      color: 'var(--text-soft)',
                    }}
                  >
                    {['5m', '15m', '25m', '35m', '45m'].map(t => <span key={t}>{t}</span>)}
                  </div>
                </div>
              </div>

              <div
                className="flex flex-col items-center"
                style={{ gap: 'var(--space-sm)', paddingTop: 'var(--space-sm)' }}
              >
                <button
                  type="submit"
                  className="btn-primary w-full"
                  style={{ paddingTop: '18px', paddingBottom: '18px', fontSize: '16px' }}
                >
                  <span className="material-symbols-outlined fill" style={{ fontSize: '20px' }}>bolt</span>
                  Start Learning Session
                </button>
                <p
                  className="text-center"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '12px',
                    color: 'var(--text-soft)',
                    margin: 0,
                  }}
                >
                  Your personalized roadmap will be generated instantly based on these settings.
                </p>
              </div>
            </form>
          </div>

          <div className="text-center" style={{ marginTop: 'var(--space-md)' }}>
            <div
              className="inline-flex items-center gap-2"
              style={{
                background: 'var(--primary-pale)',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-pill)',
                padding: '8px 16px',
              }}
            >
              <span
                className="material-symbols-outlined fill"
                style={{ fontSize: '18px', color: 'var(--primary)' }}
              >
                lightbulb
              </span>
              <span
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '13px',
                  color: 'var(--text-mid)',
                }}
              >
                Tip: 25 minutes is the ideal Pomodoro window for deep focus.
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StartSession;
