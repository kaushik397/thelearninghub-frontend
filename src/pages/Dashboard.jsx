import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout';
import { getDashboardData, getLatestSavedNotesForTrack } from '../api/userData';
import { getSavedLearningSession } from '../api/sessionResume';
import { useAuth } from '../auth/auth-context';

function formatRelativeTime(value) {
  if (!value) return 'Not started yet';

  const date = new Date(value);
  const diffMs = Date.now() - date.getTime();
  const minutes = Math.max(1, Math.floor(diffMs / 60000));

  if (minutes < 60) return `${minutes} min ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;

  const days = Math.floor(hours / 24);
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;

  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function EmptyLibraryCard({ navigate }) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => navigate('/start-session')}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate('/start-session'); } }}
      className="group flex flex-col items-center justify-center text-center transition-all cursor-pointer"
      style={{
        background: 'transparent',
        borderRadius: 'var(--radius-lg)',
        border: '2px dashed var(--border-active)',
        padding: 'var(--space-md) 28px',
        minHeight: '180px',
      }}
    >
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center"
        style={{
          background: 'var(--white)',
          color: 'var(--primary)',
          boxShadow: '0 4px 12px rgba(12, 26, 29, 0.06)',
          marginBottom: 'var(--space-sm)',
        }}
      >
        <span className="material-symbols-outlined">add</span>
      </div>
      <p
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 500,
          color: 'var(--primary)',
          margin: 0,
          marginBottom: '4px',
        }}
      >
        Start your library
      </p>
      <p
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '12px',
          color: 'var(--text-soft)',
          margin: 0,
        }}
      >
        Add a material to create your first track
      </p>
    </div>
  );
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    async function loadDashboard() {
      if (!user?.id) return;

      setLoading(true);
      setError('');

      try {
        const data = await getDashboardData(user.id);
        if (mounted) setDashboard(data);
      } catch (err) {
        if (mounted) setError(err.message || 'Could not load your dashboard.');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadDashboard();

    return () => {
      mounted = false;
    };
  }, [user?.id]);

  const displayName = dashboard?.profile?.full_name || user?.user_metadata?.full_name || 'Learner';
  const tracks = dashboard?.tracks || [];
  const resumeTrack = dashboard?.resumeTrack || null;
  const stats = dashboard?.stats || [
    { val: 0, label: 'Active Days' },
    { val: 0, label: 'Sessions Done' },
    { val: 0, label: 'Completed Tracks' },
  ];

  const resumeProgress = useMemo(
    () => Math.round(Number(resumeTrack?.progress_percent || 0)),
    [resumeTrack?.progress_percent],
  );

  const buildSavedNotesState = async (track, reviewMode = false) => {
    const savedNotes = await getLatestSavedNotesForTrack({ userId: user?.id, trackId: track?.id });
    if (!savedNotes) return null;

    return {
      topic: savedNotes.session.topic || track.title,
      duration: null,
      materials: [],
      learningTrack: track,
      learningSession: savedNotes.session,
      sourceMaterial: savedNotes.materialId ? { id: savedNotes.materialId } : null,
      generatedNotes: savedNotes.notes,
      restoredFromSupabase: true,
      reviewMode,
      notesPartIndex: 0,
      chatSession: {
        session_id: savedNotes.session.id,
        source_stats: {
          filename: track.title,
          page_count: null,
          extracted_characters: savedNotes.notes.notes_markdown.length,
          truncated: false,
        },
        messages: [
          {
            id: savedNotes.notes.id,
            role: 'assistant',
            content_markdown: savedNotes.notes.notes_markdown,
            created_at: savedNotes.notes.created_at,
          },
        ],
      },
    };
  };

  const resumeLearning = async (track) => {
    const savedSession = getSavedLearningSession(user?.id, track?.id);
    if (savedSession?.chatSession) {
      navigate('/assessment', { state: savedSession });
      return;
    }

    try {
      const savedNotesState = await buildSavedNotesState(track);
      if (savedNotesState) {
        navigate('/assessment', { state: savedNotesState });
        return;
      }
    } catch (err) {
      console.warn('Could not load saved notes from Supabase', err);
    }

    navigate('/start-session');
  };

  const reviewNotes = async (track) => {
    const savedSession = getSavedLearningSession(user?.id, track?.id);
    if (savedSession?.chatSession) {
      navigate('/assessment', { state: { ...savedSession, reviewMode: true } });
      return;
    }

    try {
      const savedNotesState = await buildSavedNotesState(track, true);
      if (savedNotesState) {
        navigate('/assessment', { state: savedNotesState });
        return;
      }
    } catch (err) {
      console.warn('Could not load saved notes from Supabase', err);
    }

    navigate('/start-session');
  };

  return (
    <AppLayout title="Dashboard">
      {error && (
        <section
          style={{
            background: 'rgba(186, 26, 26, 0.08)',
            border: '1px solid rgba(186, 26, 26, 0.16)',
            borderRadius: 'var(--radius-md)',
            color: '#BA1A1A',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '14px',
            marginBottom: 'var(--space-lg)',
            padding: 'var(--space-sm)',
          }}
        >
          {error}
        </section>
      )}

      {/* Resume Journey now reads the signed-in user's latest track from Supabase. */}
      <section style={{ marginBottom: 'var(--space-2xl)' }}>
        <div
          className="relative overflow-hidden"
          style={{
            background: 'var(--white)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-light)',
            boxShadow: '0 4px 24px rgba(12, 26, 29, 0.06)',
            padding: 'clamp(32px, 5vw, 56px)',
          }}
        >
          <div className="relative z-10 max-w-[640px]">
            <span className="section-label block" style={{ marginBottom: 'var(--space-sm)' }}>Resume Journey</span>
            <h1
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(40px, 5.5vw, 60px)',
                fontWeight: 900,
                lineHeight: 1.05,
                letterSpacing: '-0.03em',
                color: 'var(--text)',
                margin: 0,
                marginBottom: 'var(--space-md)',
              }}
            >
              {loading ? (
                <>Loading <em style={{ color: 'var(--primary)', fontStyle: 'italic' }}>journey.</em></>
              ) : resumeTrack ? (
                <>{resumeTrack.title} <em style={{ color: 'var(--primary)', fontStyle: 'italic' }}>.</em></>
              ) : (
                <>Welcome, <em style={{ color: 'var(--primary)', fontStyle: 'italic' }}>{displayName.split(' ')[0]}.</em></>
              )}
            </h1>

            {resumeTrack ? (
              <div className="flex items-center gap-4" style={{ marginBottom: 'var(--space-lg)' }}>
                <div className="progress-track flex-grow">
                  <div className="progress-fill" style={{ width: `${resumeProgress}%` }}></div>
                </div>
                <span
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '13px',
                    fontWeight: 500,
                    color: 'var(--text-mid)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {resumeProgress}% Complete
                </span>
              </div>
            ) : (
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '16px',
                  color: 'var(--text-mid)',
                  lineHeight: 1.7,
                  margin: 0,
                  marginBottom: 'var(--space-lg)',
                }}
              >
                Upload your first material and FocusPath will build a learning track here.
              </p>
            )}

            <div className="flex flex-wrap gap-4">
              <button className="btn-primary" onClick={() => resumeLearning(resumeTrack)}>
                {resumeTrack ? 'Continue Learning' : 'Start Learning'}
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>play_arrow</span>
              </button>
              {resumeTrack && (
                <button className="btn-secondary" onClick={() => reviewNotes(resumeTrack)}>
                  Review Notes
                </button>
              )}
            </div>
          </div>
          <div
            className="absolute top-0 right-0 pointer-events-none"
            style={{
              marginRight: '-80px',
              marginTop: '-80px',
              width: '320px',
              height: '320px',
              background: 'var(--primary-pale)',
              borderRadius: '100%',
              filter: 'blur(60px)',
            }}
          ></div>
        </div>
      </section>

      {/* Fixed demo cards were replaced with per-user learning_tracks rows. */}
      <section style={{ marginBottom: 'var(--space-2xl)' }}>
        <div
          className="flex items-center justify-between"
          style={{ marginBottom: 'var(--space-lg)' }}
        >
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(28px, 3.5vw, 38px)',
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: '-0.025em',
              color: 'var(--text)',
              margin: 0,
            }}
          >
            Learning Library
          </h2>
          <button
            className="flex items-center gap-1 transition-colors"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '14px',
              fontWeight: 500,
              color: 'var(--primary)',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            View All
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>chevron_right</span>
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tracks.map((track) => {
            const progress = Math.round(Number(track.progress_percent || 0));

            return (
              <div
                key={track.id}
                className="card group cursor-pointer"
                role="button"
                tabIndex={0}
                onClick={() => resumeLearning(track)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    resumeLearning(track);
                  }
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                  style={{
                    background: 'var(--primary-pale)',
                    color: 'var(--primary)',
                    marginBottom: 'var(--space-sm)',
                  }}
                >
                  <span className="material-symbols-outlined">{track.icon || 'auto_stories'}</span>
                </div>
                <h3
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '22px',
                    fontWeight: 700,
                    lineHeight: 1.2,
                    letterSpacing: '-0.02em',
                    color: 'var(--text)',
                    margin: 0,
                    marginBottom: 'var(--space-xs)',
                  }}
                >
                  {track.title}
                </h3>
                <p
                  className="flex items-center gap-1"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '12px',
                    color: 'var(--text-soft)',
                    margin: 0,
                    marginBottom: 'var(--space-md)',
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>schedule</span>
                  Accessed {formatRelativeTime(track.last_accessed_at)}
                </p>
                <div className="flex flex-col gap-2">
                  <div
                    className="flex justify-between"
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: '12px',
                      fontWeight: 500,
                      color: 'var(--text-mid)',
                    }}
                  >
                    <span>Progress</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="progress-track" style={{ height: '4px' }}>
                    <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                  </div>
                </div>
              </div>
            );
          })}

          {!loading && tracks.length === 0 && <EmptyLibraryCard navigate={navigate} />}

          {tracks.length > 0 && <EmptyLibraryCard navigate={navigate} />}
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3" style={{ gap: 'var(--space-md)' }}>
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="text-center"
            style={{
              background: 'rgba(255, 255, 255, 0.6)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-light)',
              padding: 'var(--space-md)',
            }}
          >
            <span
              className="block"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '40px',
                fontWeight: 900,
                lineHeight: 1,
                letterSpacing: '-0.02em',
                color: 'var(--primary)',
                marginBottom: '4px',
              }}
            >
              {stat.val}
            </span>
            <span className="section-label" style={{ color: 'var(--text-soft)' }}>{stat.label}</span>
          </div>
        ))}
      </section>
    </AppLayout>
  );
};

export default Dashboard;
