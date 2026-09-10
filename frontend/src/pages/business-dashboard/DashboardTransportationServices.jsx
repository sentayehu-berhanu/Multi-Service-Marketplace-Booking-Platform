import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DashboardTransportationServices = () => {
  const [services, setServices] = useState([]);
  const [businessId, setBusinessId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Economy',
    transmission: 'Automatic',
    seats: 4,
    transportType: 'ride', // ADDED
    description: '',
    price: '',
    status: 'ACTIVE'
  });

  useEffect(() => {
    fetchBusinessAndServices();
  }, []);

  const fetchBusinessAndServices = async () => {
    try {
      const token = localStorage.getItem('token');
      const bizRes = await axios.get('http://localhost:5000/api/businesses/my', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (bizRes.data && bizRes.data.length > 0) {
        const business = bizRes.data[0];
        setBusinessId(business.id);
        setServices(business.services.filter(s => s.status !== 'ARCHIVED'));
      } else {
        setError("No business found. Please create a business first.");
      }
    } catch (err) {
      console.error('Error fetching services:', err);
      setError("Failed to load transportation services.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const parseDescription = (desc) => {
    try {
      const parsed = JSON.parse(desc);
      return parsed;
    } catch (e) {
      // Fallback if not JSON
      return { category: 'Economy', transmission: 'Automatic', seats: 4, transportType: 'ride', desc: desc || '' };
    }
  };

  const openAddModal = () => {
    setEditingService(null);
    setFormData({ name: '', category: 'Economy', transmission: 'Automatic', seats: 4, transportType: 'ride', description: '', price: '', status: 'ACTIVE' });
    setIsModalOpen(true);
  };

  const openEditModal = (service) => {
    setEditingService(service);
    
    const parsed = parseDescription(service.description);

    setFormData({
      name: service.name,
      category: parsed.category || 'Economy',
      transmission: parsed.transmission || 'Automatic',
      seats: parsed.seats || 4,
      transportType: parsed.transportType || 'ride',
      description: parsed.desc || '',
      price: service.price,
      status: service.status
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
      
      const metadata = {
        category: formData.category,
        transmission: formData.transmission,
        seats: formData.seats,
        transportType: formData.transportType, // ADDED
        desc: formData.description
      };
      
      submitData.append('description', JSON.stringify(metadata));
      submitData.append('price', formData.price);
      submitData.append('duration', 1440); // 1 day = 1440 minutes, just as a placeholder since duration is required
      if (formData.status) submitData.append('status', formData.status);

      if (editingService) {
        await axios.put(`http://localhost:5000/api/businesses/${businessId}/services/${editingService.id}`, submitData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`http://localhost:5000/api/businesses/${businessId}/services`, submitData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      closeModal();
      fetchBusinessAndServices();
    } catch (err) {
      console.error('Error saving transportation service:', err);
      alert('Failed to save service.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this vehicle/service?")) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/businesses/${businessId}/services/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchBusinessAndServices();
      } catch (err) {
        console.error('Error deleting transportation service:', err);
        alert('Failed to delete service.');
      }
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '3rem' }}>Loading transportation services...</div>;
  if (error) return <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--danger)' }}>{error}</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0f172a', padding: '2rem', borderRadius: '15px', color: 'white' }}>
        <div>
          <h1 style={{ fontSize: '2rem', margin: '0 0 10px 0' }}>Transportation Fleet & Services</h1>
          <p style={{ margin: 0, color: '#94a3b8' }}>Manage your available vehicles, rides, and packages.</p>
        </div>
        <button 
          onClick={openAddModal}
          style={{ background: '#2563eb', color: 'white', padding: '12px 24px', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}
        >
          + Add Vehicle/Service
        </button>
      </div>

      <div className="glass-panel" style={{ padding: '2rem' }}>
        {services.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
            No transportation services found. Add your first vehicle to get started!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '800px' }}>
            {services.map(service => {
              const parsed = parseDescription(service.description);
              return (
                <div key={service.id} className="glass-panel hover-scale" style={{ padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: '15px', borderLeft: '4px solid #f59e0b' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '5px' }}>
                      <h3 style={{ fontSize: '1.3rem', margin: 0, color: 'var(--text-primary)' }}>{service.name}</h3>
                      <span style={{ 
                        fontSize: '0.75rem', 
                        padding: '2px 8px', 
                        borderRadius: '12px', 
                        background: service.status === 'ACTIVE' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                        color: service.status === 'ACTIVE' ? '#10b981' : '#ef4444',
                        fontWeight: 'bold'
                      }}>
                        {service.status}
                      </span>
                    </div>
                    <p style={{ color: '#64748b', margin: 0, fontSize: '0.95rem' }}>
                      {parsed.desc || 'No description provided.'}
                    </p>
                    <div style={{ color: '#475569', fontSize: '0.85rem', marginTop: '10px', display: 'flex', gap: '10px' }}>
                      <span style={{ background: '#f1f5f9', padding: '4px 10px', borderRadius: '6px', fontWeight: '600' }}>
                        🚕 {parsed.category}
                      </span>
                      <span style={{ background: '#f1f5f9', padding: '4px 10px', borderRadius: '6px' }}>
                        ⚙️ {parsed.transmission}
                      </span>
                      <span style={{ background: '#f1f5f9', padding: '4px 10px', borderRadius: '6px' }}>
                        💺 {parsed.seats} Seats
                      </span>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                    <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#f59e0b' }}>
                      {service.price} ETB
                      <div style={{ fontSize: '0.8rem', color: '#64748b', textAlign: 'right' }}>/ day</div>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.9rem' }} onClick={() => openEditModal(service)}>Edit</button>
                      <button className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.9rem', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }} onClick={() => handleDelete(service.id)}>Delete</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(5px)' }}>
          <div className="glass-panel" style={{ background: 'var(--bg-primary)', padding: '2.5rem', borderRadius: '20px', width: '100%', maxWidth: '500px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
            <h2 style={{ margin: '0 0 1.5rem 0', fontSize: '1.8rem' }}>
              {editingService ? 'Edit Vehicle/Service' : 'Add Vehicle/Service'}
            </h2>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: 'var(--text-secondary)' }}>Name (e.g. Toyota Corolla)</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required 
                  style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: 'var(--bg-secondary)', color: 'white' }}
                  placeholder="Enter vehicle or service name"
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: 'var(--text-secondary)' }}>Category</label>
                  <select 
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: 'var(--bg-secondary)', color: 'white' }}
                  >
                    <option value="Economy">Economy</option>
                    <option value="SUV">SUV</option>
                    <option value="Luxury">Luxury</option>
                    <option value="Van">Van</option>
                    <option value="Bus">Bus</option>
                    <option value="Taxi">Taxi</option>
                  </select>
                </div>
                
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: 'var(--text-secondary)' }}>Service Type</label>
                  <select 
                    name="transportType"
                    value={formData.transportType}
                    onChange={handleInputChange}
                    style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: 'var(--bg-secondary)', color: 'white' }}
                  >
                    <option value="ride">Ride Now (General)</option>
                    <option value="rental">Car Rental</option>
                    <option value="airport">Airport Transfer</option>
                    <option value="intercity">Intercity Bus</option>
                    <option value="taxi">Taxi</option>
                    <option value="shuttle">Shuttle Service</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: 'var(--text-secondary)' }}>Transmission</label>
                <select 
                  name="transmission"
                  value={formData.transmission}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: 'var(--bg-secondary)', color: 'white' }}
                >
                  <option value="Automatic">Automatic</option>
                  <option value="Manual">Manual</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: 'var(--text-secondary)' }}>Seats</label>
                  <input 
                    type="number" 
                    name="seats"
                    value={formData.seats}
                    onChange={handleInputChange}
                    required 
                    min="1"
                    style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: 'var(--bg-secondary)', color: 'white' }}
                  />
                </div>
                
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: 'var(--text-secondary)' }}>Price Per Day (ETB)</label>
                  <input 
                    type="number" 
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required 
                    min="0"
                    style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: 'var(--bg-secondary)', color: 'white' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: 'var(--text-secondary)' }}>Description / Features</label>
                <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: 'var(--bg-secondary)', color: 'white', resize: 'vertical' }}
                  placeholder="e.g. Air conditioning, unlimited mileage..."
                ></textarea>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: 'var(--text-secondary)' }}>Status</label>
                <select 
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: 'var(--bg-secondary)', color: 'white' }}
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={closeModal} className="btn-secondary" style={{ padding: '12px 24px' }}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ padding: '12px 24px' }}>
                  {editingService ? 'Save Changes' : 'Add Vehicle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardTransportationServices;
