import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiPlus, FiTrash2, FiEdit2 } from 'react-icons/fi';

const DashboardGymServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [businessId, setBusinessId] = useState(null);
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    duration: '',
    price: '',
    category: 'Membership'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const bizRes = await axios.get('http://localhost:5000/api/businesses/my', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const biz = bizRes.data[0];
      if (biz) {
        setBusinessId(biz.id);
        const servRes = await axios.get(`http://localhost:5000/api/businesses/${biz.id}/services`);
        setServices(servRes.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEdit = (service) => {
    let cat = 'Membership';
    let dur = service.description || '';
    if (dur.includes('|')) {
      const parts = dur.split('|');
      cat = parts[0];
      dur = parts[1];
    } else {
      // Fallback inference for older items without a pipe
      const lowerName = service.name.toLowerCase();
      if (lowerName.includes('pt') || lowerName.includes('trainer') || lowerName.includes('session')) cat = 'Trainer';
      else if (lowerName.includes('plan') || lowerName.includes('membership')) cat = 'Membership';
      else cat = 'Class';
    }

    setFormData({
      name: service.name,
      duration: dur,
      price: service.price,
      category: cat
    });
    setEditingId(service.id);
    setShowAddForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const payload = {
        name: formData.name,
        // Store category explicitly in the description field using a pipe delimiter
        description: `${formData.category}|${formData.duration}`,
        price: parseFloat(formData.price),
        duration: 60
      };

      if (editingId) {
        await axios.put(`http://localhost:5000/api/businesses/${businessId}/services/${editingId}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`http://localhost:5000/api/businesses/${businessId}/services`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      
      setFormData({ name: '', duration: '', price: '', category: 'Membership' });
      setShowAddForm(false);
      setEditingId(null);
      fetchData(); // Refresh list
    } catch (error) {
      console.error('Failed to save service:', error);
      alert('Failed to save service');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/businesses/${businessId}/services/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setServices(services.filter(s => s.id !== id));
    } catch (error) {
      console.error('Failed to delete service:', error);
      alert('Failed to delete service');
    }
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading services...</div>;

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', margin: '0 0 0.5rem 0' }}>Gym Offerings</h1>
          <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Manage your memberships, classes, and personal trainers.</p>
        </div>
        <button className="btn-primary" onClick={() => {
          setEditingId(null);
          setFormData({ name: '', duration: '', price: '', category: 'Membership' });
          setShowAddForm(!showAddForm);
        }} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FiPlus /> Add Offering
        </button>
      </div>

      {showAddForm && (
        <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.2rem' }}>{editingId ? 'Edit Offering' : 'Add New Offering'}</h2>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            
            <div className="form-group">
              <label>Category</label>
              <select name="category" className="input-field" value={formData.category} onChange={handleInputChange}>
                <option value="Membership">Membership Plan</option>
                <option value="Class">Fitness Class</option>
                <option value="Trainer">Personal Trainer</option>
              </select>
            </div>

            <div className="form-group">
              <label>Name (e.g. Premium Plan, Yoga Class, John Doe)</label>
              <input type="text" name="name" className="input-field" required value={formData.name} onChange={handleInputChange} />
            </div>

            <div className="form-group">
              <label>Duration / Details (e.g. 1 Month, Mon 7AM)</label>
              <input type="text" name="duration" className="input-field" required value={formData.duration} onChange={handleInputChange} />
            </div>

            <div className="form-group">
              <label>Price (ETB)</label>
              <input type="number" name="price" className="input-field" required value={formData.price} onChange={handleInputChange} />
            </div>

            <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
              <button type="button" className="btn-secondary" onClick={() => {
                setShowAddForm(false);
                setEditingId(null);
              }}>Cancel</button>
              <button type="submit" className="btn-primary">{editingId ? 'Update Offering' : 'Save Offering'}</button>
            </div>
          </form>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {services.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
            No offerings added yet.
          </div>
        ) : (
          services.map(service => {
            let cat = 'Membership';
            let dur = service.description || '';
            if (dur.includes('|')) {
              const parts = dur.split('|');
              cat = parts[0];
              dur = parts[1];
            } else {
              const lowerName = service.name.toLowerCase();
              if (lowerName.includes('pt') || lowerName.includes('trainer') || lowerName.includes('session')) cat = 'Trainer';
              else if (lowerName.includes('plan') || lowerName.includes('membership')) cat = 'Membership';
              else cat = 'Class';
            }

            return (
              <div key={service.id} className="glass-panel hover-scale" style={{ padding: '1.5rem', position: 'relative' }}>
                <div style={{ position: 'absolute', top: 0, right: 0, background: 'rgba(255,255,255,0.05)', padding: '4px 10px', fontSize: '0.75rem', borderRadius: '0 0 0 8px', color: 'var(--text-secondary)' }}>
                  {cat}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.3rem' }}>{service.name}</h3>
                    <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9rem' }}>{dur}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      className="btn-secondary" 
                      style={{ padding: '8px' }} 
                      title="Edit"
                      onClick={() => handleEdit(service)}
                    >
                      <FiEdit2 size={16} />
                    </button>
                    <button 
                      className="btn-secondary" 
                      style={{ padding: '8px', color: 'var(--danger)', borderColor: 'rgba(239,68,68,0.3)' }} 
                      title="Delete"
                      onClick={() => handleDelete(service.id)}
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-secondary)' }}>
                  {service.price} <span style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: 'normal' }}>ETB</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default DashboardGymServices;
