import React from 'react';

const BottomNavBar = () => {
  const itemBase = {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '11px',
    fontWeight: 500,
    letterSpacing: '0.04em',
  };

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
        <div
          className="flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-2xl transition-all active:scale-95 cursor-pointer"
          style={{ color: 'var(--text-soft)', ...itemBase }}
        >
          <span className="material-symbols-outlined">calendar_today</span>
          <span>Today</span>
        </div>
        <div
          className="flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-2xl transition-all active:scale-95 cursor-pointer"
          style={{
            color: 'var(--primary)',
            background: 'var(--primary-dim)',
            ...itemBase,
          }}
        >
          <span className="material-symbols-outlined fill">local_library</span>
          <span>Library</span>
        </div>
        <div
          className="flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-2xl transition-all active:scale-95 cursor-pointer"
          style={{ color: 'var(--text-soft)', ...itemBase }}
        >
          <span className="material-symbols-outlined">insights</span>
          <span>Progress</span>
        </div>
        <div
          className="flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-2xl transition-all active:scale-95 cursor-pointer"
          style={{ color: 'var(--text-soft)', ...itemBase }}
        >
          <span className="material-symbols-outlined">person</span>
          <span>Profile</span>
        </div>
      </div>
    </nav>
  );
};

export default BottomNavBar;
