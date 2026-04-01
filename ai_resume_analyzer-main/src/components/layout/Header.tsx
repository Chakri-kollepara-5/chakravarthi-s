import React from 'react';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  view: 'analyse' | 'history' | 'tips' | 'tools';
  setView: (view: 'analyse' | 'history' | 'tips' | 'tools') => void;
}

export const Header: React.FC<HeaderProps> = ({ view, setView }) => {
  const { user, isLoggedIn, logout } = useAuth();

  return (
    <header className="app-header">
      <div className="logo" onClick={() => setView('analyse')} style={{ cursor: 'pointer' }}>
        Resume<span className="logo-accent">IQ</span>
      </div>
      <nav className="nav-pills">
        {(['analyse', 'history', 'tips', 'tools'] as const).map(v => (
          <button
            key={v}
            className={`nav-pill ${view === v ? 'active' : ''}`}
            onClick={() => setView(v)}
          >
            {v.charAt(0).toUpperCase() + v.slice(1)}
          </button>
        ))}
      </nav>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {isLoggedIn ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--accent)' }}>PREMIUM</div>
              <div style={{ fontSize: '12px', color: 'var(--text2)', fontWeight: 500 }}>{user?.name}</div>
            </div>
            <button className="btn-sm" onClick={logout} style={{ padding: '6px 12px' }}>
              Logout
            </button>
          </div>
        ) : (
          <div style={{ fontSize: '11px', opacity: 0.3, fontWeight: 600 }}>
            claude-haiku · trial mode
          </div>
        )}
      </div>
    </header>
  );
};
