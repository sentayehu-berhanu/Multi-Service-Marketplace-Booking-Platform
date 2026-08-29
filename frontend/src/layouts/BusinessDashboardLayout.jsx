import React, { useState, useEffect } from 'react';
import { Outlet, Link } from 'react-router-dom';

const BusinessDashboardLayout = () => {
  const [user, setUser] = useState(() => {
    const userString = localStorage.getItem('user');
    return userString && userString !== 'undefined' ? JSON.parse(userString) : null;
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const userString = localStorage.getItem('user');
      setUser(userString && userString !== 'undefined' ? JSON.parse(userString) : null);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-secondary)' }}>
      {/* Sidebar */}
      <aside className="glass-panel" style={{ width: '250px', borderRight: 'var(--glass-border)', borderRadius: 0, padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: '3rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '35px', height: '35px', borderRadius: '8px', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'white' }}>
            B
          </div>
          <span style={{ fontSize: '1.2rem', fontWeight: 600, fontFamily: 'var(--font-display)' }}>Biz Panel</span>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Link to="/business-dashboard" className="hover-scale" style={{ padding: '10px 15px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)', fontWeight: 500 }}>
            📊 Dashboard
          </Link>
          <Link to="#" className="hover-scale" style={{ padding: '10px 15px', borderRadius: '10px', color: 'var(--text-secondary)' }} onClick={(e) => { e.preventDefault(); alert('Calendar view coming soon!'); }}>
            📅 Calendar
          </Link>
          <Link to="#" className="hover-scale" style={{ padding: '10px 15px', borderRadius: '10px', color: 'var(--text-secondary)' }} onClick={(e) => { e.preventDefault(); alert('Services management coming soon!'); }}>
            🏷️ Services
          </Link>
          <Link to="#" className="hover-scale" style={{ padding: '10px 15px', borderRadius: '10px', color: 'var(--text-secondary)' }} onClick={(e) => { e.preventDefault(); alert('Customers list coming soon!'); }}>
            👥 Customers
          </Link>
          <Link to="#" className="hover-scale" style={{ padding: '10px 15px', borderRadius: '10px', color: 'var(--text-secondary)' }} onClick={(e) => { e.preventDefault(); alert('Reviews management coming soon!'); }}>
            ⭐ Reviews
          </Link>
        </nav>

        <div style={{ marginTop: 'auto' }}>
          <Link to="/" style={{ padding: '10px 15px', color: 'var(--text-secondary)', display: 'block' }}>
            ← Back to Storefront
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <header style={{ padding: '1.5rem 3rem', borderBottom: 'var(--glass-border)', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <span style={{ position: 'relative', cursor: 'pointer' }}>
              🔔
              <span style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'var(--danger)', width: '8px', height: '8px', borderRadius: '50%' }}></span>
            </span>
            <Link to="/profile" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="hover-scale" style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--bg-card)', padding: '5px 15px', borderRadius: '20px', cursor: 'pointer' }}>
                <span style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'var(--accent-primary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
                  {user ? user.name.charAt(0).toUpperCase() : 'O'}
                </span>
                <span style={{ fontSize: '0.9rem' }}>{user ? user.name : 'Owner'}</span>
              </div>
            </Link>
          </div>
        </header>

        {/* Dashboard Content */}
        <div style={{ padding: '3rem', overflowY: 'auto', flex: 1 }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default BusinessDashboardLayout;
