import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ROOM_TYPES = ['Standard Room', 'Deluxe Room', 'Suite', 'Family Room', 'Penthouse'];

const DashboardHotelRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [businessId, setBusinessId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  
  // We use the backend Product model to store Rooms
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '', // Used for number of rooms of this type
    category: 'Standard Room',
    image: '',
    imageFile: null,
    status: 'ACTIVE'
  });

  useEffect(() => {
    fetchBusinessAndRooms();
  }, []);

  const fetchBusinessAndRooms = async () => {
    try {
      const token = localStorage.getItem('token');
      const bizRes = await axios.get('http://localhost:5000/api/businesses/my', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (bizRes.data && bizRes.data.length > 0) {
        const business = bizRes.data[0];
        setBusinessId(business.id);
        
        const prodRes = await axios.get(`http://localhost:5000/api/products?businessId=${business.id}`);
        setRooms(prodRes.data.filter(p => p.status !== 'ARCHIVED'));
      } else {
        setError("No business found. Please create a business first.");
      }
    } catch (err) {
      console.error('Error fetching hotel rooms:', err);
      setError("Failed to load rooms.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, imageFile: e.target.files[0] });
  };

  const openAddModal = () => {
    setEditingRoom(null);
    setFormData({ 
      name: '', description: '', price: '', stock: '1', category: 'Standard Room', image: '', imageFile: null, status: 'ACTIVE' 
    });
    setIsModalOpen(true);
  };

  const openEditModal = (room) => {
    setEditingRoom(room);
    setFormData({
      name: room.name,
      description: room.description || '',
      price: room.price,
      stock: room.stock,
      category: room.category || 'Standard Room',
      image: room.image || '',
      imageFile: null,
      status: room.status
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
      submitData.append('description', formData.description);
      submitData.append('price', formData.price); // Price per night
      submitData.append('stock', formData.stock); // Quantity of rooms available
      submitData.append('category', formData.category);
      if (formData.status) submitData.append('status', formData.status);
      
      if (formData.imageFile) {
        submitData.append('imageFile', formData.imageFile);
      } else if (formData.image) {
        submitData.append('image', formData.image);
      }

      if (editingRoom) {
        await axios.put(`http://localhost:5000/api/products/${editingRoom.id}`, submitData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`http://localhost:5000/api/businesses/${businessId}/products`, submitData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      closeModal();
      fetchBusinessAndRooms();
    } catch (err) {
      console.error('Error saving room:', err);
      alert('Failed to save room.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this room type?")) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchBusinessAndRooms();
      } catch (err) {
        console.error('Error deleting room:', err);
        alert('Failed to delete room.');
      }
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '3rem', color: '#0f172a' }}>Loading rooms...</div>;
  if (error) return <div style={{ textAlign: 'center', padding: '3rem', color: '#ef4444' }}>{error}</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ textTransform: 'uppercase', color: '#64748b', fontSize: '0.9rem', fontWeight: 'bold', letterSpacing: '2px' }}>Inventory</span>
          <h1 style={{ fontSize: '2.5rem', margin: '0.5rem 0 0 0', color: '#0f172a' }}>Hotel Rooms</h1>
        </div>
        <button 
          onClick={openAddModal}
          style={{ 
            background: '#0f172a', color: 'white', border: 'none', padding: '12px 24px', 
            borderRadius: '8px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer',
            boxShadow: '0 4px 6px -1px rgba(15, 23, 42, 0.5)'
          }}
        >
          + Add Room Type
        </button>
      </div>

      <div style={{ padding: '1rem 0' }}>
        {rooms.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b', background: 'white', borderRadius: '15px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>🛏️</span>
            <p style={{ fontSize: '1.2rem' }}>No rooms configured. Add your first room type (e.g. Deluxe Room)!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {rooms.map(room => (
              <div key={room.id} style={{ 
                background: 'white', borderRadius: '15px', overflow: 'hidden', 
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', border: '1px solid #e2e8f0', flexWrap: 'wrap'
              }}>
                <div style={{ width: '300px', background: `url(${room.image?.startsWith('/uploads') ? 'http://localhost:5000' + room.image : room.image}) center/cover no-repeat`, minHeight: '200px', borderRight: '1px solid #e2e8f0' }}></div>
                
                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>
                      {room.category}
                    </span>
                    <span style={{ fontSize: '0.8rem', padding: '4px 10px', borderRadius: '8px', background: room.stock > 0 ? '#dcfce7' : '#fee2e2', color: room.stock > 0 ? '#166534' : '#991b1b', fontWeight: 'bold' }}>
                      {room.stock} Available
                    </span>
                  </div>
                  
                  <h3 style={{ margin: '0 0 10px 0', fontSize: '1.5rem', color: '#0f172a' }}>{room.name}</h3>
                  <div style={{ color: '#475569', fontSize: '0.9rem', marginBottom: '15px', lineHeight: '1.5' }}>
                    {room.description || 'No description provided.'}
                  </div>

                  <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#2563eb', marginBottom: '15px', marginTop: 'auto' }}>
                    {room.price} ETB <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 'normal' }}>/ night</span>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
                    <button style={{ flex: 1, padding: '10px', background: '#f1f5f9', color: '#0f172a', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }} onClick={() => openEditModal(room)}>Edit</button>
                    <button style={{ flex: 1, padding: '10px', background: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }} onClick={() => handleDelete(room.id)}>Delete</button>
                  </div>
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
          <div style={{ background: 'white', width: '100%', maxWidth: '600px', padding: '2.5rem', borderRadius: '15px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)' }}>
            <h2 style={{ marginBottom: '1.5rem', marginTop: 0, color: '#0f172a' }}>{editingRoom ? 'Edit Room' : 'Add New Room'}</h2>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ color: '#475569', fontWeight: 'bold', fontSize: '0.9rem' }}>Room Name (e.g. Deluxe Ocean View)</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none' }} />
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flex: 1 }}>
                  <label style={{ color: '#475569', fontWeight: 'bold', fontSize: '0.9rem' }}>Room Category</label>
                  <select name="category" value={formData.category} onChange={handleInputChange} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', background: 'white', outline: 'none' }}>
                    {ROOM_TYPES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flex: 1 }}>
                  <label style={{ color: '#475569', fontWeight: 'bold', fontSize: '0.9rem' }}>Quantity of Rooms</label>
                  <input type="number" name="stock" value={formData.stock} onChange={handleInputChange} required min="0" style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none' }} placeholder="How many of these rooms?" />
                </div>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ color: '#475569', fontWeight: 'bold', fontSize: '0.9rem' }}>Description / Amenities</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} rows="3" placeholder="1 King Bed, Max 3 Guests, City View, Free WiFi..." style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none' }}></textarea>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ color: '#475569', fontWeight: 'bold', fontSize: '0.9rem' }}>Price per Night (ETB)</label>
                <input type="number" name="price" value={formData.price} onChange={handleInputChange} required min="0" step="0.01" style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none' }} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ color: '#475569', fontWeight: 'bold', fontSize: '0.9rem' }}>Room Image</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <input type="file" accept="image/*" onChange={handleFileChange} style={{ padding: '10px', border: '1px dashed #cbd5e1', borderRadius: '8px' }} />
                  <div style={{ textAlign: 'center', fontSize: '0.8rem', color: '#94a3b8' }}>OR</div>
                  <input type="url" name="image" value={formData.image} onChange={handleInputChange} placeholder="Paste Image URL instead..." disabled={!!formData.imageFile} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', opacity: formData.imageFile ? 0.5 : 1 }} />
                </div>
              </div>

              {editingRoom && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label style={{ color: '#475569', fontWeight: 'bold', fontSize: '0.9rem' }}>Status</label>
                  <select name="status" value={formData.status} onChange={handleInputChange} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', background: 'white' }}>
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>
              )}

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={closeModal} style={{ flex: 1, padding: '12px', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ flex: 1, padding: '12px', background: '#0f172a', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                  {editingRoom ? 'Save Changes' : 'Add Room'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardHotelRooms;
