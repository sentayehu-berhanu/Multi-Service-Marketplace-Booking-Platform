import React, { useState } from 'react';
import axios from 'axios';

const CreateCouponModal = ({ isOpen, onClose, businessId, onCouponCreated }) => {
  const [formData, setFormData] = useState({
    code: '',
    discount_type: 'PERCENTAGE',
    discount_value: '',
    valid_from: new Date().toISOString().split('T')[0],
    valid_until: '',
    usage_limit: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generateRandomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData({ ...formData, code });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`http://localhost:5000/api/businesses/${businessId}/coupons`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (onCouponCreated) {
        onCouponCreated(res.data.coupon);
      }
      onClose();
    } catch (err) {
      console.error('Failed to create coupon:', err);
      setError(err.response?.data?.error || 'Failed to create coupon.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(5px)'
    }}>
      <div className="glass-panel" style={{ width: '90%', maxWidth: '500px', padding: '2rem' }}>
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.8rem' }}>Create Coupon</h2>

        {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', padding: '10px', background: 'rgba(255,107,107,0.1)', borderRadius: '8px' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Coupon Code</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input 
                type="text" 
                name="code"
                value={formData.code} 
                onChange={handleChange}
                placeholder="e.g. SUMMER20"
                className="input-field"
                required
                style={{ flex: 1, textTransform: 'uppercase' }}
              />
              <button type="button" className="btn-secondary" onClick={generateRandomCode}>Randomize</button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Discount Type</label>
              <select name="discount_type" value={formData.discount_type} onChange={handleChange} className="input-field" required>
                <option value="PERCENTAGE">Percentage (%)</option>
                <option value="FIXED_AMOUNT">Fixed Amount (ETB)</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Discount Value</label>
              <input 
                type="number" 
                name="discount_value"
                value={formData.discount_value} 
                onChange={handleChange}
                placeholder={formData.discount_type === 'PERCENTAGE' ? 'e.g. 20' : 'e.g. 150'}
                className="input-field"
                required
                min="1"
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Valid From</label>
              <input 
                type="date" 
                name="valid_from"
                value={formData.valid_from} 
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Valid Until</label>
              <input 
                type="date" 
                name="valid_until"
                value={formData.valid_until} 
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Usage Limit (Optional)</label>
            <input 
              type="number" 
              name="usage_limit"
              value={formData.usage_limit} 
              onChange={handleChange}
              placeholder="e.g. 100 uses only"
              className="input-field"
              min="1"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
            <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Creating...' : 'Create Coupon'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCouponModal;
