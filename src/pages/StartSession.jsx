import React, { useRef, useState } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

const MATERIAL_TYPES = [
  { type: 'link',    icon: 'link',           label: 'Add Link' },
  { type: 'pdf',     icon: 'picture_as_pdf', label: 'Upload PDF' },
  { type: 'youtube', icon: 'video_library',  label: 'YouTube Link' },
];

const MATERIAL_META = {
  link:    { icon: 'link',           label: 'Link' },
  pdf:     { icon: 'picture_as_pdf', label: 'PDF' },
  youtube: { icon: 'video_library',  label: 'YouTube' },
};

let _materialSeq = 0;
const nextId = () => `m_${Date.now()}_${++_materialSeq}`;

const isValidUrl = (s) => {
  try {
    const u = new URL(s);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
};

const StartSession = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [topic, setTopic] = useState('');
  const [duration, setDuration] = useState(25);
  const [materials, setMaterials] = useState([]);
  const [activeForm, setActiveForm] = useState(null); // 'link' | 'youtube' | null
  const [draft, setDraft] = useState('');
  const [error, setError] = useState('');

  const handleMaterialButton = (type) => {
    setError('');
    if (type === 'pdf') {
      // Reset and trigger native file picker
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
        fileInputRef.current.click();
      }
      // Close any open inline form so the UI is unambiguous
      setActiveForm(null);
      setDraft('');
      return;
    }
    setActiveForm((prev) => (prev === type ? null : type));
    setDraft('');
  };

  const handleAddDraft = () => {
    const value = draft.trim();
    if (!value || !activeForm) return;
    if (!isValidUrl(value)) {
      setError('Please enter a valid URL starting with http:// or https://');
      return;
    }
    setMaterials((prev) => [
      ...prev,
      { id: nextId(), type: activeForm, value, name: value },
    ]);
    setDraft('');
    setActiveForm(null);
    setError('');
  };

  const handleFiles = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const accepted = [];
    const rejected = [];
    files.forEach((f) => {
      const isPdf = f.type === 'application/pdf' || /\.pdf$/i.test(f.name);
      if (isPdf) {
        accepted.push({
          id: nextId(),
          type: 'pdf',
          value: f,
          name: f.name,
          size: f.size,
        });
      } else {
        rejected.push(f.name);
      }
    });

    if (accepted.length) setMaterials((prev) => [...prev, ...accepted]);
    setError(rejected.length ? `Skipped non-PDF file${rejected.length > 1 ? 's' : ''}: ${rejected.join(', ')}` : '');

    // Reset input so the same file can be re-selected later
    e.target.value = '';
  };

  const removeMaterial = (id) =>
    setMaterials((prev) => prev.filter((m) => m.id !== id));

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/assessment', {
      state: {
        topic: topic.trim(),
        duration,
        materials: materials.map(({ id, type, name }) => ({ id, type, name })),
      },
    });
  };

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

            <form onSubmit={handleSubmit} className="flex flex-col" style={{ gap: 'var(--space-lg)' }}>
              {/* Topic */}
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
                    required
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
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

              {/* Supporting Materials */}
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
                <p
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '13px',
                    fontWeight: 300,
                    lineHeight: 1.6,
                    color: 'var(--text-mid)',
                    margin: 0,
                  }}
                >
                  Add any number of links, PDFs, or YouTube videos. We'll fold them into your learning path.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {MATERIAL_TYPES.map((m) => {
                    const isActive = activeForm === m.type;
                    return (
                      <button
                        key={m.type}
                        type="button"
                        onClick={() => handleMaterialButton(m.type)}
                        className="group flex flex-col items-center justify-center transition-all"
                        style={{
                          padding: '20px 12px',
                          border: isActive ? '1.5px solid var(--primary)' : '1px solid var(--border-light)',
                          borderRadius: 'var(--radius-md)',
                          background: isActive ? 'var(--primary-pale)' : 'var(--white)',
                          cursor: 'pointer',
                          boxShadow: isActive ? '0 0 0 4px var(--primary-pale)' : 'none',
                        }}
                        onMouseEnter={(e) => {
                          if (!isActive) {
                            e.currentTarget.style.borderColor = 'var(--primary)';
                            e.currentTarget.style.background = 'var(--primary-pale)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isActive) {
                            e.currentTarget.style.borderColor = 'var(--border-light)';
                            e.currentTarget.style.background = 'var(--white)';
                          }
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
                    );
                  })}
                </div>

                {/* Hidden file input for PDF picker */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf,.pdf"
                  multiple
                  onChange={handleFiles}
                  style={{ display: 'none' }}
                />

                {/* Inline form for link / youtube */}
                {activeForm && activeForm !== 'pdf' && (
                  <div
                    style={{
                      background: 'var(--primary-pale)',
                      border: '1px solid var(--border-light)',
                      borderRadius: 'var(--radius-md)',
                      padding: 'var(--space-sm)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 'var(--space-xs)',
                    }}
                  >
                    <label
                      htmlFor="material-draft"
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: '11px',
                        fontWeight: 500,
                        letterSpacing: '0.10em',
                        textTransform: 'uppercase',
                        color: 'var(--primary)',
                      }}
                    >
                      {activeForm === 'youtube' ? 'YouTube URL' : 'Link URL'}
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        id="material-draft"
                        type="url"
                        autoFocus
                        placeholder={
                          activeForm === 'youtube'
                            ? 'https://www.youtube.com/watch?v=…'
                            : 'https://example.com/article'
                        }
                        value={draft}
                        onChange={(e) => { setDraft(e.target.value); if (error) setError(''); }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddDraft();
                          } else if (e.key === 'Escape') {
                            setActiveForm(null);
                            setDraft('');
                            setError('');
                          }
                        }}
                        style={{
                          flex: 1,
                          background: 'var(--white)',
                          border: '1px solid var(--border-light)',
                          borderRadius: 'var(--radius-md)',
                          padding: '12px 16px',
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: '14px',
                          color: 'var(--text)',
                          outline: 'none',
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
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={handleAddDraft}
                          className="btn-primary"
                          style={{ padding: '10px 22px', fontSize: '14px' }}
                        >
                          Add
                        </button>
                        <button
                          type="button"
                          onClick={() => { setActiveForm(null); setDraft(''); setError(''); }}
                          className="btn-ghost"
                          style={{ padding: '10px 18px', fontSize: '14px' }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                    {error && (
                      <span
                        style={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: '12px',
                          color: '#BA1A1A',
                        }}
                      >
                        {error}
                      </span>
                    )}
                  </div>
                )}

                {/* PDF-only error (shown when an unsupported file was rejected) */}
                {!activeForm && error && (
                  <span
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: '12px',
                      color: '#BA1A1A',
                    }}
                  >
                    {error}
                  </span>
                )}

                {/* Selected items */}
                {materials.length > 0 && (
                  <div className="flex flex-col" style={{ gap: 'var(--space-xs)', marginTop: 'var(--space-xs)' }}>
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
                      Added ({materials.length})
                    </span>
                    <ul
                      className="flex flex-col"
                      style={{ gap: '8px', listStyle: 'none', padding: 0, margin: 0 }}
                    >
                      {materials.map((m) => {
                        const meta = MATERIAL_META[m.type] || MATERIAL_META.link;
                        return (
                          <li
                            key={m.id}
                            className="flex items-center gap-3"
                            style={{
                              background: 'var(--white)',
                              border: '1px solid var(--border-light)',
                              borderRadius: 'var(--radius-md)',
                              padding: '10px 14px',
                            }}
                          >
                            <span
                              className="material-symbols-outlined shrink-0"
                              style={{ color: 'var(--primary)', fontSize: '20px' }}
                              aria-hidden
                            >
                              {meta.icon}
                            </span>
                            <div className="flex flex-col min-w-0 flex-1">
                              <span
                                className="truncate"
                                style={{
                                  fontFamily: "'DM Sans', sans-serif",
                                  fontSize: '14px',
                                  fontWeight: 500,
                                  color: 'var(--text)',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                }}
                                title={m.name}
                              >
                                {m.name}
                              </span>
                              <span
                                style={{
                                  fontFamily: "'DM Sans', sans-serif",
                                  fontSize: '11px',
                                  color: 'var(--text-soft)',
                                  letterSpacing: '0.06em',
                                  textTransform: 'uppercase',
                                }}
                              >
                                {meta.label}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeMaterial(m.id)}
                              aria-label={`Remove ${m.name}`}
                              className="flex items-center justify-center transition-colors"
                              style={{
                                background: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                color: 'var(--text-soft)',
                                width: '32px',
                                height: '32px',
                                borderRadius: '100%',
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'var(--primary-pale)';
                                e.currentTarget.style.color = 'var(--primary)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.color = 'var(--text-soft)';
                              }}
                            >
                              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>close</span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>

              {/* Focus Duration */}
              <div className="flex flex-col" style={{ gap: 'var(--space-md)' }}>
                <div className="flex justify-between items-end">
                  <label
                    htmlFor="duration"
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
                    {duration}{' '}
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
                    id="duration"
                    type="range"
                    max="45"
                    min="5"
                    step="5"
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value, 10))}
                    className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                    style={{ background: 'var(--primary-dim)', accentColor: 'var(--primary)' }}
                    aria-label="Session focus duration in minutes"
                  />
                  <div
                    className="flex justify-between mt-3"
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: '12px',
                      color: 'var(--text-soft)',
                    }}
                  >
                    {[5, 15, 25, 35, 45].map((t) => (
                      <span
                        key={t}
                        style={{
                          color: duration === t ? 'var(--primary)' : 'var(--text-soft)',
                          fontWeight: duration === t ? 500 : 400,
                        }}
                      >
                        {t}m
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Submit */}
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
                  We'll start with a quick assessment to map your current understanding.
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
