import React from 'react';
import ProgressBar from '../components/ProgressBar';
import ChatBubble from '../components/ChatBubble';
import { useNavigate } from 'react-router-dom';

const AssessmentSession = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      <header
        className="fixed top-0 left-0 w-full z-50"
        style={{
          background: 'rgba(253, 248, 216, 0.85)',
          WebkitBackdropFilter: 'blur(24px)',
          backdropFilter: 'blur(24px)',
          borderBottom: '1px solid var(--border-light)',
        }}
      >
        <div className="flex justify-between items-center h-16 px-6 w-full max-w-[1180px] mx-auto">
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 700,
              fontSize: '22px',
              letterSpacing: '-0.02em',
              color: 'var(--text)',
              margin: 0,
            }}
          >
            Focus<span style={{ color: 'var(--primary)' }}>Path</span>
          </h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 rounded-full transition-all active:opacity-80"
              style={{
                color: 'var(--primary)',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--primary-pale)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>
      </header>

      <main
        className="mx-auto max-w-[800px]"
        style={{
          paddingTop: 'var(--space-2xl)',
          paddingBottom: 'var(--space-3xl)',
          paddingLeft: 'var(--space-md)',
          paddingRight: 'var(--space-md)',
        }}
      >
        <div style={{ marginBottom: 'var(--space-xl)' }}>
          <ProgressBar progress={83} label="Session Progress" />
          <div className="mt-2 w-full flex justify-end">
            <span
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '12px',
                fontWeight: 500,
                color: 'var(--text-mid)',
              }}
            >
              5 of 6 units
            </span>
          </div>
        </div>

        <div className="flex flex-col" style={{ gap: 'var(--space-lg)', paddingBottom: 'var(--space-lg)' }}>
          <ChatBubble
            message="That's a great observation about the ecosystem. Let's explore that further. If we were to remove a primary predator from this chain, how do you think it would ripple down to the plant life?"
          />
          <ChatBubble
            isUser={true}
            message="I think the herbivore population would explode because nothing is hunting them. Then they would eat all the plants, which would eventually lead to their own starvation too."
          />
          <div className="flex flex-col items-start gap-2 max-w-[85%]">
            <div className="flex items-center gap-2 px-1">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center"
                style={{ background: 'var(--primary-dim)' }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: '14px', color: 'var(--primary)' }}
                >
                  psychology
                </span>
              </div>
              <span
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '11px',
                  fontWeight: 500,
                  letterSpacing: '0.10em',
                  textTransform: 'uppercase',
                  color: 'var(--text-soft)',
                }}
              >
                Tutor
              </span>
            </div>
            <div className="flex flex-col w-full" style={{ gap: 'var(--space-sm)' }}>
              <div
                style={{
                  background: 'var(--white)',
                  padding: '20px 24px',
                  borderRadius: 'var(--radius-lg)',
                  borderTopLeftRadius: '6px',
                  border: '1px solid var(--border-light)',
                  color: 'var(--text)',
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '15px',
                  fontWeight: 300,
                  lineHeight: 1.7,
                  boxShadow: '0 4px 16px rgba(12, 26, 29, 0.04)',
                }}
              >
                Spot on! You've identified the "trophic cascade" effect. Now, let's test your understanding. Which of these is most likely to happen to the water quality in a nearby stream if the plant life (riparian buffer) is destroyed by overgrazing?
              </div>
              <div className="flex flex-col w-full pl-2" style={{ gap: 'var(--space-xs)' }}>
                {[
                  "Sediment levels increase, making the water more turbid.",
                  "Water temperature decreases due to loss of shade.",
                  "Dissolved oxygen increases because of less organic decay."
                ].map((opt, i) => (
                  <button
                    key={i}
                    className="w-full text-left transition-all active:scale-[0.99] group flex gap-3 items-center"
                    style={{
                      padding: '16px 20px',
                      background: 'var(--white)',
                      border: '1px solid var(--border-light)',
                      borderRadius: 'var(--radius-md)',
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
                    <div
                      className="w-6 h-6 flex items-center justify-center shrink-0"
                      style={{
                        border: '2px solid var(--border-light)',
                        borderRadius: '100%',
                      }}
                    >
                      <div
                        className="w-2.5 h-2.5 opacity-0 group-focus:opacity-100"
                        style={{ background: 'var(--primary)', borderRadius: '100%' }}
                      ></div>
                    </div>
                    <span
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: '15px',
                        fontWeight: 400,
                        color: 'var(--text)',
                      }}
                    >
                      {opt}
                    </span>
                  </button>
                ))}
                <button
                  className="w-full text-left transition-all active:scale-[0.99] flex gap-3 items-center group"
                  style={{
                    padding: '16px 20px',
                    background: 'transparent',
                    border: '2px dashed var(--border-light)',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    marginTop: 'var(--space-xs)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--primary)';
                    e.currentTarget.style.background = 'var(--primary-pale)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-light)';
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <span className="material-symbols-outlined" style={{ color: 'var(--text-mid)' }}>help</span>
                  <span
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: '15px',
                      fontWeight: 500,
                      color: 'var(--text-mid)',
                    }}
                  >
                    I'm not sure, can you explain this part?
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <div
        className="fixed bottom-0 left-0 w-full pb-8 pt-4"
        style={{
          background: 'rgba(253, 248, 216, 0.88)',
          WebkitBackdropFilter: 'blur(24px)',
          backdropFilter: 'blur(24px)',
          borderTop: '1px solid var(--border-light)',
        }}
      >
        <div
          className="max-w-[800px] mx-auto"
          style={{ paddingLeft: 'var(--space-md)', paddingRight: 'var(--space-md)' }}
        >
          <div className="relative group">
            <textarea
              placeholder="Reflect on your answer..."
              rows="1"
              className="w-full resize-none"
              style={{
                background: 'var(--white)',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-md)',
                padding: '16px 96px 16px 24px',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '15px',
                color: 'var(--text)',
                outline: 'none',
                boxShadow: '0 4px 24px rgba(12, 26, 29, 0.06)',
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
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <button
                aria-label="Voice input"
                className="p-2 transition-colors flex items-center justify-center rounded-lg"
                style={{
                  color: 'var(--text-mid)',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--primary-pale)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <span className="material-symbols-outlined">mic</span>
              </button>
              <button
                aria-label="Send message"
                className="w-10 h-10 flex items-center justify-center transition-all active:scale-95"
                style={{
                  background: 'var(--primary)',
                  color: '#FFFFFF',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                <span className="material-symbols-outlined">arrow_upward</span>
              </button>
            </div>
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
            Focusing on Conceptual Synthesis
          </p>
        </div>
      </div>
    </div>
  );
};

export default AssessmentSession;
