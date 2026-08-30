import React, { useState, useEffect, useRef } from 'react';
import { Outlet, Link } from 'react-router-dom';
import axios from 'axios';

const BusinessDashboardLayout = () => {
  const [user, setUser] = useState(() => {
    const userString = localStorage.getItem('user');
    return userString && userString !== 'undefined' ? JSON.parse(userString) : null;
  });

  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef(null);

  useEffect(() => {
    const handleStorageChange = () => {
      const userString = localStorage.getItem('user');
      setUser(userString && userString !== 'undefined' ? JSON.parse(userString) : null);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  // Click outside to close notifications
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await axios.get('http://localhost:5000/api/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(res.data);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const handleMarkAsRead = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/notifications/mark-all-read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(notifications.map(n => ({ ...n, is_read: true })));
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  const getNotifIcon = (type) => {
    switch(type) {
      case 'BOOKING': return '📅';
      case 'REVIEW': return '⭐';
      case 'MESSAGE': return '💬';
      default: return '🔔';
    }
  };

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
          <Link to="/business-dashboard/calendar" className="hover-scale" style={{ padding: '10px 15px', borderRadius: '10px', color: 'var(--text-secondary)' }}>
            📅 Calendar
          </Link>
          <Link to="/business-dashboard/services" className="hover-scale" style={{ padding: '10px 15px', borderRadius: '10px', color: 'var(--text-secondary)' }}>
            🏷️ Services
          </Link>
          <Link to="/business-dashboard/customers" className="hover-scale" style={{ padding: '10px 15px', borderRadius: '10px', color: 'var(--text-secondary)' }}>
            👥 Customers
          </Link>
          <Link to="/business-dashboard/reviews" className="hover-scale" style={{ padding: '10px 15px', borderRadius: '10px', color: 'var(--text-secondary)' }}>
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
        <header style={{ padding: '1.5rem 3rem', borderBottom: 'var(--glass-border)', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', position: 'relative' }}>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            
            {/* Notification Bell */}
            <div ref={notifRef} style={{ position: 'relative' }}>
              <span 
                style={{ position: 'relative', cursor: 'pointer', fontSize: '1.2rem', padding: '5px' }}
                onClick={() => setShowNotifications(!showNotifications)}
              >
                🔔
                {unreadCount > 0 && (
                  <span style={{ position: 'absolute', top: '0', right: '0', background: 'var(--danger)', width: '10px', height: '10px', borderRadius: '50%', border: '2px solid var(--bg-secondary)' }}></span>
                )}
              </span>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="glass-panel" style={{ 
                  position: 'absolute', 
                  top: '40px', 
                  right: '-10px', 
                  width: '320px', 
                  maxHeight: '400px', 
                  overflowY: 'auto',
                  zIndex: 100,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <div style={{ padding: '15px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)' }}>
                    <h4 style={{ margin: 0, fontWeight: 600 }}>Notifications</h4>
                    {unreadCount > 0 && (
                      <button onClick={handleMarkAllAsRead} style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', fontSize: '0.8rem', cursor: 'pointer' }}>
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div style={{ flex: 1 }}>
                    {notifications.length === 0 ? (
                      <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                        No notifications yet.
                      </div>
                    ) : (
                      notifications.map(notif => (
                        <div 
                          key={notif.id} 
                          onClick={() => !notif.is_read && handleMarkAsRead(notif.id)}
                          style={{ 
                            padding: '12px 15px', 
                            borderBottom: '1px solid rgba(255,255,255,0.03)',
                            background: notif.is_read ? 'transparent' : 'rgba(107, 70, 193, 0.1)',
                            cursor: notif.is_read ? 'default' : 'pointer',
                            display: 'flex',
                            gap: '12px',
                            transition: 'background 0.2s'
                          }}
                        >
                          <div style={{ fontSize: '1.2rem', paddingTop: '2px' }}>
                            {getNotifIcon(notif.type)}
                          </div>
                          <div style={{ flex: 1 }}>
                            <h5 style={{ margin: '0 0 3px 0', fontSize: '0.9rem', color: notif.is_read ? 'var(--text-secondary)' : 'var(--text-primary)' }}>
                              {notif.title}
                            </h5>
                            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.3 }}>
                              {notif.message}
                            </p>
                            <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', marginTop: '5px', display: 'block' }}>
                              {new Date(notif.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          {!notif.is_read && (
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-primary)', marginTop: '6px' }}></div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

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
