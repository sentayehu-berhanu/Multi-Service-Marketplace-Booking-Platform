import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';

const MainLayout = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    const userString = localStorage.getItem('user');
    return userString && userString !== 'undefined' ? JSON.parse(userString) : null;
  });

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem('token'));
      const userString = localStorage.getItem('user');
      setUser(userString && userString !== 'undefined' ? JSON.parse(userString) : null);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    window.dispatchEvent(new Event('storage'));
    navigate('/login');
  };

  return (
    <>
      <nav className="glass-panel" style={{ position: 'sticky', top: 0, zIndex: 100, borderRadius: 0, borderBottom: 'var(--glass-border)', padding: '1rem 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem', color: 'white' }}>
              M
            </div>
            <span style={{ fontSize: '1.2rem', fontWeight: 700, fontFamily: 'var(--font-display)' }}>
              Marketplace
            </span>
          </Link>

          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            {token && user ? (
              <>
                {user.role === 'ADMIN' && (
                  <Link to="/admin" style={{ color: 'var(--danger)', fontWeight: 'bold' }} className="hover-scale">Admin Panel</Link>
                )}
                {user.role === 'BUSINESS_OWNER' && (
                  <Link to="/business-dashboard" style={{ color: 'var(--accent-primary)', fontWeight: 'bold' }} className="hover-scale">Dashboard</Link>
                )}
                <Link to="/my-bookings" style={{ color: 'var(--text-primary)', fontWeight: 500 }} className="hover-scale">My Bookings</Link>
                <Link to="/profile" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div className="hover-scale" style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--bg-card)', padding: '5px 15px', borderRadius: '20px', cursor: 'pointer' }}>
                    <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{user.name}</span>
                  </div>
                </Link>
                <button className="btn-secondary" onClick={handleLogout} style={{ padding: '8px 16px', borderRadius: '20px' }}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-secondary" style={{ padding: '8px 20px', borderRadius: '20px' }}>Log In</Link>
                <Link to="/register" className="btn-primary" style={{ padding: '8px 20px', borderRadius: '20px' }}>Register</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <main>
        <Outlet />
      </main>

      <footer style={{ marginTop: '5rem', padding: '3rem 0', borderTop: 'var(--glass-border)', background: 'rgba(0,0,0,0.2)' }}>
        <div className="container" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
          <p>© 2026 Multi-Service Marketplace. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
};

export default MainLayout;
