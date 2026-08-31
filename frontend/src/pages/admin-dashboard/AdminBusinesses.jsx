import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const AdminBusinesses = () => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/admin/businesses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBusinesses(res.data);
    } catch (err) {
      console.error('Failed to fetch admin businesses:', err);
      setError('Failed to load businesses. Make sure you have admin rights.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '3rem' }}>Loading businesses...</div>;
  if (error) return <div style={{ color: 'var(--danger)', padding: '1rem' }}>{error}</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>All Businesses (Admin)</h2>
        <Link to="/admin/create-business" className="btn-primary" style={{ textDecoration: 'none' }}>
          + Add New Business
        </Link>
      </div>

      {businesses.length === 0 ? (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)' }}>No businesses found.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {businesses.map((business) => (
            <div key={business.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: '0 0 0.5rem 0' }}>{business.name}</h3>
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  <span>🏷️ {business.category?.name}</span>
                  <span>👤 Owner: {business.owner?.name} ({business.owner?.email})</span>
                  <span>💼 Services: {business.services?.length || 0}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <span style={{ 
                  padding: '5px 12px', 
                  borderRadius: '20px', 
                  fontSize: '0.8rem',
                  background: business.status === 'ACTIVE' ? 'rgba(46, 213, 115, 0.2)' : 'rgba(255, 165, 2, 0.2)',
                  color: business.status === 'ACTIVE' ? '#2ed573' : '#ffa502'
                }}>
                  {business.status}
                </span>
                {/* Admin action buttons could go here */}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminBusinesses;
