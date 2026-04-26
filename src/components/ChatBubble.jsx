import React from 'react';

const ChatBubble = ({ message, isUser = false, role = "Tutor" }) => {
  return (
    <div className={`flex flex-col ${isUser ? 'items-end ml-auto' : 'items-start'} gap-2 max-w-[85%]`}>
      <div className="flex items-center gap-2 px-1">
        {!isUser && (
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center"
            style={{ background: 'var(--primary-dim)' }}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: '14px', color: 'var(--primary)' }}
            >
              psychology
            </span>
          </div>
        )}
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
          {isUser ? 'You' : role}
        </span>
        {isUser && (
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center"
            style={{ background: 'var(--bg-warm)' }}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: '14px', color: 'var(--text-mid)' }}
            >
              person
            </span>
          </div>
        )}
      </div>
      <div
        style={{
          padding: '20px 24px',
          borderRadius: 'var(--radius-lg)',
          borderTopRightRadius: isUser ? '6px' : 'var(--radius-lg)',
          borderTopLeftRadius: isUser ? 'var(--radius-lg)' : '6px',
          background: isUser ? 'var(--primary-pale)' : 'var(--white)',
          border: '1px solid var(--border-light)',
          color: 'var(--text)',
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '15px',
          fontWeight: 300,
          lineHeight: 1.7,
          boxShadow: '0 4px 16px rgba(12, 26, 29, 0.04)',
        }}
      >
        {message}
      </div>
    </div>
  );
};

export default ChatBubble;
