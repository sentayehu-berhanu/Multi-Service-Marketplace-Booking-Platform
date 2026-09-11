import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DashboardEventsManagement = () => {
  const [businessId, setBusinessId] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Music', // default
    date: '',
    time: '',
    venue: '',
    city: 'Addis Ababa',
    price: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const CATEGORIES = ['Music', 'Festivals', 'Sports', 'Theater', 'Comedy', 'Business', 'Other'];

  useEffect(() => {
    fetchBusinessAndEvents();
  }, []);

  const fetchBusinessAndEvents = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const bizRes = await axios.get('http://localhost:5000/api/businesses/my', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (bizRes.data && bizRes.data.length > 0) {
        const business = bizRes.data[0];
        setBusinessId(business.id);
        
        const eventRes = await axios.get(`http://localhost:5000/api/events?businessId=${business.id}`);
        setEvents(eventRes.data);
      }
    } catch (err) {
      console.error('Failed to fetch data:', err);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('category', formData.category);
      submitData.append('date', formData.date);
      submitData.append('time', formData.time);
      submitData.append('venue', formData.venue);
      submitData.append('city', formData.city);
      submitData.append('price', formData.price);
      if (imageFile) {
        submitData.append('imageFile', imageFile);
      }

      const res = await axios.post(`http://localhost:5000/api/events/business/${businessId}`, submitData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setEvents([res.data.event, ...events]);
      setSuccess('Event added successfully!');
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        category: 'Music',
        date: '',
        time: '',
        venue: '',
        city: 'Addis Ababa',
        price: ''
      });
      setImageFile(null);
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Failed to add event:', err);
      setError(err.response?.data?.error || 'Failed to add event. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this event?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/events/business/${businessId}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setEvents(events.filter(evt => evt.id !== id));
    } catch (err) {
      console.error('Failed to delete event:', err);
      alert('Failed to remove event. Please try again.');
    }
  };

  if (loading) return <div>Loading...</div>;

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    try {
      const [hours, minutes] = timeStr.split(':');
      if (!hours || !minutes) return timeStr;
      const h = parseInt(hours, 10);
      const ampm = h >= 12 ? 'PM' : 'AM';
      const h12 = h % 12 || 12;
      return `${h12}:${minutes} ${ampm}`;
    } catch {
      return timeStr;
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', margin: 0 }}>Manage Events</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        {/* Add Event Form */}
        <div className="glass-panel" style={{ padding: '2rem', alignSelf: 'start' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>Add New Event</h2>
          
          {error && <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '10px', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}
          {success && <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', padding: '10px', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem' }}>{success}</div>}
          
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Event Title</label>
              <input 
                type="text" 
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="input-field"
                style={{ width: '100%' }}
                placeholder="e.g. Ethio Jazz Festival"
              />
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Category</label>
              <select 
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="input-field"
                style={{ width: '100%' }}
              >
                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Date</label>
                <input 
                  type="date" 
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                  className="input-field"
                  style={{ width: '100%' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Time</label>
                <input 
                  type="time" 
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  required
                  className="input-field"
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Venue</label>
              <input 
                type="text" 
                name="venue"
                value={formData.venue}
                onChange={handleInputChange}
                required
                className="input-field"
                style={{ width: '100%' }}
                placeholder="e.g. Millennium Hall"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>City</label>
                <input 
                  type="text" 
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  className="input-field"
                  style={{ width: '100%' }}
                  placeholder="e.g. Addis Ababa"
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Ticket Price (ETB)</label>
                <input 
                  type="number" 
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  className="input-field"
                  style={{ width: '100%' }}
                  placeholder="e.g. 500"
                />
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Event Image</label>
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
              {submitting ? 'Adding...' : '+ Add Event'}
            </button>
          </form>
        </div>

        {/* Events List */}
        <div>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>Your Events</h2>
          {events.length === 0 ? (
            <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
              No events found. Add your first event using the form.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
              {events.map(event => (
                <div key={event.id} className="glass-panel hover-scale" style={{ padding: '1rem', display: 'flex', flexDirection: 'column' }}>
                  <img 
                    src={event.image?.startsWith('/uploads') ? `http://localhost:5000${event.image}` : (event.image || 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&q=80&w=400')} 
                    alt={event.title} 
                    style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '10px', marginBottom: '1rem' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.7rem', padding: '3px 8px', background: 'rgba(236, 72, 153, 0.1)', color: 'var(--accent-secondary)', borderRadius: '12px', fontWeight: 600 }}>
                      {event.category.toUpperCase()}
                    </span>
                    <span style={{ fontSize: '0.7rem', padding: '3px 8px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', borderRadius: '12px', fontWeight: 600 }}>
                      Available
                    </span>
                  </div>
                  <h3 style={{ margin: '0 0 10px 0', fontSize: '1.1rem' }}>{event.title}</h3>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '10px', flex: 1 }}>
                    <div style={{ marginBottom: '5px' }}>📅 {formatDate(event.date)} at {formatTime(event.time)}</div>
                    <div>📍 {event.venue}, {event.city}</div>
                  </div>
                  <div style={{ fontWeight: 'bold', color: 'var(--accent-primary)', marginBottom: '1rem' }}>
                    {event.price} ETB
                  </div>
                  
                  <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                    <button style={{ flex: 1, padding: '8px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-primary)', borderRadius: '8px', cursor: 'pointer' }}>
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(event.id)}
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

export default DashboardEventsManagement;
