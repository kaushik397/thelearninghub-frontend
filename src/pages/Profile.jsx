import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout';
import { getDashboardData } from '../api/userData';
import { useAuth } from '../auth/auth-context';

function formatDate(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
}

function calculateAge(value) {
  if (!value) return null;
  const dob = new Date(value);
  if (Number.isNaN(dob.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age -= 1;
  return age >= 0 ? age : null;
}

const METHODOLOGY_META = {
  text: { label: 'Text', icon: 'article', description: 'Read at your own pace with structured micro-blocks.' },
  video: { label: 'Video', icon: 'play_circle', description: 'Visual explanations with key takeaways highlighted.' },
  audio: { label: 'Audio', icon: 'headphones', description: 'Listen on the go, perfect for multi-tasking.' },
  mix: { label: 'Custom Mix', icon: 'tune', description: 'A tailored blend of text, video, and audio.' },
};

const ENERGY_META = {
  low: { label: 'Low', icon: 'battery_0_bar', description: 'Gentle start. Short blocks, frequent breaks.' },
  medium: { label: 'Medium', icon: 'battery_4_bar', description: 'Balanced focus, steady pacing.' },
  high: { label: 'High', icon: 'battery_charging_full', description: 'Deep work. Longer blocks, complex concepts.' },
};

function InfoRow({ icon, label, value }) {
  return (
    <div
      className="flex items-center gap-4"
      style={{
        padding: 'var(--space-sm) 0',
        borderBottom: '1px solid var(--border-light)',
      }}
    >
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
        style={{ background: 'var(--primary-pale)', color: 'var(--primary)' }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>{icon}</span>
      </div>
      <div className="min-w-0 flex-grow">
        <span
          className="block"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '11px',
            fontWeight: 500,
            letterSpacing: '0.10em',
            textTransform: 'uppercase',
            color: 'var(--text-soft)',
            marginBottom: '2px',
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '15px',
            fontWeight: 500,
            color: 'var(--text)',
            wordBreak: 'break-word',
          }}
        >
          {value || <em style={{ color: 'var(--text-soft)', fontWeight: 300 }}>Not set</em>}
        </span>
      </div>
    </div>
  );
}

function SectionHeading({ label, title, action }) {
  return (
    <div
      className="flex items-end justify-between"
      style={{ marginBottom: 'var(--space-md)' }}
    >
      <div>
        <span className="section-label block" style={{ marginBottom: '4px' }}>{label}</span>
        <h2
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(24px, 3vw, 32px)',
            fontWeight: 900,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            color: 'var(--text)',
            margin: 0,
          }}
        >
          {title}
        </h2>
      </div>
      {action}
    </div>
  );
}

