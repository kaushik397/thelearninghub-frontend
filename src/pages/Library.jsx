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

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'in_progress', label: 'In Progress' },
  { id: 'completed', label: 'Completed' },
  { id: 'not_started', label: 'Not Started' },
];

const SORTS = [
  { id: 'recent', label: 'Recently Accessed' },
  { id: 'created', label: 'Newest' },
  { id: 'progress', label: 'Most Progress' },
  { id: 'title', label: 'A–Z' },
];

const Library = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('recent');
  const [query, setQuery] = useState('');

  useEffect(() => {
    let mounted = true;

    async function loadLibrary() {
      if (!user?.id) return;

      setLoading(true);
      setError('');

      try {
        const data = await getDashboardData(user.id);
        if (mounted) setTracks(data?.tracks || []);
      } catch (err) {
        if (mounted) setError(err.message || 'Could not load your library.');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadLibrary();

    return () => {
      mounted = false;
    };
  }, [user?.id]);

  const summary = useMemo(() => {
    const total = tracks.length;
    const completed = tracks.filter((t) => Number(t.progress_percent) >= 100).length;
    const inProgress = tracks.filter((t) => {
      const p = Number(t.progress_percent || 0);
      return p > 0 && p < 100;
    }).length;
    const notStarted = total - completed - inProgress;
    return { total, completed, inProgress, notStarted };
  }, [tracks]);

  const visibleTracks = useMemo(() => {
    const lower = query.trim().toLowerCase();

    let filtered = tracks.filter((track) => {
      const progress = Number(track.progress_percent || 0);

      if (filter === 'completed' && progress < 100) return false;
      if (filter === 'in_progress' && (progress <= 0 || progress >= 100)) return false;
      if (filter === 'not_started' && progress > 0) return false;

      if (lower) {
        const haystack = `${track.title || ''} ${track.description || ''}`.toLowerCase();
        if (!haystack.includes(lower)) return false;
      }

      return true;
    });

    filtered = [...filtered];

    if (sort === 'recent') {
      filtered.sort((a, b) => {
        const aTime = a.last_accessed_at ? new Date(a.last_accessed_at).getTime() : 0;
        const bTime = b.last_accessed_at ? new Date(b.last_accessed_at).getTime() : 0;
        return bTime - aTime;
      });
    } else if (sort === 'created') {
      filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else if (sort === 'progress') {
      filtered.sort((a, b) => Number(b.progress_percent || 0) - Number(a.progress_percent || 0));
    } else if (sort === 'title') {
      filtered.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    }

    return filtered;
  }, [tracks, filter, sort, query]);

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

  const openTrack = async (track, reviewMode = false) => {
    try {
      const savedNotesState = await buildSavedNotesState(track, reviewMode);
      if (savedNotesState) {
        navigate('/assessment', { state: savedNotesState });
        return;
      }
    } catch (err) {
      console.warn('Could not load saved notes from Supabase', err);
    }

    const savedSession = getSavedLearningSession(user?.id, track?.id);
    if (savedSession?.chatSession && !reviewMode) {
      navigate('/assessment-quiz', { state: savedSession });
      return;
    }

    navigate('/start-session');
  };

  const stats = [
    { val: summary.total, label: 'Total Tracks' },
    { val: summary.inProgress, label: 'In Progress' },
    { val: summary.completed, label: 'Completed' },
  ];

  const segmentChip = (active, label, onClick) => (
    <button
      key={label}
      onClick={onClick}
      className="transition-all"
      style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: '13px',
        fontWeight: 500,
        padding: '8px 16px',
        borderRadius: 'var(--radius-pill)',
        border: active ? 'none' : '1px solid var(--border-light)',
        background: active ? 'var(--primary)' : 'var(--white)',
        color: active ? '#fff' : 'var(--text-mid)',
        cursor: 'pointer',
      }}
    >
      {label}
    </button>
  );

  return (
    <AppLayout title="Library">
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

      <section style={{ marginBottom: 'var(--space-xl)' }}>
        <span className="section-label block" style={{ marginBottom: 'var(--space-sm)' }}>Your Library</span>
        <h1
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(40px, 5.5vw, 60px)',
            fontWeight: 900,
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
            color: 'var(--text)',
            margin: 0,
            marginBottom: 'var(--space-sm)',
          }}
        >
          Every track, <em style={{ color: 'var(--primary)', fontStyle: 'italic' }}>in one place.</em>
        </h1>
        <p
          className="measure"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '17px',
            fontWeight: 300,
            lineHeight: 1.7,
            color: 'var(--text-mid)',
            margin: 0,
          }}
        >
          Revisit notes, resume learning, and watch your progress grow over time.
        </p>
      </section>

      <section
        className="grid grid-cols-3"
        style={{ gap: 'var(--space-md)', marginBottom: 'var(--space-xl)' }}
      >
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
                fontSize: 'clamp(32px, 4vw, 40px)',
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

      <section
        style={{
          background: 'var(--white)',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 4px 24px rgba(12, 26, 29, 0.06)',
          padding: 'var(--space-md)',
          marginBottom: 'var(--space-lg)',
        }}
      >
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div
            className="relative flex-grow"
            style={{ minWidth: 0 }}
          >
            <span
              className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2"
              style={{ color: 'var(--text-soft)', fontSize: '20px' }}
            >
              search
            </span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tracks by title or description"
              className="input"
              style={{ paddingLeft: '48px' }}
              aria-label="Search tracks"
            />
          </div>
          <div className="flex items-center gap-2">
            <span
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '12px',
                fontWeight: 500,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--text-soft)',
              }}
            >
              Sort
            </span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="input"
              style={{ padding: '10px 14px', width: 'auto' }}
              aria-label="Sort tracks"
            >
              {SORTS.map((s) => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div
          className="flex flex-wrap gap-2"
          style={{ marginTop: 'var(--space-md)' }}
        >
          {FILTERS.map((f) => segmentChip(filter === f.id, f.label, () => setFilter(f.id)))}
        </div>
      </section>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                background: 'rgba(255, 255, 255, 0.5)',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-md) 28px',
                minHeight: '180px',
              }}
            />
          ))}
        </div>
      ) : visibleTracks.length === 0 ? (
        <section
          className="text-center"
          style={{
            background: 'var(--white)',
            border: '2px dashed var(--border-active)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-xl) var(--space-md)',
          }}
        >
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center mx-auto"
            style={{
              background: 'var(--primary-pale)',
              color: 'var(--primary)',
              marginBottom: 'var(--space-sm)',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>library_books</span>
          </div>
          <h3
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '24px',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: 'var(--text)',
              margin: 0,
              marginBottom: 'var(--space-xs)',
            }}
          >
            {tracks.length === 0 ? 'Your library is empty.' : 'No tracks match your filters.'}
          </h3>
          <p
            className="measure mx-auto"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '15px',
              fontWeight: 300,
              lineHeight: 1.6,
              color: 'var(--text-mid)',
              margin: 0,
              marginBottom: 'var(--space-md)',
            }}
          >
            {tracks.length === 0
              ? 'Upload a study material to create your first learning track.'
              : 'Try adjusting your filters or search to find what you are looking for.'}
          </p>
          {tracks.length === 0 ? (
            <button className="btn-primary" onClick={() => navigate('/start-session')}>
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>add_circle</span>
              Start a new track
            </button>
          ) : (
            <button
              className="btn-secondary"
              onClick={() => {
                setFilter('all');
                setQuery('');
              }}
            >
              Clear filters
            </button>
          )}
        </section>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {visibleTracks.map((track) => {
            const progress = Math.round(Number(track.progress_percent || 0));
            const isCompleted = progress >= 100;

            return (
              <div
                key={track.id}
                className="card group cursor-pointer flex flex-col"
                role="button"
                tabIndex={0}
                onClick={() => openTrack(track, isCompleted)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openTrack(track, isCompleted);
                  }
                }}
              >
                <div className="flex items-start justify-between" style={{ marginBottom: 'var(--space-sm)' }}>
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                    style={{
                      background: 'var(--primary-pale)',
                      color: 'var(--primary)',
                    }}
                  >
                    <span className="material-symbols-outlined">{track.icon || 'auto_stories'}</span>
                  </div>
                  <span
                    className="chip"
                    style={{
                      background: isCompleted ? 'var(--primary)' : 'var(--primary-pale)',
                      color: isCompleted ? '#fff' : 'var(--primary)',
                      border: 'none',
                    }}
                  >
                    {isCompleted ? 'Completed' : progress > 0 ? 'In Progress' : 'Not Started'}
                  </span>
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

                {track.description && (
                  <p
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: '14px',
                      fontWeight: 300,
                      lineHeight: 1.6,
                      color: 'var(--text-mid)',
                      margin: 0,
                      marginBottom: 'var(--space-sm)',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {track.description}
                  </p>
                )}

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

                <div className="flex flex-col gap-2" style={{ marginTop: 'auto' }}>
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

                <div
                  className="flex gap-2"
                  style={{ marginTop: 'var(--space-md)' }}
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => e.stopPropagation()}
                >
                  <button
                    className="btn-secondary"
                    style={{ padding: '8px 18px', fontSize: '13px', flexGrow: 1 }}
                    onClick={() => openTrack(track, true)}
                  >
                    Review Notes
                  </button>
                  <button
                    className="btn-primary"
                    style={{ padding: '8px 18px', fontSize: '13px', flexGrow: 1 }}
                    onClick={() => openTrack(track, false)}
                  >
                    {isCompleted ? 'Revisit' : progress > 0 ? 'Continue' : 'Start'}
                  </button>
                </div>
              </div>
            );
          })}
        </section>
      )}
    </AppLayout>
  );
};

export default Library;
