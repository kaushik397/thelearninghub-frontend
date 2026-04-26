import React from 'react';

const Navbar = ({ title = "MindFlow", showBack = false }) => {
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
          <a className="font-body transition-colors" style={{ fontSize: '14px', fontWeight: 500, color: 'var(--primary)', borderBottom: '2px solid var(--primary)', paddingBottom: '4px' }} href="#">Modules</a>
          <a className="font-body transition-colors hover:text-[color:var(--primary)]" style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-mid)' }} href="#">Library</a>
          <a className="font-body transition-colors hover:text-[color:var(--primary)]" style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-mid)' }} href="#">Resources</a>
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
