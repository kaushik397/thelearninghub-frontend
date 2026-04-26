import React from 'react';

const ProgressBar = ({ progress = 0, label = "" }) => {
  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between items-end mb-3">
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '11px',
              fontWeight: 500,
              letterSpacing: '0.10em',
              textTransform: 'uppercase',
              color: 'var(--primary)',
              margin: 0,
            }}
          >
            {label}
          </p>
          <span
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '12px',
              fontWeight: 500,
              color: 'var(--text-mid)',
            }}
          >
            {Math.round(progress)}% Complete
          </span>
        </div>
      )}
      <div className="progress-track" role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin="0" aria-valuemax="100">
        <div
          className="progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
