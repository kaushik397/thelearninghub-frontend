import { useEffect, useMemo, useState } from 'react';
import ChatBubble from '../components/ChatBubble';
import { useLocation, useNavigate } from 'react-router-dom';
import { sendChatMessage } from '../api/learningHub';
import { logProgressEvent, updateLearningTrackProgress } from '../api/userData';
import { updateSavedNotesPart } from '../api/sessionResume';
import { useAuth } from '../auth/auth-context';

function splitNotesIntoParts(markdown) {
  const normalized = markdown.trim();
  if (!normalized) return [];

  const sections = normalized
    .split(/\n(?=#{1,3}\s|\*\*[^*\n]+:\*\*|[A-Z][^\n]{3,80}:\s*$)/g)
    .map((part) => part.trim())
    .filter(Boolean);

  const sourceParts = sections.length > 1 ? sections : normalized.split(/\n\s*\n/g).map((part) => part.trim()).filter(Boolean);
  const chunks = [];
  let current = '';
  const targetChars = 1400;

  sourceParts.forEach((part) => {
    const next = current ? `${current}\n\n${part}` : part;
    if (next.length > targetChars && current) {
      chunks.push(current);
      current = part;
    } else {
      current = next;
    }
  });

  if (current) chunks.push(current);
  return chunks.length ? chunks : [normalized];
}

const AssessmentSession = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const initialSession = location.state?.chatSession;
  const learningTrack = location.state?.learningTrack;
  const sourceMaterial = location.state?.sourceMaterial;
  const generatedNotes = location.state?.generatedNotes;
  const reviewMode = Boolean(location.state?.reviewMode);
  const restoredFromSupabase = Boolean(location.state?.restoredFromSupabase);
  const [messages, setMessages] = useState(initialSession?.messages || []);
  const [notesPartIndex, setNotesPartIndex] = useState(location.state?.notesPartIndex || 0);
  const [draft, setDraft] = useState('');
  const [error, setError] = useState('');
  const [isSending, setIsSending] = useState(false);

  const sessionTitle = useMemo(() => {
    return location.state?.topic?.trim() || initialSession?.source_stats?.filename || 'Learning Session';
  }, [initialSession, location.state]);

  const notesParts = useMemo(() => {
    const firstMessage = messages[0];
    if (!firstMessage || firstMessage.role !== 'assistant') return [];
    return splitNotesIntoParts(firstMessage.content_markdown);
  }, [messages]);

  const visibleMessages = useMemo(() => {
    if (!notesParts.length || reviewMode) return messages;

    return [
      {
        ...messages[0],
        content_markdown: notesParts[notesPartIndex] || notesParts[0],
      },
      ...messages.slice(1),
    ];
  }, [messages, notesPartIndex, notesParts, reviewMode]);

  const hasNextNotesPart = notesPartIndex < notesParts.length - 1;
  const hasPreviousNotesPart = notesPartIndex > 0;
  const notesProgressPercent = notesParts.length
    ? Math.round(((notesPartIndex + 1) / notesParts.length) * 100)
    : 0;

  useEffect(() => {
    setNotesPartIndex(location.state?.notesPartIndex || 0);
  }, [initialSession?.session_id]);

  useEffect(() => {
    if (!user?.id || !learningTrack?.id || !notesParts.length) return;

    const progressPercent = Math.round(((notesPartIndex + 1) / notesParts.length) * 100);
    updateSavedNotesPart(user.id, learningTrack.id, notesPartIndex);
    updateLearningTrackProgress({
      userId: user.id,
      trackId: learningTrack.id,
      progressPercent,
    }).catch((err) => {
      console.warn('Could not update learning track progress', err);
    });
  }, [learningTrack?.id, notesPartIndex, notesParts.length, user?.id]);

  const handleNextPart = async () => {
    if (!hasNextNotesPart) return;

    const nextIndex = notesPartIndex + 1;
    setNotesPartIndex(nextIndex);

    if (!user?.id) return;

    try {
      const progressPercent = Math.round(((nextIndex + 1) / notesParts.length) * 100);
      await logProgressEvent({
        userId: user.id,
        eventType: 'notes_part_viewed',
        eventData: {
          chat_session_id: initialSession.session_id,
          learning_track_id: learningTrack?.id,
          source_filename: initialSession.source_stats?.filename,
          part_index: nextIndex,
          part_count: notesParts.length,
          progress_percent: progressPercent,
        },
      });
    } catch (err) {
      console.warn('Could not save notes progress event', err);
    }
  };

  const handlePreviousPart = () => {
    if (!hasPreviousNotesPart) return;
    const previousIndex = Math.max(0, notesPartIndex - 1);
    setNotesPartIndex(previousIndex);
  };

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
        materialId: sourceMaterial?.id,
        notesMarkdown: generatedNotes?.notes_markdown || messages[0]?.content_markdown,
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
            {reviewMode
              ? 'Review the full notes generated from your material.'
              : restoredFromSupabase
              ? 'Resume your saved notes and ask follow-up questions through Pinecone retrieval.'
              : 'Ask follow-up questions about the uploaded PDF.'}
          </p>
        </header>

        <div className="flex flex-col" style={{ gap: 'var(--space-lg)', paddingBottom: 'var(--space-lg)' }}>
          {reviewMode && (
            <div
              className="flex items-center justify-between gap-4"
              style={{
                background: 'rgba(255, 255, 255, 0.62)',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-md)',
                padding: '12px 14px',
              }}
            >
              <span className="section-label">Full Notes Review</span>
              <button
                className="btn-secondary"
                onClick={() => navigate('/assessment', { state: { ...location.state, reviewMode: false } })}
                style={{ padding: '8px 14px', fontSize: '13px' }}
              >
                Back to Parts
              </button>
            </div>
          )}

          {!reviewMode && notesParts.length > 1 && (
            <div
              className="flex items-center gap-4"
              style={{
                background: 'rgba(255, 255, 255, 0.62)',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-md)',
                padding: '12px 14px',
              }}
            >
              <span className="section-label" style={{ whiteSpace: 'nowrap' }}>
                Part {notesPartIndex + 1} of {notesParts.length}
              </span>
              <div className="progress-track flex-grow" style={{ height: '4px' }}>
                <div className="progress-fill" style={{ width: `${notesProgressPercent}%` }}></div>
              </div>
              <span
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '12px',
                  color: 'var(--text-mid)',
                  whiteSpace: 'nowrap',
                }}
              >
                {notesProgressPercent}%
              </span>
            </div>
          )}

          {visibleMessages.map((message) => (
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
              placeholder={restoredFromSupabase ? 'Ask about these saved notes...' : 'Ask about this PDF...'}
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
                padding: !reviewMode && notesParts.length > 1 ? '16px 230px 16px 24px' : '16px 96px 16px 24px',
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
              {!reviewMode && notesParts.length > 1 && (
                <>
                  <button
                    aria-label="Previous notes part"
                    onClick={handlePreviousPart}
                    disabled={!hasPreviousNotesPart}
                    className="h-10 flex items-center justify-center gap-1 transition-all active:scale-95"
                    style={{
                      background: hasPreviousNotesPart ? 'var(--primary-pale)' : 'transparent',
                      color: hasPreviousNotesPart ? 'var(--primary)' : 'var(--text-soft)',
                      border: '1px solid var(--border-light)',
                      borderRadius: 'var(--radius-sm)',
                      cursor: hasPreviousNotesPart ? 'pointer' : 'default',
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: '13px',
                      fontWeight: 700,
                      padding: '0 10px',
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>chevron_left</span>
                    Prev
                  </button>
                  <button
                    aria-label="Next notes part"
                    onClick={handleNextPart}
                    disabled={!hasNextNotesPart}
                    className="h-10 flex items-center justify-center gap-1 transition-all active:scale-95"
                    style={{
                      background: hasNextNotesPart ? 'var(--primary-pale)' : 'transparent',
                      color: hasNextNotesPart ? 'var(--primary)' : 'var(--text-soft)',
                      border: '1px solid var(--border-light)',
                      borderRadius: 'var(--radius-sm)',
                      cursor: hasNextNotesPart ? 'pointer' : 'default',
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: '13px',
                      fontWeight: 700,
                      padding: '0 10px',
                    }}
                  >
                    Next
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>chevron_right</span>
                  </button>
                </>
              )}
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
