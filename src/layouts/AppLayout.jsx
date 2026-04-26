import React from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import BottomNavBar from '../components/BottomNavBar';

const AppLayout = ({ children, title, showNavbar = true, showSidebar = true }) => {
  return (
    <div className="flex min-h-screen" style={{ background: 'var(--bg)' }}>
      {showSidebar && <Sidebar />}
      <div className="flex-grow flex flex-col min-w-0">
        {showNavbar && <Navbar title={title} />}
        <main
          className="flex-grow w-full mx-auto"
          style={{
            maxWidth: '1180px',
            paddingLeft: 'var(--space-md)',
            paddingRight: 'var(--space-md)',
            paddingTop: 'var(--space-xl)',
            paddingBottom: 'var(--space-3xl)',
          }}
        >
          {children}
        </main>
        <BottomNavBar />
      </div>
    </div>
  );
};

export default AppLayout;
