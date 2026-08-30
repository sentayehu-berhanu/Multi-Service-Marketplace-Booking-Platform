import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DashboardServices = () => {
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
      // Fetch the business first
      const bizRes = await axios.get('http://localhost:5000/api/businesses/my', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (bizRes.data && bizRes.data.length > 0) {
        const business = bizRes.data[0];
        setBusinessId(business.id);
        // Filter out archived services
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
      
      // If a file was selected, append it. Otherwise append the image URL if any.
      if (formData.imageFile) {
        submitData.append('imageFile', formData.imageFile);
      } else if (formData.image) {
        submitData.append('image', formData.image);
      }

      if (editingService) {
        // Update existing service
        await axios.put(`http://localhost:5000/api/businesses/${businessId}/services/${editingService.id}`, submitData, {
          headers: { 
            Authorization: `Bearer ${token}`
          }
        });
      } else {
        // Add new service
        await axios.post(`http://localhost:5000/api/businesses/${businessId}/services`, submitData, {
          headers: { 
            Authorization: `Bearer ${token}`
          }
        });
      }
      closeModal();
      fetchBusinessAndServices(); // Refresh list
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
        fetchBusinessAndServices(); // Refresh list
      } catch (err) {
        console.error('Error deleting service:', err);
        alert('Failed to delete service.');
      }
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '3rem' }}>Loading services...</div>;
  if (error) return <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--danger)' }}>{error}</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '2rem', margin: 0 }}>Services Management</h1>
        <button className="btn-primary hover-scale" onClick={openAddModal}>+ Add Service</button>
      </div>

      <div className="glass-panel" style={{ padding: '2rem' }}>
        {services.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
            No services found. Add your first service to get started!
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {services.map(service => (
              <div key={service.id} className="category-card" style={{ alignItems: 'flex-start', textAlign: 'left', padding: 0, cursor: 'default', overflow: 'hidden' }}>
                {service.image && (
                  <div style={{ width: '100%', height: '140px', backgroundImage: `url(${service.image})`, backgroundSize: 'cover', backgroundPosition: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}></div>
                )}
                <div style={{ padding: '1.5rem', width: '100%', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '10px' }}>
                    <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)' }}>{service.name}</h3>
                    <span style={{ 
                      fontSize: '0.8rem', 
                      padding: '3px 8px', 
                      borderRadius: '12px', 
                      background: service.status === 'ACTIVE' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                      color: service.status === 'ACTIVE' ? 'var(--success)' : 'var(--danger)',
                      height: 'fit-content'
                    }}>
                      {service.status}
                    </span>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '15px', flex: 1 }}>
                    {service.description || 'No description provided.'}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', marginBottom: '15px' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: 'var(--accent-primary)' }}>{service.price} ETB</div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>⏱️ {service.duration} mins</div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
                    <button className="btn-secondary" style={{ flex: 1, padding: '8px' }} onClick={() => openEditModal(service)}>Edit</button>
                    <button className="btn-secondary" style={{ flex: 1, padding: '8px', color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.3)' }} onClick={() => handleDelete(service.id)}>Delete</button>
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
          background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 
        }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', padding: '2rem', position: 'relative' }}>
            <h2 style={{ marginBottom: '1.5rem', marginTop: 0 }}>{editingService ? 'Edit Service' : 'Add New Service'}</h2>
            
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label>Service Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
              </div>
              
              <div className="form-group">
                <label>Description (Optional)</label>
                <input type="text" name="description" value={formData.description} onChange={handleInputChange} />
              </div>

              <div className="form-group" style={{ marginBottom: '10px' }}>
                <label>Service Image</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <input type="file" accept="image/*" onChange={handleFileChange} style={{ background: 'transparent', border: '1px dashed var(--glass-border)', padding: '10px' }} />
                  <div style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>OR</div>
                  <input type="url" name="image" value={formData.image} onChange={handleInputChange} placeholder="Paste Image URL instead..." disabled={!!formData.imageFile} style={{ opacity: formData.imageFile ? 0.5 : 1 }} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Price (ETB)</label>
                  <input type="number" name="price" value={formData.price} onChange={handleInputChange} required min="0" step="0.01" />
                </div>
                
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Duration (Minutes)</label>
                  <input type="number" name="duration" value={formData.duration} onChange={handleInputChange} required min="1" />
                </div>
              </div>

              {editingService && (
                <div className="form-group">
                  <label>Status</label>
                  <select name="status" value={formData.status} onChange={handleInputChange}>
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>
              )}

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" className="btn-secondary hover-scale" style={{ flex: 1 }} onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn-primary hover-scale" style={{ flex: 1 }}>{editingService ? 'Save Changes' : 'Add Service'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardServices;
