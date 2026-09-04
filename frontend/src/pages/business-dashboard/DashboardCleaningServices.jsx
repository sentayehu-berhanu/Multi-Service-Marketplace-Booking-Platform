import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const DashboardCleaningServices = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [businessId, setBusinessId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    serviceType: 'House Cleaning',
    description: '',
    price: '',
    duration: '60',
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
        
        // Ensure this page is only used by Cleaning businesses
        if (business.category?.slug !== 'cleaning') {
          // If they somehow got here, let them stay, but typically we redirect out
        }

        setBusinessId(business.id);
        // Filter out archived services
        setServices(business.services.filter(s => s.status !== 'ARCHIVED'));
      } else {
        setError("No business found. Please create a business first.");
      }
    } catch (err) {
      console.error('Error fetching services:', err);
      setError("Failed to load cleaning services.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openAddModal = () => {
    setEditingService(null);
    setImageFile(null);
    setFormData({ name: '', serviceType: 'House Cleaning', description: '', price: '', duration: '60', status: 'ACTIVE' });
    setIsModalOpen(true);
  };

  const openEditModal = (service) => {
    setEditingService(service);
    
    // Parse serviceType from description if exists
    let type = 'House Cleaning';
    let desc = service.description || '';
    const match = desc.match(/^\[(.*?)\] (.*)$/);
    if (match) {
      type = match[1];
      desc = match[2];
    }

    setFormData({
      name: service.name,
      serviceType: type,
      description: desc,
      price: service.price,
      duration: service.duration,
      status: service.status
    });
    setImageFile(null);
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
      
      const formattedDescription = `[${formData.serviceType}] ${formData.description}`;
      submitData.append('description', formattedDescription);
      
      submitData.append('price', formData.price);
      submitData.append('duration', formData.duration);
      if (formData.status) submitData.append('status', formData.status);
      if (imageFile) submitData.append('imageFile', imageFile);

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
      console.error('Error saving cleaning service:', err);
      alert('Failed to save service.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this cleaning service?")) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/businesses/${businessId}/services/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchBusinessAndServices();
      } catch (err) {
        console.error('Error deleting cleaning service:', err);
        alert('Failed to delete service.');
      }
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '3rem' }}>Loading cleaning services...</div>;
  if (error) return <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--danger)' }}>{error}</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0f172a', padding: '2rem', borderRadius: '15px', color: 'white' }}>
        <div>
          <h1 style={{ fontSize: '2rem', margin: '0 0 10px 0' }}>Cleaning Service Builder</h1>
          <p style={{ margin: 0, color: '#94a3b8' }}>Manage your house, office, and deep cleaning services.</p>
        </div>
        <button 
          onClick={openAddModal}
          style={{ background: '#3b82f6', color: 'white', padding: '12px 24px', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}
        >
          + Add Cleaning Service
        </button>
      </div>

      <div className="glass-panel" style={{ padding: '2rem' }}>
        {services.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
            No cleaning services found. Add your first service to get started!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '800px' }}>
            {services.map(service => (
              <div key={service.id} className="glass-panel hover-scale" style={{ padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: '15px', borderLeft: '4px solid #3b82f6' }}>
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
                    {service.description ? service.description.replace(/^\[.*?\] /, '') : 'No description provided.'}
                  </p>
                  <div style={{ color: '#475569', fontSize: '0.85rem', marginTop: '10px', display: 'flex', gap: '10px' }}>
                    <span>⏱️ {service.duration} mins</span>
                    {service.description?.match(/^\[(.*?)\]/) && (
                      <span style={{ background: '#f1f5f9', padding: '2px 8px', borderRadius: '4px' }}>
                        🧹 {service.description.match(/^\[(.*?)\]/)[1]}
                      </span>
                    )}
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#3b82f6' }}>
                    {service.price} ETB
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.9rem' }} onClick={() => openEditModal(service)}>Edit</button>
                    <button className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.9rem', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }} onClick={() => handleDelete(service.id)}>Delete</button>
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
          background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(5px)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 
        }}>
          <div style={{ background: 'white', width: '100%', maxWidth: '500px', padding: '2.5rem', borderRadius: '15px', position: 'relative' }}>
            <h2 style={{ marginBottom: '1.5rem', marginTop: 0, color: '#0f172a' }}>{editingService ? 'Edit Service' : 'Add Cleaning Service'}</h2>
            
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#475569', fontWeight: 'bold', fontSize: '0.9rem' }}>Service Name (e.g. Standard 2-Bed House)</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#475569', fontWeight: 'bold', fontSize: '0.9rem' }}>Service Type</label>
                <select name="serviceType" value={formData.serviceType} onChange={handleInputChange} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', boxSizing: 'border-box' }}>
                  <option value="House Cleaning">House Cleaning</option>
                  <option value="Office Cleaning">Office Cleaning</option>
                  <option value="Deep Cleaning">Deep Cleaning</option>
                  <option value="Carpet Cleaning">Carpet Cleaning</option>
                  <option value="Window Cleaning">Window Cleaning</option>
                </select>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#475569', fontWeight: 'bold', fontSize: '0.9rem' }}>Description</label>
                <input type="text" name="description" value={formData.description} onChange={handleInputChange} placeholder="What's included in this service?" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', boxSizing: 'border-box' }} />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginBottom: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#475569', fontWeight: 'bold', fontSize: '0.9rem' }}>Price (ETB)</label>
                  <input type="number" name="price" value={formData.price} onChange={handleInputChange} required min="0" step="0.01" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#475569', fontWeight: 'bold', fontSize: '0.9rem' }}>Duration (Mins)</label>
                  <input type="number" name="duration" value={formData.duration} onChange={handleInputChange} required min="1" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', boxSizing: 'border-box' }} />
                </div>
              </div>
              
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#475569', fontWeight: 'bold', fontSize: '0.9rem' }}>Service Image</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => setImageFile(e.target.files[0])} 
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', boxSizing: 'border-box' }} 
                />
                {editingService && editingService.image && !imageFile && (
                  <div style={{ marginTop: '10px', fontSize: '0.85rem', color: '#64748b' }}>
                    Current image: <img src={editingService.image} alt="Service" style={{ height: '40px', borderRadius: '4px', verticalAlign: 'middle', marginLeft: '10px' }} />
                  </div>
                )}
              </div>

              {editingService && (
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#475569', fontWeight: 'bold', fontSize: '0.9rem' }}>Status</label>
                  <select name="status" value={formData.status} onChange={handleInputChange} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', boxSizing: 'border-box' }}>
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>
              )}

              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button type="button" onClick={closeModal} style={{ flex: 1, padding: '12px', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ flex: 1, padding: '12px', background: '#0f172a', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>{editingService ? 'Save Changes' : 'Add Service'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardCleaningServices;
