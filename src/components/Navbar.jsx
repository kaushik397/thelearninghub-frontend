import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = ({ title = "MindFlow", showBack = false }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { label: 'Modules', path: '/dashboard' },
    { label: 'Library', path: '/library' },
    { label: 'Resources', path: null },
  ];

  return (
    <header
      className="sticky top-0 z-50 w-full border-b backdrop-blur-xl"
      style={{
        background: 'rgba(253, 248, 216, 0.85)',
        borderColor: 'var(--border-light)',
        WebkitBackdropFilter: 'blur(24px)',
      }}
    >
      <div className="flex justify-between items-center w-full px-6 h-16 max-w-[1180px] mx-auto">
        <div className="flex items-center gap-4">
          {showBack && (
            <span className="material-symbols-outlined cursor-pointer transition-opacity active:opacity-70" style={{ color: 'var(--text)' }}>
              arrow_back
            </span>
          )}
          <h1
            className="font-h3"
            style={{ fontSize: '22px', lineHeight: 1.1, color: 'var(--text)', margin: 0 }}
          >
            {title}
          </h1>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          {tabs.map((tab) => {
            const isActive = !!tab.path && location.pathname === tab.path;
            return (
              <button
                key={tab.label}
                type="button"
                onClick={() => tab.path && navigate(tab.path)}
                disabled={!tab.path}
                className="font-body transition-colors disabled:cursor-default"
                style={{
                  fontSize: '14px',
                  fontWeight: 500,
                  color: isActive ? 'var(--primary)' : 'var(--text-mid)',
                  borderBottom: isActive ? '2px solid var(--primary)' : '2px solid transparent',
                  paddingBottom: '4px',
                  background: 'transparent',
                  border: 'none',
                  borderBottomWidth: '2px',
                  borderBottomStyle: 'solid',
                  borderBottomColor: isActive ? 'var(--primary)' : 'transparent',
                  cursor: tab.path ? 'pointer' : 'default',
                  opacity: tab.path ? 1 : 0.55,
                }}
                onMouseEnter={(e) => {
                  if (!isActive && tab.path) e.currentTarget.style.color = 'var(--primary)';
                }}
                onMouseLeave={(e) => {
                  if (!isActive && tab.path) e.currentTarget.style.color = 'var(--text-mid)';
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>
        <div className="flex items-center gap-4">
          <span className="material-symbols-outlined cursor-pointer transition-transform hover:scale-110" style={{ color: 'var(--primary)' }}>settings</span>
          <span className="material-symbols-outlined cursor-pointer transition-transform hover:scale-110" style={{ color: 'var(--primary)' }}>help_outline</span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
