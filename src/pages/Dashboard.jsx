import React from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout';

const Dashboard = () => {
  const navigate = useNavigate();
  const tracks = [
    { title: "Electronics and Communication", icon: "memory", progress: 42, time: "2 hours ago" },
    { title: "RTOS", icon: "developer_board", progress: 88, time: "5 hours ago" },
    { title: "Digital Signal Processing", icon: "auto_stories", progress: 15, time: "Yesterday" }
  ];

  return (
    <AppLayout title="Dashboard">
      {/* Resume Journey hero — the single Level 1 anchor of the page */}
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
              Probability <em style={{ color: 'var(--primary)', fontStyle: 'italic' }}>Theory.</em>
            </h1>
            <div className="flex items-center gap-4" style={{ marginBottom: 'var(--space-lg)' }}>
              <div className="progress-track flex-grow">
                <div className="progress-fill" style={{ width: '65%' }}></div>
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
                65% Complete
              </span>
            </div>
            <div className="flex flex-wrap gap-4">
              <button className="btn-primary" onClick={() => navigate('/start-session')}>
                Continue Learning
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>play_arrow</span>
              </button>
              <button className="btn-secondary">
                Review Notes
              </button>
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

      {/* Library */}
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
          {tracks.map((track, i) => (
            <div
              key={i}
              className="card group cursor-pointer"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                style={{
                  background: 'var(--primary-pale)',
                  color: 'var(--primary)',
                  marginBottom: 'var(--space-sm)',
                }}
              >
                <span className="material-symbols-outlined">{track.icon}</span>
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
                Accessed {track.time}
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
                  <span>{track.progress}%</span>
                </div>
                <div className="progress-track" style={{ height: '4px' }}>
                  <div className="progress-fill" style={{ width: `${track.progress}%` }}></div>
                </div>
              </div>
            </div>
          ))}
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
              Explore Topics
            </p>
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '12px',
                color: 'var(--text-soft)',
                margin: 0,
              }}
            >
              Add a new track to your library
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-1 md:grid-cols-3" style={{ gap: 'var(--space-md)' }}>
        {[
          { val: 12, label: "Streak Days" },
          { val: 24, label: "Hours Focused" },
          { val: 8, label: "Completed Tracks" }
        ].map((stat, i) => (
          <div
            key={i}
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