const Profile = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState(null);
  const [learnerProfile, setLearnerProfile] = useState(null);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadProfile() {
      if (!user?.id) return;

      setLoading(true);
      setError('');

      try {
        const data = await getDashboardData(user.id);
        if (!mounted) return;
        setProfile(data?.profile || null);
        setLearnerProfile(data?.learnerProfile || null);
        setStats(data?.stats || []);
      } catch (err) {
        if (mounted) setError(err.message || 'Could not load your profile.');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadProfile();

    return () => {
      mounted = false;
    };
  }, [user?.id]);

  const fullName =
    profile?.full_name ||
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    'Learner';
  const email = profile?.email || user?.email || '—';
  const dob = profile?.date_of_birth || user?.user_metadata?.date_of_birth || null;
  const age = useMemo(() => calculateAge(dob), [dob]);
  const memberSince = formatDate(user?.created_at);
  const onboardingDate = formatDate(profile?.onboarding_completed_at);
  const initial = fullName.trim().charAt(0).toUpperCase() || 'L';

  const methodology = learnerProfile?.preferred_methodology || null;
  const methodologyMeta = methodology ? METHODOLOGY_META[methodology] : null;
  const focusMinutes = learnerProfile?.focus_duration_minutes || null;
  const energy = learnerProfile?.energy_level || null;
  const energyMeta = energy ? ENERGY_META[energy] : null;

  const mix = useMemo(() => {
    if (!learnerProfile) return null;
    const t = Number(learnerProfile.text_mix || 0);
    const v = Number(learnerProfile.video_mix || 0);
    const a = Number(learnerProfile.audio_mix || 0);
    if (t === 0 && v === 0 && a === 0) return null;
    return { text: t, video: v, audio: a };
  }, [learnerProfile]);

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut();
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Could not sign out.');
      setSigningOut(false);
    }
  };

  return (
    <AppLayout title="Profile">
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

      <section
        className="relative overflow-hidden"
        style={{
          background: 'var(--white)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-light)',
          boxShadow: '0 4px 24px rgba(12, 26, 29, 0.06)',
          padding: 'clamp(28px, 4vw, 48px)',
          marginBottom: 'var(--space-xl)',
        }}
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center shrink-0"
            style={{
              background: 'var(--primary-dim)',
              color: 'var(--primary)',
              fontFamily: "'Playfair Display', serif",
              fontSize: '40px',
              fontWeight: 900,
              letterSpacing: '-0.02em',
              border: '3px solid var(--white)',
              boxShadow: '0 8px 24px rgba(255, 96, 10, 0.18)',
            }}
          >
            {initial}
          </div>
          <div className="flex-grow min-w-0">
            <span className="section-label block" style={{ marginBottom: '4px' }}>Profile</span>
            <h1
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(36px, 5vw, 52px)',
                fontWeight: 900,
                lineHeight: 1.05,
                letterSpacing: '-0.03em',
                color: 'var(--text)',
                margin: 0,
                marginBottom: '4px',
                wordBreak: 'break-word',
              }}
            >
              {fullName.split(' ')[0]}
              <em style={{ color: 'var(--primary)', fontStyle: 'italic' }}>.</em>
            </h1>
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '15px',
                color: 'var(--text-mid)',
                margin: 0,
              }}
            >
              {memberSince ? `FocusPath learner since ${memberSince}` : 'FocusPath learner'}
            </p>
          </div>
          <button
            className="btn-secondary"
            onClick={handleSignOut}
            disabled={signingOut}
            style={{ opacity: signingOut ? 0.72 : 1 }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>logout</span>
            {signingOut ? 'Signing out...' : 'Sign out'}
          </button>
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
      </section>

      {stats.length > 0 && (
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
                  fontSize: 'clamp(28px, 3.5vw, 36px)',
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
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: 'var(--space-xl)' }}>
        <section>
          <SectionHeading label="Account" title="Personal info" />
          <div
            style={{
              background: 'var(--white)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-light)',
              boxShadow: '0 4px 24px rgba(12, 26, 29, 0.06)',
              padding: 'var(--space-md) 28px',
            }}
          >
            <InfoRow icon="person" label="Full Name" value={loading ? null : fullName} />
            <InfoRow icon="mail" label="Email" value={loading ? null : email} />
            <InfoRow
              icon="cake"
              label="Date of Birth"
              value={
                loading
                  ? null
                  : dob
                    ? `${formatDate(dob)}${age != null ? ` · ${age} years old` : ''}`
                    : null
              }
            />
            <InfoRow
              icon="event_available"
              label="Onboarded"
              value={loading ? null : onboardingDate || (memberSince ? 'In progress' : null)}
            />
          </div>
        </section>

        <section>
          <SectionHeading
            label="Preferences"
            title="Learning style"
            action={
              <button
                className="btn-ghost"
                onClick={() => navigate('/onboarding/2')}
                style={{ padding: '8px 16px', fontSize: '13px' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>edit</span>
                Edit
              </button>
            }
          />
          <div
            style={{
              background: 'var(--white)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-light)',
              boxShadow: '0 4px 24px rgba(12, 26, 29, 0.06)',
              padding: 'var(--space-md) 28px',
            }}
          >
            <div
              className="flex items-center gap-4"
              style={{
                paddingBottom: 'var(--space-md)',
                borderBottom: '1px solid var(--border-light)',
              }}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                style={{ background: 'var(--primary-dim)', color: 'var(--primary)' }}
              >
                <span className="material-symbols-outlined">
                  {methodologyMeta?.icon || 'tune'}
                </span>
              </div>
              <div className="min-w-0 flex-grow">
                <span
                  className="block"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '11px',
                    fontWeight: 500,
                    letterSpacing: '0.10em',
                    textTransform: 'uppercase',
                    color: 'var(--text-soft)',
                    marginBottom: '2px',
                  }}
                >
                  Preferred Methodology
                </span>
                <span
                  className="block"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '20px',
                    fontWeight: 700,
                    letterSpacing: '-0.02em',
                    color: 'var(--text)',
                  }}
                >
                  {loading ? '—' : methodologyMeta?.label || 'Not set'}
                </span>
                {methodologyMeta && (
                  <span
                    className="block"
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: '13px',
                      fontWeight: 300,
                      color: 'var(--text-mid)',
                      marginTop: '2px',
                    }}
                  >
                    {methodologyMeta.description}
                  </span>
                )}
              </div>
            </div>

            {mix && (
              <div
                style={{
                  paddingTop: 'var(--space-md)',
                  paddingBottom: 'var(--space-md)',
                  borderBottom: '1px solid var(--border-light)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--space-sm)',
                }}
              >
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
                  Modality Mix
                </span>
                {[
                  { key: 'text', label: 'Text', icon: 'article', value: mix.text },
                  { key: 'video', label: 'Video', icon: 'play_circle', value: mix.video },
                  { key: 'audio', label: 'Audio', icon: 'headphones', value: mix.audio },
                ].map((row) => (
                  <div key={row.key} className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center">
                      <span
                        className="flex items-center gap-2"
                        style={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: '14px',
                          fontWeight: 500,
                          color: 'var(--text)',
                        }}
                      >
                        <span
                          className="material-symbols-outlined"
                          style={{ fontSize: '18px', color: 'var(--text-mid)' }}
                        >
                          {row.icon}
                        </span>
                        {row.label}
                      </span>
                      <span
                        style={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: '13px',
                          fontWeight: 500,
                          color: 'var(--primary)',
                        }}
                      >
                        {row.value}%
                      </span>
                    </div>
                    <div className="progress-track" style={{ height: '4px' }}>
                      <div className="progress-fill" style={{ width: `${row.value}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div
              className="flex items-center gap-4"
              style={{
                paddingTop: 'var(--space-md)',
                paddingBottom: 'var(--space-md)',
                borderBottom: '1px solid var(--border-light)',
              }}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                style={{ background: 'var(--primary-pale)', color: 'var(--primary)' }}
              >
                <span className="material-symbols-outlined">timer</span>
              </div>
              <div className="min-w-0 flex-grow">
                <span
                  className="block"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '11px',
                    fontWeight: 500,
                    letterSpacing: '0.10em',
                    textTransform: 'uppercase',
                    color: 'var(--text-soft)',
                    marginBottom: '2px',
                  }}
                >
                  Focus Duration
                </span>
                <span
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '20px',
                    fontWeight: 700,
                    letterSpacing: '-0.02em',
                    color: 'var(--text)',
                  }}
                >
                  {loading ? '—' : focusMinutes ? `${focusMinutes} minutes` : 'Not set'}
                </span>
                <span
                  className="block"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '13px',
                    fontWeight: 300,
                    color: 'var(--text-mid)',
                    marginTop: '2px',
                  }}
                >
                  Length of each focused learning block before a break.
                </span>
              </div>
            </div>

            <div
              className="flex items-center gap-4"
              style={{ paddingTop: 'var(--space-md)' }}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                style={{ background: 'var(--primary-pale)', color: 'var(--primary)' }}
              >
                <span className="material-symbols-outlined">{energyMeta?.icon || 'bolt'}</span>
              </div>
              <div className="min-w-0 flex-grow">
                <span
                  className="block"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '11px',
                    fontWeight: 500,
                    letterSpacing: '0.10em',
                    textTransform: 'uppercase',
                    color: 'var(--text-soft)',
                    marginBottom: '2px',
                  }}
                >
                  Typical Energy
                </span>
                <span
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '20px',
                    fontWeight: 700,
                    letterSpacing: '-0.02em',
                    color: 'var(--text)',
                  }}
                >
                  {loading ? '—' : energyMeta?.label || 'Not set'}
                </span>
                {energyMeta && (
                  <span
                    className="block"
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: '13px',
                      fontWeight: 300,
                      color: 'var(--text-mid)',
                      marginTop: '2px',
                    }}
                  >
                    {energyMeta.description}
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </AppLayout>
  );
};

export default Profile;
