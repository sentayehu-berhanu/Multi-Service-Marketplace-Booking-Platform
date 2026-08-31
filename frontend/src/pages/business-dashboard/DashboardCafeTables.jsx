import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DashboardCafeTables = () => {
  const [tables, setTables] = useState([]);
  const [businessId, setBusinessId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTable, setEditingTable] = useState(null);
  
  // For Cafe Tables:
  // 'name' is the Table ID (e.g. T1)
  // 'duration' stores the table capacity (e.g., 4 guests)
  // 'price' is a booking fee (often 0)
  const [formData, setFormData] = useState({
    name: '',
    capacity: '2',
    price: '0',
    status: 'ACTIVE'
  });

  useEffect(() => {
    fetchBusinessAndTables();
  }, []);

  const fetchBusinessAndTables = async () => {
    try {
      const token = localStorage.getItem('token');
      const bizRes = await axios.get('http://localhost:5000/api/businesses/my', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (bizRes.data && bizRes.data.length > 0) {
        const business = bizRes.data[0];
        setBusinessId(business.id);
        setTables(business.services.filter(s => s.status !== 'ARCHIVED'));
      } else {
        setError("No business found. Please create a business first.");
      }
    } catch (err) {
      console.error('Error fetching cafe tables:', err);
      setError("Failed to load tables.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openAddModal = () => {
    setEditingTable(null);
    setFormData({ name: '', capacity: '2', price: '0', status: 'ACTIVE' });
    setIsModalOpen(true);
  };

  const openEditModal = (table) => {
    setEditingTable(table);
    setFormData({
      name: table.name,
      capacity: table.duration, // duration stores capacity
      price: table.price,
      status: table.status
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
      submitData.append('name', formData.name); 
      submitData.append('price', formData.price); 
      submitData.append('duration', formData.capacity); 
      if (formData.status) submitData.append('status', formData.status);

      if (editingTable) {
        await axios.put(`http://localhost:5000/api/businesses/${businessId}/services/${editingTable.id}`, submitData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`http://localhost:5000/api/businesses/${businessId}/services`, submitData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      closeModal();
      fetchBusinessAndTables();
    } catch (err) {
      console.error('Error saving table:', err);
      alert('Failed to save table.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this table?")) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/businesses/${businessId}/services/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchBusinessAndTables();
      } catch (err) {
        console.error('Error deleting table:', err);
        alert('Failed to delete table.');
      }
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '3rem', color: '#78350f' }}>Loading tables...</div>;
  if (error) return <div style={{ textAlign: 'center', padding: '3rem', color: '#ef4444' }}>{error}</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', fontFamily: "'Outfit', sans-serif" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <span style={{ textTransform: 'uppercase', color: '#92400e', fontSize: '0.9rem', fontWeight: 'bold', letterSpacing: '2px' }}>Management</span>
          <h1 style={{ fontSize: '2.5rem', margin: '0.5rem 0 0 0', color: '#451a03' }}>Tables</h1>
        </div>
        <button 
          onClick={openAddModal}
          style={{ 
            background: '#d97706', color: 'white', border: 'none', padding: '12px 24px', 
            borderRadius: '8px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer',
            boxShadow: '0 4px 6px -1px rgba(217, 119, 6, 0.5)'
          }}
        >
          + Add New Table
        </button>
      </div>

      <div style={{ padding: '1rem 0' }}>
        {tables.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#78350f', background: 'white', borderRadius: '15px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #fde68a' }}>
            <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>🪑</span>
            <p style={{ fontSize: '1.2rem' }}>No tables configured yet. Add tables like "T1" to build your reservation map!</p>
          </div>
        ) : (
          <div style={{ 
            background: '#fffbeb', padding: '2rem', borderRadius: '15px', border: '1px solid #fde68a',
            display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '15px'
          }}>
            {tables.map(table => (
              <div 
                key={table.id} 
                style={{
                  background: table.status === 'INACTIVE' ? '#78350f' : 'white',
                  color: table.status === 'INACTIVE' ? 'white' : '#451a03',
                  padding: '1.5rem 1rem',
                  borderRadius: '10px',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  boxShadow: table.status === 'INACTIVE' ? 'none' : '0 4px 6px -1px rgba(0,0,0,0.1)',
                  border: table.status === 'INACTIVE' ? '2px solid #78350f' : '2px solid #fcd34d',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}
              >
                <div style={{ fontSize: '1.5rem' }}>{table.name}</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 'normal', opacity: 0.8 }}>
                  Up to {table.duration} pax
                </div>
                
                {table.status === 'INACTIVE' ? (
                   <div style={{ width: '8px', height: '8px', background: '#ef4444', borderRadius: '50%', margin: '0 auto' }}></div>
                ) : (
                   <div style={{ width: '8px', height: '8px', background: '#22c55e', borderRadius: '50%', margin: '0 auto' }}></div>
                )}
                
                {table.price > 0 && <div style={{ fontSize: '0.8rem', color: '#d97706' }}>Fee: {table.price} ETB</div>}
                
                <div style={{ display: 'flex', gap: '5px', marginTop: '10px' }}>
                  <button 
                    style={{ flex: 1, background: '#fef3c7', color: '#92400e', border: 'none', padding: '5px', borderRadius: '5px', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 'bold' }}
                    onClick={() => openEditModal(table)}
                  >
                    Edit
                  </button>
                  <button 
                    style={{ flex: 1, background: '#fee2e2', color: '#dc2626', border: 'none', padding: '5px', borderRadius: '5px', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 'bold' }}
                    onClick={() => handleDelete(table.id)}
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
          background: 'rgba(69, 26, 3, 0.7)', backdropFilter: 'blur(3px)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 
        }}>
          <div style={{ background: 'white', width: '100%', maxWidth: '400px', padding: '2.5rem', borderRadius: '15px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)' }}>
            <h2 style={{ marginBottom: '1.5rem', marginTop: 0, color: '#451a03' }}>
              {editingTable ? 'Edit Table' : 'Add New Table'}
            </h2>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ color: '#78350f', fontWeight: 'bold', fontSize: '0.9rem' }}>Table Identifier (e.g., T1)</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required style={{ padding: '12px', borderRadius: '8px', border: '1px solid #fcd34d', fontSize: '1rem', outline: 'none' }} placeholder="T1" />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ color: '#78350f', fontWeight: 'bold', fontSize: '0.9rem' }}>Capacity (Max Guests)</label>
                <input type="number" name="capacity" value={formData.capacity} onChange={handleInputChange} required min="1" style={{ padding: '12px', borderRadius: '8px', border: '1px solid #fcd34d', fontSize: '1rem', outline: 'none' }} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ color: '#78350f', fontWeight: 'bold', fontSize: '0.9rem' }}>Booking Fee (Optional, ETB)</label>
                <input type="number" name="price" value={formData.price} onChange={handleInputChange} required min="0" step="0.01" style={{ padding: '12px', borderRadius: '8px', border: '1px solid #fcd34d', fontSize: '1rem', outline: 'none' }} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ color: '#78350f', fontWeight: 'bold', fontSize: '0.9rem' }}>Availability</label>
                <select name="status" value={formData.status} onChange={handleInputChange} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #fcd34d', fontSize: '1rem', background: 'white', outline: 'none' }}>
                  <option value="ACTIVE">🟢 Available (ACTIVE)</option>
                  <option value="INACTIVE">🔴 Occupied (INACTIVE)</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={closeModal} style={{ flex: 1, padding: '12px', background: '#fffbeb', color: '#78350f', border: '1px solid #fde68a', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ flex: 1, padding: '12px', background: '#d97706', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                  {editingTable ? 'Update Table' : 'Save Table'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardCafeTables;
