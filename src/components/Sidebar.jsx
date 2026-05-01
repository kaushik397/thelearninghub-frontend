import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/auth-context';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const displayName = user?.user_metadata?.full_name || user?.email || 'Learning Path';
  const initial = displayName.trim().charAt(0).toUpperCase() || 'L';

  const navItem = (icon, label, path) => {
    const isActive = path && location.pathname === path;
    return (
      <button
        onClick={() => path && navigate(path)}
        className="w-full flex items-center gap-3 px-4 py-3 transition-all duration-200 text-left"
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '14px',
          fontWeight: 500,
          color: isActive ? 'var(--cream)' : 'rgba(253, 248, 216, 0.45)',
          background: isActive ? 'rgba(255, 96, 10, 0.12)' : 'transparent',
          borderLeft: isActive ? '3px solid var(--primary)' : '3px solid transparent',
        }}
        onMouseEnter={(e) => {
          if (!isActive) e.currentTarget.style.color = 'var(--cream)';
        }}
        onMouseLeave={(e) => {
          if (!isActive) e.currentTarget.style.color = 'rgba(253, 248, 216, 0.45)';
        }}
      >
        <span className="material-symbols-outlined">{icon}</span>
        {label}
      </button>
    );
  };

  return (
    <aside
      className="hidden lg:flex flex-col h-screen w-64 sticky top-0 z-40"
      style={{
        background: 'var(--dark)',
        borderRight: '1px solid var(--border-dark)',
        paddingTop: 'var(--space-lg)',
        paddingBottom: 'var(--space-lg)',
      }}
    >
      <div className="px-6 mb-10">
        <span
          className="block"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 700,
            fontSize: '24px',
            letterSpacing: '-0.02em',
            color: 'var(--cream)',
          }}
        >
          Focus<span style={{ color: 'var(--primary)' }}>Path</span>
        </span>
        <div className="mt-8 flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden shrink-0"
            style={{ background: 'var(--primary-dim)' }}
          >
            <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{initial}</span>
          </div>
          <div className="min-w-0">
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 500,
                fontSize: '14px',
                color: 'var(--cream)',
                margin: 0,
                lineHeight: 1.3,
              }}
            >
              {displayName}
            </p>
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '12px',
                color: 'rgba(253, 248, 216, 0.55)',
                margin: 0,
                marginTop: '2px',
              }}
            >
              Level 4 Learner
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-grow flex flex-col gap-1">
        {navItem('dashboard', 'Dashboard', '/dashboard')}
        {navItem('library_books', 'Library', null)}
        {navItem('history_edu', 'Sessions', null)}
        {navItem('person', 'Profile', null)}
      </nav>

      <div className="px-6 pt-6">
        <button
          onClick={() => navigate('/start-session')}
          className="btn-primary w-full"
          style={{ paddingTop: '14px', paddingBottom: '14px' }}
        >
          <span className="material-symbols-outlined">add_circle</span>
          Start New Learning
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
