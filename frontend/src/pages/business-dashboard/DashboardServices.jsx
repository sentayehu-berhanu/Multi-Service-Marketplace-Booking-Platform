import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const DashboardServices = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [businessId, setBusinessId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');

  const [editingService, setEditingService] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
    status: 'ACTIVE'
  });
  const [imageFile, setImageFile] = useState(null);

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
        
        // Auto-redirect if they land on generic services but have a specialized dashboard
        if (business.category?.slug === 'parking') {
          return navigate('/business-dashboard/parking-spaces');
        } else if (business.category?.slug === 'womens-salon' || business.category?.slug === 'salon') {
          return navigate('/business-dashboard/salon-services');
        } else if (business.category?.slug === 'cosmetics') {
          return navigate('/business-dashboard/products');
        } else if (business.category?.slug === 'pharmacy') {
          return navigate('/business-dashboard/pharmacy-products');
        } else if (business.category?.slug === 'cafe' || business.category?.slug === 'restaurant') {
          return navigate('/business-dashboard/cafe-menu');
        } else if (business.category?.slug === 'hotel') {
          return navigate('/business-dashboard/hotel-rooms');
        }

        setBusinessId(business.id);
        // Filter out archived services
        setServices(business.services.filter(s => s.status !== 'ARCHIVED'));
      } else {
        setError("No business found. Please create a business first.");
      }
    } catch (err) {
      console.error('Error fetching services:', err);
      setError("Failed to load services. Make sure your server is running!");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description || '',
      price: service.price,
      duration: service.duration,
      status: service.status
    });
    setImageFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingService(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      duration: '',
      status: 'ACTIVE'
    });
    setImageFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('description', formData.description);
      submitData.append('price', formData.price);
      submitData.append('duration', formData.duration);
      if (formData.status) submitData.append('status', formData.status);
      
      if (imageFile) {
        submitData.append('imageFile', imageFile);
      }

      if (editingService) {
        // Update existing service
        await axios.put(`http://localhost:5000/api/businesses/${businessId}/services/${editingService.id}`, submitData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSuccess('Service updated successfully!');
      } else {
        // Add new service
        await axios.post(`http://localhost:5000/api/businesses/${businessId}/services`, submitData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSuccess('Service added successfully!');
      }
      resetForm();
      fetchBusinessAndServices(); // Refresh list
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error saving service:', err);
      setError('Failed to save service.');
    } finally {
      setSubmitting(false);
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

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', margin: 0 }}>Manage Services</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        {/* Add/Edit Service Form */}
        <div className="glass-panel" style={{ padding: '2rem', alignSelf: 'start' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {editingService ? 'Edit Service' : 'Add New Service'}
            {editingService && (
              <button 
                onClick={resetForm}
                style={{ fontSize: '0.8rem', padding: '4px 8px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'var(--text-secondary)', borderRadius: '5px', cursor: 'pointer' }}
              >
                Cancel Edit
              </button>
            )}
          </h2>
          
          {error && <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '10px', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}
          {success && <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', padding: '10px', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem' }}>{success}</div>}
          
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Service Name</label>
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="input-field"
                style={{ width: '100%' }}
                placeholder="e.g. Full Body Massage"
              />
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Description</label>
              <textarea 
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="input-field"
                style={{ width: '100%', minHeight: '80px', resize: 'vertical' }}
                placeholder="Describe the service..."
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Price (ETB)</label>
                <input 
                  type="number" 
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  className="input-field"
                  style={{ width: '100%' }}
                  placeholder="e.g. 1500"
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Duration (mins)</label>
                <input 
                  type="number" 
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  required
                  min="1"
                  className="input-field"
                  style={{ width: '100%' }}
                  placeholder="e.g. 60"
                />
              </div>
            </div>

            {editingService && (
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Status</label>
                <select 
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="input-field"
                  style={{ width: '100%' }}
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                </select>
              </div>
            )}

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Service Image</label>
              <input 
                type="file" 
                accept="image/*"
                onChange={handleImageChange}
                className="input-field"
                style={{ width: '100%', padding: '8px' }}
              />
            </div>
            
            <button 
              type="submit" 
              className="primary-btn" 
              style={{ width: '100%' }}
              disabled={submitting || !businessId}
            >
              {submitting ? 'Saving...' : (editingService ? 'Save Changes' : '+ Add Service')}
            </button>
          </form>
        </div>

        {/* Services List */}
        <div>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>Your Services</h2>
          {services.length === 0 ? (
            <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
              No services found. Add your first service using the form.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
              {services.map(service => (
                <div key={service.id} className="glass-panel hover-scale" style={{ padding: '1rem', display: 'flex', flexDirection: 'column' }}>
                  <img 
                    src={service.image?.startsWith('/uploads') ? `http://localhost:5000${service.image}` : (service.image || 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=400')} 
                    alt={service.name} 
                    style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '10px', marginBottom: '1rem' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <span style={{ 
                      fontSize: '0.7rem', 
                      padding: '3px 8px', 
                      background: service.status === 'ACTIVE' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', 
                      color: service.status === 'ACTIVE' ? 'var(--success)' : 'var(--danger)', 
                      borderRadius: '12px', 
                      fontWeight: 600 
                    }}>
                      {service.status}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      ⏱ {service.duration} mins
                    </span>
                  </div>
                  <h3 style={{ margin: '0 0 10px 0', fontSize: '1.1rem' }}>{service.name}</h3>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '10px', flex: 1 }}>
                    {service.description || 'No description provided.'}
                  </div>
                  <div style={{ fontWeight: 'bold', color: 'var(--accent-primary)', marginBottom: '1rem' }}>
                    {service.price} ETB
                  </div>
                  
                  <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                    <button 
                      onClick={() => handleEdit(service)}
                      style={{ flex: 1, padding: '8px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-primary)', borderRadius: '8px', cursor: 'pointer' }}
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(service.id)}
                      style={{ flex: 1, padding: '8px', background: 'transparent', border: '1px solid rgba(239, 68, 68, 0.3)', color: 'var(--danger)', borderRadius: '8px', cursor: 'pointer' }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardServices;
