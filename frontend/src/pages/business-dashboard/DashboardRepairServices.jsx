import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiTool, FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { MdOutlineElectricBolt, MdOutlinePlumbing, MdOutlineCarpenter, MdFormatPaint, MdAcUnit, MdHomeRepairService } from 'react-icons/md';

const serviceIcons = {
  'Electrician': <MdOutlineElectricBolt size={24} />,
  'Plumber': <MdOutlinePlumbing size={24} />,
  'Carpenter': <MdOutlineCarpenter size={24} />,
  'Painter': <MdFormatPaint size={24} />,
  'AC Technician': <MdAcUnit size={24} />,
  'Appliance Repair': <MdHomeRepairService size={24} />,
};

const DashboardRepairServices = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [businessId, setBusinessId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    name: 'Electrician',
    description: '',
    price: '',
    duration: '',
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

  const openAddModal = () => {
    setEditingService(null);
    setFormData({ name: 'Electrician', description: '', price: '', duration: '', status: 'ACTIVE' });
    setIsModalOpen(true);
  };

  const openEditModal = (service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description || '',
      price: service.price,
      duration: service.duration,
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
      
      const submitData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        duration: parseInt(formData.duration),
        status: formData.status
      };
      
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

  if (loading) return <div style={{ textAlign: 'center', padding: '3rem' }}>Loading services...</div>;
  if (error) return <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--danger)' }}>{error}</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '12px',
            background: 'var(--accent-gradient)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: 'var(--accent-glow)'
          }}>
            <FiTool size={24} color="white" />
          </div>
          <div>
            <h1 className="gradient-text" style={{ fontSize: '2rem', margin: 0 }}>Repair Services</h1>
            <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Manage the services you offer</p>
          </div>
        </div>
        <button className="btn-primary hover-scale" onClick={openAddModal} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FiPlus /> Add Service
        </button>
      </div>

      <div style={{ display: 'grid', gap: '24px', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))' }}>
        {services.map(service => (
          <div key={service.id} className="glass-panel hover-scale" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ 
                  width: '40px', height: '40px', borderRadius: '50%', 
                  background: 'rgba(255,255,255,0.05)', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--accent-secondary)'
                }}>
                  {serviceIcons[service.name] || <FiTool />}
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.3rem' }}>{service.name}</h3>
                  <span style={{ 
                    fontSize: '0.75rem', 
                    padding: '2px 8px', 
                    borderRadius: '12px', 
                    background: service.status === 'ACTIVE' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                    color: service.status === 'ACTIVE' ? 'var(--success)' : 'var(--danger)',
                    fontWeight: 'bold',
                    display: 'inline-block',
                    marginTop: '4px'
                  }}>
                    {service.status}
                  </span>
                </div>
              </div>
              <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                {service.price} ETB
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <p style={{ color: 'var(--text-secondary)', margin: '0 0 8px 0', fontSize: '0.95rem' }}>
                {service.description || 'No description provided.'}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-primary)', fontSize: '0.9rem', fontWeight: 500 }}>
                ⏱ {service.duration} mins estimated
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <button className="btn-secondary" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} onClick={() => openEditModal(service)}>
                <FiEdit2 size={16} /> Edit
              </button>
              <button className="btn-secondary" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.3)' }} onClick={() => handleDelete(service.id)}>
                <FiTrash2 size={16} /> Delete
              </button>
            </div>
          </div>
        ))}
        {services.length === 0 && (
          <div style={{ 
            gridColumn: '1 / -1', 
            textAlign: 'center', 
            padding: '60px 20px', 
            background: 'rgba(255,255,255,0.02)', 
            borderRadius: '16px',
            border: '1px dashed rgba(255,255,255,0.1)'
          }}>
            <FiTool size={48} style={{ color: 'var(--text-secondary)', marginBottom: '16px', opacity: 0.5 }} />
            <h3 style={{ color: 'var(--text-secondary)' }}>No services offered yet</h3>
            <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>Click "Add Service" to start offering repairs.</p>
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
            <h2 style={{ marginBottom: '1.5rem', marginTop: 0 }}>{editingService ? 'Edit Repair Service' : 'Add Repair Service'}</h2>
            
            <form onSubmit={handleSubmit} className="auth-form" style={{ gap: '1.2rem' }}>
              <div className="form-group">
                <label>Service Type</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginTop: '8px' }}>
                  {Object.keys(serviceIcons).map(type => (
                    <div 
                      key={type}
                      onClick={() => setFormData({ ...formData, name: type })}
                      style={{
                        padding: '12px 8px',
                        background: formData.name === type ? 'rgba(107, 70, 193, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                        border: formData.name === type ? '1px solid var(--accent-primary)' : '1px solid rgba(255, 255, 255, 0.05)',
                        borderRadius: '12px',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                        cursor: 'pointer',
                        color: formData.name === type ? 'white' : 'var(--text-secondary)',
                        transition: 'all 0.2s ease',
                        textAlign: 'center',
                        fontSize: '0.8rem'
                      }}
                    >
                      <div style={{ color: formData.name === type ? 'var(--accent-secondary)' : 'inherit' }}>
                        {serviceIcons[type]}
                      </div>
                      {type}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="form-group">
                <label>Description (Optional)</label>
                <textarea 
                  name="description" 
                  className="input-field" 
                  rows={2} 
                  value={formData.description} 
                  onChange={handleInputChange} 
                  placeholder="E.g., Diagnostics, wiring repairs, etc."
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Base Price (ETB)</label>
                  <input type="number" className="input-field" name="price" value={formData.price} onChange={handleInputChange} required min="0" />
                </div>
                
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Est. Time (Mins)</label>
                  <input type="number" className="input-field" name="duration" value={formData.duration} onChange={handleInputChange} required min="1" />
                </div>
              </div>

              {editingService && (
                <div className="form-group">
                  <label>Status</label>
                  <select name="status" className="input-field" value={formData.status} onChange={handleInputChange}>
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

export default DashboardRepairServices;
