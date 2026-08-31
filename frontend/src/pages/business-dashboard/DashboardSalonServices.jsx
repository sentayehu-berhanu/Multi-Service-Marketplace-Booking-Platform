import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DashboardSalonServices = () => {
  const [services, setServices] = useState([]);
  const [businessId, setBusinessId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
    image: '',
    imageFile: null,
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
      setError("Failed to load services.");
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
    setEditingService(null);
    setFormData({ name: '', description: '', price: '', duration: '', image: '', imageFile: null, status: 'ACTIVE' });
    setIsModalOpen(true);
  };

  const openEditModal = (service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description || '',
      price: service.price,
      duration: service.duration,
      image: service.image || '',
      imageFile: null,
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
      submitData.append('description', formData.description);
      submitData.append('price', formData.price);
      submitData.append('duration', formData.duration);
      if (formData.status) submitData.append('status', formData.status);
      
      if (formData.imageFile) {
        submitData.append('imageFile', formData.imageFile);
      } else if (formData.image) {
        submitData.append('image', formData.image);
      }

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
      console.error('Error saving service:', err);
      alert('Failed to save service.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/businesses/${businessId}/services/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchBusinessAndServices();
      } catch (err) {
        console.error('Error deleting service:', err);
        alert('Failed to delete service.');
      }
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '3rem', color: '#db2777' }}>Loading services...</div>;
  if (error) return <div style={{ textAlign: 'center', padding: '3rem', color: '#ef4444' }}>{error}</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', fontFamily: "'Playfair Display', serif" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1 style={{ fontSize: '2.5rem', margin: 0, color: '#1f2937' }}>Salon Services</h1>
        <button 
          onClick={openAddModal}
          style={{ 
            background: '#db2777', color: 'white', border: 'none', padding: '12px 24px', 
            borderRadius: '25px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer',
            boxShadow: '0 4px 14px 0 rgba(219, 39, 119, 0.39)', transition: 'transform 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          + Add New Service
        </button>
      </div>

      <div style={{ padding: '1rem 0' }}>
        {services.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#6b7280', background: 'white', borderRadius: '20px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>💅</span>
            <p style={{ fontSize: '1.2rem' }}>No services found. Add your first beauty service to get started!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', maxWidth: '800px' }}>
            {services.map(service => (
              <div key={service.id} style={{ 
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                padding: '1.5rem 2rem', background: 'white', borderRadius: '15px', 
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                transition: 'transform 0.2s', cursor: 'default'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '5px' }}>
                    <h3 style={{ margin: 0, fontSize: '1.4rem', color: '#374151' }}>{service.name}</h3>
                    <span style={{ 
                      fontSize: '0.75rem', 
                      padding: '3px 10px', 
                      borderRadius: '12px', 
                      background: service.status === 'ACTIVE' ? '#d1fae5' : '#fee2e2',
                      color: service.status === 'ACTIVE' ? '#059669' : '#dc2626',
                      fontWeight: 'bold', fontFamily: 'sans-serif'
                    }}>
                      {service.status}
                    </span>
                  </div>
                  <p style={{ color: '#6b7280', margin: 0, fontSize: '0.9rem', fontFamily: 'sans-serif' }}>
                    ⏱ {service.duration} mins • {service.description || 'Premium salon service.'}
                  </p>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#db2777' }}>
                    {service.price} ETB
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                      style={{ background: '#fce7f3', color: '#db2777', border: 'none', padding: '8px 16px', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer' }} 
                      onClick={() => openEditModal(service)}
                    >
                      Edit
                    </button>
                    <button 
                      style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '8px 16px', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer' }} 
                      onClick={() => handleDelete(service.id)}
                    >
                      Delete
                    </button>
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
          background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(3px)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 
        }}>
          <div style={{ background: 'white', width: '100%', maxWidth: '500px', padding: '2.5rem', borderRadius: '20px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', fontFamily: 'sans-serif' }}>
            <h2 style={{ marginBottom: '1.5rem', marginTop: 0, color: '#1f2937', fontFamily: "'Playfair Display', serif" }}>
              {editingService ? 'Edit Salon Service' : 'Add New Salon Service'}
            </h2>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ color: '#4b5563', fontWeight: 'bold', fontSize: '0.9rem' }}>Service Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required style={{ padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db' }} />
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ color: '#4b5563', fontWeight: 'bold', fontSize: '0.9rem' }}>Description (Optional)</label>
                <input type="text" name="description" value={formData.description} onChange={handleInputChange} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db' }} />
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flex: 1 }}>
                  <label style={{ color: '#4b5563', fontWeight: 'bold', fontSize: '0.9rem' }}>Price (ETB)</label>
                  <input type="number" name="price" value={formData.price} onChange={handleInputChange} required min="0" step="0.01" style={{ padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db' }} />
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flex: 1 }}>
                  <label style={{ color: '#4b5563', fontWeight: 'bold', fontSize: '0.9rem' }}>Duration (Minutes)</label>
                  <input type="number" name="duration" value={formData.duration} onChange={handleInputChange} required min="1" style={{ padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db' }} />
                </div>
              </div>

              {editingService && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label style={{ color: '#4b5563', fontWeight: 'bold', fontSize: '0.9rem' }}>Status</label>
                  <select name="status" value={formData.status} onChange={handleInputChange} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db' }}>
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>
              )}

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={closeModal} style={{ flex: 1, padding: '12px', background: '#f3f4f6', color: '#4b5563', border: 'none', borderRadius: '25px', fontWeight: 'bold', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ flex: 1, padding: '12px', background: '#db2777', color: 'white', border: 'none', borderRadius: '25px', fontWeight: 'bold', cursor: 'pointer' }}>
                  {editingService ? 'Save Changes' : 'Add Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardSalonServices;
