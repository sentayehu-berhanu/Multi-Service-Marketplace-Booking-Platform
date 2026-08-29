import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setEditName(parsedUser.name || '');
      setEditPhone(parsedUser.phone || '');
    } else {
      navigate('/login');
    }
  }, [navigate]);

  if (!user) {
    return <div style={{ padding: '4rem', textAlign: 'center' }}>Loading profile...</div>;
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.put('http://localhost:5000/api/users/profile', 
        { name: editName, phone: editPhone },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const updatedUser = res.data.user;
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setIsEditing(false);
      
      // Dispatch a custom event so MainLayout/DashboardLayout can update instantly without a full reload
      window.dispatchEvent(new Event('storage'));
      
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '4rem auto', padding: '0 20px' }}>
      <h1 style={{ marginBottom: '2rem', fontSize: '2.5rem' }}>My Profile</h1>
      
      <div className="glass-panel" style={{ padding: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '3rem', fontWeight: 'bold' }}>
          {user.name.charAt(0).toUpperCase()}
        </div>
        
        {isEditing ? (
          <div style={{ width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Name</label>
              <input 
                type="text" 
                value={editName} 
                onChange={(e) => setEditName(e.target.value)} 
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Phone Number</label>
              <input 
                type="text" 
                value={editPhone} 
                onChange={(e) => setEditPhone(e.target.value)} 
                placeholder="Enter phone number"
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white' }}
              />
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.8rem', margin: 0 }}>{user.name}</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', margin: 0 }}>{user.email}</p>
            {user.phone && <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', margin: '5px 0 0 0' }}>{user.phone}</p>}
          </div>
        )}
        
        <div style={{ marginTop: '1rem', padding: '5px 15px', background: 'rgba(255,255,255,0.1)', borderRadius: '20px', color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: 500 }}>
          Account Type: {user.role === 'BUSINESS_OWNER' ? 'Business Owner' : user.role === 'CUSTOMER' ? 'Customer' : user.role}
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', width: '100%', justifyContent: 'center' }}>
          {isEditing ? (
            <>
              <button className="btn-primary" onClick={handleSave} disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</button>
              <button className="btn-secondary" onClick={() => {
                setIsEditing(false);
                setEditName(user.name);
                setEditPhone(user.phone || '');
              }}>Cancel</button>
            </>
          ) : (
            <>
              <button className="btn-secondary" onClick={() => setIsEditing(true)}>Edit Profile</button>
              <button className="btn-primary" onClick={handleLogout}>Logout</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
