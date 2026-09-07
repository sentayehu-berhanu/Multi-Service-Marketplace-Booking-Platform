import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const DashboardSpaServices = () => {
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
    serviceType: 'Full Body Massage',
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
        
        setBusinessId(business.id);
        // Filter out archived services
        setServices(business.services.filter(s => s.status !== 'ARCHIVED'));
      } else {
        setError("No business found. Please create a business first.");
      }
    } catch (err) {
      console.error('Error fetching services:', err);
      setError("Failed to load spa services.");
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
    setFormData({ name: '', serviceType: 'Full Body Massage', description: '', price: '', duration: '60', status: 'ACTIVE' });
    setIsModalOpen(true);
  };

  const openEditModal = (service) => {
    setEditingService(service);
    
    // Parse serviceType from description if exists
    let type = 'Full Body Massage';
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
      console.error('Error saving spa service:', err);
      alert('Failed to save service.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this spa service?")) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/businesses/${businessId}/services/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchBusinessAndServices();
      } catch (err) {
        console.error('Error deleting spa service:', err);
        alert('Failed to delete service.');
      }
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '3rem' }}>Loading spa services...</div>;
  if (error) return <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--danger)' }}>{error}</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', fontFamily: "'Outfit', 'Inter', sans-serif" }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        background: 'linear-gradient(135deg, #064e3b 0%, #0f172a 100%)', 
        padding: '2.5rem', 
        borderRadius: '20px', 
        color: 'white',
        boxShadow: '0 15px 30px -10px rgba(6, 78, 59, 0.4)'
      }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', margin: '0 0 10px 0', fontFamily: 'serif', fontWeight: 300 }}>Spa Services Menu</h1>
          <p style={{ margin: 0, color: '#a7f3d0', fontSize: '1.1rem' }}>Manage your wellness and relaxation offerings.</p>
        </div>
        <button 
          onClick={openAddModal}
          style={{ 
            background: '#a7f3d0', 
            color: '#064e3b', 
            padding: '15px 30px', 
            border: 'none', 
            borderRadius: '12px', 
            fontWeight: 600, 
            cursor: 'pointer', 
            fontSize: '1.1rem',
            transition: 'all 0.3s ease',
            boxShadow: '0 10px 20px -5px rgba(167, 243, 208, 0.3)'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          + Add Spa Service
        </button>
      </div>

      <div style={{ background: 'white', padding: '2.5rem', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
        {services.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b', fontSize: '1.2rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>💆‍♀️</div>
            No spa services found. Add your first treatment to get started!
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '1.5rem' }}>
            {services.map(service => (
              <div key={service.id} style={{ 
                padding: '2rem', 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'space-between',
                borderRadius: '16px', 
                border: '1px solid #e2e8f0',
                background: '#f8fafc',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.boxShadow = '0 15px 30px -10px rgba(0,0,0,0.1)';
                e.currentTarget.style.transform = 'translateY(-3px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'translateY(0)';
              }}>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: service.status === 'ACTIVE' ? '#10b981' : '#ef4444' }}></div>
                
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <h3 style={{ fontSize: '1.4rem', margin: 0, color: '#0f172a', fontWeight: 600 }}>{service.name}</h3>
                    <span style={{ 
                      fontSize: '0.75rem', 
                      padding: '4px 10px', 
                      borderRadius: '20px', 
                      background: service.status === 'ACTIVE' ? '#dcfce7' : '#fee2e2',
                      color: service.status === 'ACTIVE' ? '#16a34a' : '#ef4444',
                      fontWeight: 600,
                      letterSpacing: '0.5px'
                    }}>
                      {service.status}
                    </span>
                  </div>
                  <p style={{ color: '#64748b', margin: 0, fontSize: '1rem', lineHeight: 1.5 }}>
                    {service.description ? service.description.replace(/^\[.*?\] /, '') : 'No description provided.'}
                  </p>
                  <div style={{ display: 'flex', gap: '12px', marginTop: '15px' }}>
                    <span style={{ background: '#e2e8f0', color: '#475569', padding: '4px 10px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 500 }}>
                      ⏱️ {service.duration} mins
                    </span>
                    {service.description?.match(/^\[(.*?)\]/) && (
                      <span style={{ background: '#dbeafe', color: '#1e40af', padding: '4px 10px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 500 }}>
                        ✨ {service.description.match(/^\[(.*?)\]/)[1]}
                      </span>
                    )}
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1.5rem', borderTop: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#064e3b' }}>
                    {service.price} <span style={{ fontSize: '1rem', color: '#64748b', fontWeight: 500 }}>ETB</span>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                      style={{ padding: '8px 16px', fontSize: '0.9rem', background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer', fontWeight: 500 }} 
                      onClick={() => openEditModal(service)}
                    >
                      Edit
                    </button>
                    <button 
                      style={{ padding: '8px 16px', fontSize: '0.9rem', background: '#fef2f2', color: '#ef4444', border: '1px solid #fca5a5', borderRadius: '8px', cursor: 'pointer', fontWeight: 500 }} 
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
          background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(8px)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 
        }}>
          <div style={{ background: 'white', width: '100%', maxWidth: '550px', padding: '3rem', borderRadius: '24px', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
            <h2 style={{ marginBottom: '2rem', marginTop: 0, color: '#0f172a', fontSize: '1.8rem', fontWeight: 600 }}>{editingService ? 'Edit Treatment' : 'Add New Spa Service'}</h2>
            
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#475569', fontWeight: 600, fontSize: '0.95rem' }}>Service Name (e.g. Deep Tissue Massage)</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #cbd5e1', outline: 'none', boxSizing: 'border-box', fontSize: '1rem', transition: 'border-color 0.2s' }} onFocus={(e) => e.target.style.borderColor = '#10b981'} onBlur={(e) => e.target.style.borderColor = '#cbd5e1'} />
              </div>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#475569', fontWeight: 600, fontSize: '0.95rem' }}>Category Type</label>
                <select name="serviceType" value={formData.serviceType} onChange={handleInputChange} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #cbd5e1', outline: 'none', boxSizing: 'border-box', fontSize: '1rem', appearance: 'none', background: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23475569%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E") no-repeat right 15px center', backgroundSize: '12px' }}>
                  <option value="Full Body Massage">Full Body Massage</option>
                  <option value="Aromatherapy">Aromatherapy</option>
                  <option value="Hot Stone Massage">Hot Stone Massage</option>
                  <option value="Facial">Facial</option>
                  <option value="Sauna">Sauna</option>
                  <option value="Manicure/Pedicure">Manicure/Pedicure</option>
                </select>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#475569', fontWeight: 600, fontSize: '0.95rem' }}>Description</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Describe the benefits and experience..." rows="3" style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #cbd5e1', outline: 'none', boxSizing: 'border-box', fontSize: '1rem', resize: 'vertical' }}></textarea>
              </div>

              <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '20px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#475569', fontWeight: 600, fontSize: '0.95rem' }}>Price (ETB)</label>
                  <input type="number" name="price" value={formData.price} onChange={handleInputChange} required min="0" step="0.01" style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #cbd5e1', outline: 'none', boxSizing: 'border-box', fontSize: '1rem' }} />
                </div>
                
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#475569', fontWeight: 600, fontSize: '0.95rem' }}>Duration (Mins)</label>
                  <input type="number" name="duration" value={formData.duration} onChange={handleInputChange} required min="1" style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #cbd5e1', outline: 'none', boxSizing: 'border-box', fontSize: '1rem' }} />
                </div>
              </div>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#475569', fontWeight: 600, fontSize: '0.95rem' }}>Service Image (Optional)</label>
                <div style={{ border: '2px dashed #cbd5e1', borderRadius: '12px', padding: '20px', textAlign: 'center', background: '#f8fafc' }}>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => setImageFile(e.target.files[0])} 
                    style={{ width: '100%', boxSizing: 'border-box' }} 
                  />
                  {editingService && editingService.image && !imageFile && (
                    <div style={{ marginTop: '15px', fontSize: '0.9rem', color: '#64748b' }}>
                      Current image: <img src={editingService.image} alt="Service" style={{ height: '50px', borderRadius: '8px', verticalAlign: 'middle', marginLeft: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }} />
                    </div>
                  )}
                </div>
              </div>

              {editingService && (
                <div style={{ marginBottom: '25px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#475569', fontWeight: 600, fontSize: '0.95rem' }}>Status</label>
                  <select name="status" value={formData.status} onChange={handleInputChange} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #cbd5e1', outline: 'none', boxSizing: 'border-box', fontSize: '1rem' }}>
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>
              )}

              <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem' }}>
                <button type="button" onClick={closeModal} style={{ flex: 1, padding: '16px', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '12px', fontWeight: 600, cursor: 'pointer', fontSize: '1.05rem', transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = '#e2e8f0'} onMouseOut={(e) => e.currentTarget.style.background = '#f1f5f9'}>Cancel</button>
                <button type="submit" style={{ flex: 1, padding: '16px', background: '#064e3b', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 600, cursor: 'pointer', fontSize: '1.05rem', transition: 'background 0.2s', boxShadow: '0 10px 20px -5px rgba(6, 78, 59, 0.4)' }} onMouseOver={(e) => e.currentTarget.style.background = '#047857'} onMouseOut={(e) => e.currentTarget.style.background = '#064e3b'}>{editingService ? 'Save Changes' : 'Add Service'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardSpaServices;
