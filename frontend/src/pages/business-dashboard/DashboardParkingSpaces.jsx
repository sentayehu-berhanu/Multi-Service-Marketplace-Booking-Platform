import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DashboardParkingSpaces = () => {
  const [spaces, setSpaces] = useState([]);
  const [businessId, setBusinessId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSpace, setEditingSpace] = useState(null);
  
  // For Parking, 'name' is the Space ID (e.g. A01), 'price' is hourly rate. 
  // 'duration' defaults to 60 (mins) behind the scenes to satisfy the backend Service model.
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    status: 'ACTIVE'
  });

  useEffect(() => {
    fetchBusinessAndSpaces();
  }, []);

  const fetchBusinessAndSpaces = async () => {
    try {
      const token = localStorage.getItem('token');
      const bizRes = await axios.get('http://localhost:5000/api/businesses/my', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (bizRes.data && bizRes.data.length > 0) {
        const business = bizRes.data[0];
        setBusinessId(business.id);
        setSpaces(business.services.filter(s => s.status !== 'ARCHIVED'));
      } else {
        setError("No business found. Please create a business first.");
      }
    } catch (err) {
      console.error('Error fetching parking spaces:', err);
      setError("Failed to load parking spaces.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openAddModal = () => {
    setEditingSpace(null);
    setFormData({ name: '', price: '100', status: 'ACTIVE' });
    setIsModalOpen(true);
  };

  const openEditModal = (space) => {
    setEditingSpace(space);
    setFormData({
      name: space.name,
      price: space.price,
      status: space.status
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      
      const submitData = new FormData();
      submitData.append('name', formData.name); // E.g., A01
      submitData.append('price', formData.price); // Hourly rate
      submitData.append('duration', 60); // Default to 1 hour for backend compatibility
      if (formData.status) submitData.append('status', formData.status);

      if (editingSpace) {
        await axios.put(`http://localhost:5000/api/businesses/${businessId}/services/${editingSpace.id}`, submitData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`http://localhost:5000/api/businesses/${businessId}/services`, submitData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      closeModal();
      fetchBusinessAndSpaces();
    } catch (err) {
      console.error('Error saving parking space:', err);
      alert('Failed to save parking space.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this parking space?")) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/businesses/${businessId}/services/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchBusinessAndSpaces();
      } catch (err) {
        console.error('Error deleting parking space:', err);
        alert('Failed to delete space.');
      }
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '3rem', color: '#38bdf8' }}>Loading parking grid...</div>;
  if (error) return <div style={{ textAlign: 'center', padding: '3rem', color: '#ef4444' }}>{error}</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', fontFamily: "sans-serif" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <span style={{ textTransform: 'uppercase', color: '#64748b', fontSize: '0.9rem', fontWeight: 'bold', letterSpacing: '2px' }}>Management</span>
          <h1 style={{ fontSize: '2.5rem', margin: '0.5rem 0 0 0', color: '#0f172a' }}>Parking Spaces</h1>
        </div>
        <button 
          onClick={openAddModal}
          style={{ 
            background: '#3b82f6', color: 'white', border: 'none', padding: '12px 24px', 
            borderRadius: '8px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer',
            boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.5)'
          }}
        >
          + Add New Space
        </button>
      </div>

      <div style={{ padding: '1rem 0' }}>
        {spaces.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b', background: 'white', borderRadius: '15px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>🚗</span>
            <p style={{ fontSize: '1.2rem' }}>No parking spaces configured yet. Add spaces like "A01" to build your map!</p>
          </div>
        ) : (
          <div style={{ 
            background: '#e2e8f0', padding: '2rem', borderRadius: '15px', 
            display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '15px'
          }}>
            {spaces.map(space => (
              <div 
                key={space.id} 
                style={{
                  background: space.status === 'INACTIVE' ? '#cbd5e1' : 'white',
                  color: space.status === 'INACTIVE' ? '#94a3b8' : '#334155',
                  padding: '1.5rem 1rem',
                  borderRadius: '10px',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  boxShadow: space.status === 'INACTIVE' ? 'none' : '0 4px 6px -1px rgba(0,0,0,0.1)',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}
              >
                <div style={{ fontSize: '1.5rem', color: '#0f172a' }}>{space.name}</div>
                <div style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 'normal' }}>
                  {space.status === 'INACTIVE' ? '🔴 Occupied' : '🟢 Available'}
                </div>
                <div style={{ fontSize: '0.9rem', color: '#3b82f6' }}>{space.price} ETB/hr</div>
                
                <div style={{ display: 'flex', gap: '5px', marginTop: '10px' }}>
                  <button 
                    style={{ flex: 1, background: '#f1f5f9', color: '#3b82f6', border: '1px solid #cbd5e1', padding: '5px', borderRadius: '5px', fontSize: '0.8rem', cursor: 'pointer' }}
                    onClick={() => openEditModal(space)}
                  >
                    Edit
                  </button>
                  <button 
                    style={{ flex: 1, background: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5', padding: '5px', borderRadius: '5px', fontSize: '0.8rem', cursor: 'pointer' }}
                    onClick={() => handleDelete(space.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div style={{ 
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(3px)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 
        }}>
          <div style={{ background: 'white', width: '100%', maxWidth: '400px', padding: '2.5rem', borderRadius: '15px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)' }}>
            <h2 style={{ marginBottom: '1.5rem', marginTop: 0, color: '#0f172a' }}>
              {editingSpace ? 'Edit Space' : 'Add Parking Space'}
            </h2>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ color: '#475569', fontWeight: 'bold', fontSize: '0.9rem' }}>Space Identifier (e.g., A01)</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem' }} placeholder="A01" />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ color: '#475569', fontWeight: 'bold', fontSize: '0.9rem' }}>Hourly Rate (ETB)</label>
                <input type="number" name="price" value={formData.price} onChange={handleInputChange} required min="0" step="0.01" style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem' }} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ color: '#475569', fontWeight: 'bold', fontSize: '0.9rem' }}>Availability</label>
                <select name="status" value={formData.status} onChange={handleInputChange} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', background: 'white' }}>
                  <option value="ACTIVE">🟢 Available (ACTIVE)</option>
                  <option value="INACTIVE">🔴 Occupied (INACTIVE)</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={closeModal} style={{ flex: 1, padding: '12px', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ flex: 1, padding: '12px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                  {editingSpace ? 'Update Space' : 'Save Space'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardParkingSpaces;
