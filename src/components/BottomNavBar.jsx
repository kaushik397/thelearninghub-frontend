import { useNavigate, useLocation } from 'react-router-dom';

const BottomNavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const itemBase = {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '11px',
    fontWeight: 500,
    letterSpacing: '0.04em',
  };

  const items = [
    { icon: 'dashboard', label: 'Dashboard', path: '/dashboard' },
    { icon: 'local_library', label: 'Library', path: '/library' },
    { icon: 'insights', label: 'Progress', path: null },
    { icon: 'person', label: 'Profile', path: '/profile' },
  ];

  return (
    <nav
      className="fixed bottom-0 w-full z-50 lg:hidden"
      style={{
        background: 'rgba(253, 248, 216, 0.92)',
        WebkitBackdropFilter: 'blur(24px)',
        backdropFilter: 'blur(24px)',
        borderTop: '1px solid var(--border-light)',
        boxShadow: '0 -2px 24px rgba(12, 26, 29, 0.05)',
      }}
    >
      <div className="flex justify-around items-center w-full px-4 py-3 max-w-[800px] mx-auto">
        {items.map((item) => {
          const isActive = !!item.path && location.pathname === item.path;
          return (
            <button
              key={item.label}
              type="button"
              onClick={() => item.path && navigate(item.path)}
              disabled={!item.path}
              className="flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-2xl transition-all active:scale-95 cursor-pointer disabled:cursor-default"
              style={{
                color: isActive ? 'var(--primary)' : 'var(--text-soft)',
                background: isActive ? 'var(--primary-dim)' : 'transparent',
                border: 'none',
                opacity: !item.path ? 0.55 : 1,
                ...itemBase,
              }}
            >
              <span className={`material-symbols-outlined${isActive ? ' fill' : ''}`}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavBar;
