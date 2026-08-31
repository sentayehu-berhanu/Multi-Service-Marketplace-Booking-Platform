import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminCreateBusiness = () => {
  const [categories, setCategories] = useState([]);
  
  // Business details
  const [businessName, setBusinessName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [businessPhone, setBusinessPhone] = useState('');
  const [businessEmail, setBusinessEmail] = useState('');
  
  // Owner details
  const [ownerName, setOwnerName] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [ownerPassword, setOwnerPassword] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/businesses/categories');
      setCategories(res.data);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/admin/businesses', {
        businessName,
        categoryId,
        description,
        address,
        phone: businessPhone,
        email: businessEmail,
        ownerName,
        ownerEmail,
        ownerPassword,
        ownerPhone
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert('Business and Owner created successfully!');
      navigate('/admin');
    } catch (err) {
      console.error('Failed to create business:', err);
      setError(err.response?.data?.error || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '2rem' }}>Add New Business & Owner</h2>

      {error && (
        <div style={{ background: 'rgba(255, 71, 87, 0.1)', color: '#ff4757', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid rgba(255, 71, 87, 0.2)' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Owner Information Section */}
        <div>
          <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem', marginBottom: '1.5rem', color: 'var(--accent-primary)' }}>1. Owner Account Details</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.95rem', fontWeight: 500 }}>Owner Name *</label>
              <input type="text" value={ownerName} onChange={e => setOwnerName(e.target.value)} required style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: '1rem', fontFamily: 'var(--font-body)' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.95rem', fontWeight: 500 }}>Owner Email *</label>
              <input type="email" value={ownerEmail} onChange={e => setOwnerEmail(e.target.value)} required style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: '1rem', fontFamily: 'var(--font-body)' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.95rem', fontWeight: 500 }}>Owner Password *</label>
              <input type="password" value={ownerPassword} onChange={e => setOwnerPassword(e.target.value)} required style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: '1rem', fontFamily: 'var(--font-body)' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.95rem', fontWeight: 500 }}>Owner Phone</label>
              <input type="text" value={ownerPhone} onChange={e => setOwnerPhone(e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: '1rem', fontFamily: 'var(--font-body)' }} />
            </div>
          </div>
        </div>

        {/* Business Information Section */}
        <div>
          <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem', marginBottom: '1.5rem', color: 'var(--accent-primary)' }}>2. Business Details</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.95rem', fontWeight: 500 }}>Business Name *</label>
              <input type="text" value={businessName} onChange={e => setBusinessName(e.target.value)} required style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: '1rem', fontFamily: 'var(--font-body)' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.95rem', fontWeight: 500 }}>Category *</label>
              <select value={categoryId} onChange={e => setCategoryId(e.target.value)} required style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'var(--bg-secondary)', color: 'white', fontSize: '1rem', fontFamily: 'var(--font-body)' }}>
                <option value="">Select a category</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.95rem', fontWeight: 500 }}>Description</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} rows="3" style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white', resize: 'vertical', fontSize: '1rem', fontFamily: 'var(--font-body)' }}></textarea>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.95rem', fontWeight: 500 }}>Business Email</label>
              <input type="email" value={businessEmail} onChange={e => setBusinessEmail(e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: '1rem', fontFamily: 'var(--font-body)' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.95rem', fontWeight: 500 }}>Business Phone</label>
              <input type="text" value={businessPhone} onChange={e => setBusinessPhone(e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: '1rem', fontFamily: 'var(--font-body)' }} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.95rem', fontWeight: 500 }}>Address</label>
              <input type="text" value={address} onChange={e => setAddress(e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: '1rem', fontFamily: 'var(--font-body)' }} />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
          <button type="button" className="btn-secondary" onClick={() => navigate('/admin')}>Cancel</button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Creating...' : 'Create Business & Owner'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminCreateBusiness;
