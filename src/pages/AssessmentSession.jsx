import React, { useMemo, useState } from 'react';
import ChatBubble from '../components/ChatBubble';
import { useLocation, useNavigate } from 'react-router-dom';
import { sendChatMessage } from '../api/learningHub';

const AssessmentSession = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const initialSession = location.state?.chatSession;
  const [messages, setMessages] = useState(initialSession?.messages || []);
  const [draft, setDraft] = useState('');
  const [error, setError] = useState('');
  const [isSending, setIsSending] = useState(false);

  const sessionTitle = useMemo(() => {
    return location.state?.topic?.trim() || initialSession?.source_stats?.filename || 'Learning Session';
  }, [initialSession, location.state]);

  const handleSend = async () => {
    const message = draft.trim();
    if (!message || !initialSession?.session_id || isSending) return;

    const optimisticUserMessage = {
      id: `local_${Date.now()}`,
      role: 'user',
      content_markdown: message,
      created_at: new Date().toISOString(),
    };

    setMessages((current) => [...current, optimisticUserMessage]);
    setDraft('');
    setError('');
    setIsSending(true);

    try {
      const response = await sendChatMessage({
        sessionId: initialSession.session_id,
        message,
      });
      setMessages((current) => [...current, response.message]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send the message.');
    } finally {
      setIsSending(false);
    }
  };

  if (!initialSession) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)', color: 'var(--text)', padding: 'var(--space-md)' }}>
        <div className="card" style={{ maxWidth: '520px', padding: 'var(--space-lg)' }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '32px', margin: 0, marginBottom: 'var(--space-sm)' }}>
            No active session
          </h1>
          <p style={{ fontFamily: "'DM Sans', sans-serif", color: 'var(--text-mid)', lineHeight: 1.7 }}>
            Upload a PDF first so FocusPath can generate notes and open the chat.
          </p>
          <button type="button" onClick={() => navigate('/start-session')} className="btn-primary">
            Start Session
          </button>
        </div>
      </div>
    );
  }

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
        <header style={{ marginBottom: 'var(--space-lg)' }}>
          <span className="section-label" style={{ display: 'block', marginBottom: 'var(--space-xs)' }}>Document Chat</span>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(32px, 4.5vw, 48px)',
              fontWeight: 900,
              lineHeight: 1.05,
              color: 'var(--text)',
              margin: 0,
              marginBottom: 'var(--space-sm)',
            }}
          >
            {sessionTitle}
          </h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', color: 'var(--text-mid)', margin: 0 }}>
            Ask follow-up questions about the uploaded PDF.
          </p>
        </header>

        <div className="flex flex-col" style={{ gap: 'var(--space-lg)', paddingBottom: 'var(--space-lg)' }}>
          {messages.map((message) => (
            <ChatBubble
              key={message.id}
              isUser={message.role === 'user'}
              role="Tutor"
              message={message.content_markdown}
            />
          ))}
          {isSending && <ChatBubble message="Thinking..." role="Tutor" />}
          {error && (
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: '#BA1A1A', margin: 0 }}>
              {error}
            </p>
          )}
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
              placeholder="Ask about this PDF..."
              rows="1"
              className="w-full resize-none"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
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
                onClick={handleSend}
                disabled={isSending || !draft.trim()}
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
