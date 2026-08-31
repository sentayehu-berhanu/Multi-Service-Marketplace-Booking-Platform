import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';

const AdminDashboardLayout = () => {
  const [user, setUser] = useState(() => {
    const userString = localStorage.getItem('user');
    return userString && userString !== 'undefined' ? JSON.parse(userString) : null;
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    // Basic protection: Ensure user is ADMIN
    if (!user || user.role !== 'ADMIN') {
      navigate('/login');
    }

    const handleStorageChange = () => {
      const userString = localStorage.getItem('user');
      const parsedUser = userString && userString !== 'undefined' ? JSON.parse(userString) : null;
      setUser(parsedUser);
      if (!parsedUser || parsedUser.role !== 'ADMIN') {
        navigate('/login');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [user, navigate]);

  if (!user || user.role !== 'ADMIN') return null;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-secondary)' }}>
      {/* Sidebar */}
      <aside className="glass-panel" style={{ width: '250px', borderRight: 'var(--glass-border)', borderRadius: 0, padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: '3rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '35px', height: '35px', borderRadius: '8px', background: 'linear-gradient(135deg, #FF416C 0%, #FF4B2B 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'white' }}>
            A
          </div>
          <span style={{ fontSize: '1.2rem', fontWeight: 600, fontFamily: 'var(--font-display)' }}>Admin Panel</span>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Link to="/admin" className="hover-scale" style={{ padding: '10px 15px', borderRadius: '10px', color: 'var(--text-secondary)' }}>
            🏢 All Businesses
          </Link>
          <Link to="/admin/create-business" className="hover-scale" style={{ padding: '10px 15px', borderRadius: '10px', color: 'var(--text-secondary)' }}>
            ➕ Add Business & Owner
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
            <Link to="/profile" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="hover-scale" style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--bg-card)', padding: '5px 15px', borderRadius: '20px', cursor: 'pointer' }}>
                <span style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'linear-gradient(135deg, #FF416C 0%, #FF4B2B 100%)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
                  {user.name.charAt(0).toUpperCase()}
                </span>
                <span style={{ fontSize: '0.9rem' }}>{user.name} (Admin)</span>
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

export default AdminDashboardLayout;
