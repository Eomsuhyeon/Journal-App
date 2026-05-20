import { useState, useEffect } from 'react';
import Home from './pages/Home';
import Write from './pages/Write';
import Album from './pages/Album';
import Report from './pages/Report';
import Login from './pages/Login';
import Friends from './pages/Friends';
import Profile from './pages/Profile';

export default function App() {
  const [page, setPage] = useState('login');
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) setPage('home');
  }, [token]);

  const handleLogin = (t) => {
    localStorage.setItem('token', t);
    setToken(t);
    setPage('home');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setPage('login');
  };

  if (!token) return <Login onLogin={handleLogin} />;

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      {page === 'home'    && <Home    goTo={setPage} />}
      {page === 'write'   && <Write   goTo={setPage} />}
      {page === 'album'   && <Album   goTo={setPage} />}
      {page === 'report'  && <Report  goTo={setPage} />}
      {page === 'friends' && <Friends goTo={setPage} />}
      {page === 'profile' && <Profile goTo={setPage} onLogout={handleLogout} />}

      <nav style={{ display: 'flex', borderTop: '1px solid #E8E0D4', position: 'fixed', bottom: 0, width: '100%', maxWidth: 400, background: '#F5F0E8' }}>
        {[
          { key: 'home',    label: 'TODAY',   icon: '◎' },
          { key: 'album',   label: 'ALBUM',   icon: '◫' },
          { key: 'friends', label: 'FRIENDS', icon: '○' },
          { key: 'report',  label: 'REPORT',  icon: '✦' },
          { key: 'profile', label: 'ME',      icon: '👤' },
        ].map(nav => (
          <button key={nav.key} onClick={() => setPage(nav.key)}
            style={{ flex: 1, padding: '12px 0 16px', background: 'none', border: 'none', cursor: 'pointer',
              color: page === nav.key ? '#C4733A' : '#8A8480', fontSize: 11, letterSpacing: '0.08em' }}>
            <div style={{ fontSize: 18 }}>{nav.icon}</div>
            {nav.label}
          </button>
        ))}
      </nav>
    </div>
  );
}