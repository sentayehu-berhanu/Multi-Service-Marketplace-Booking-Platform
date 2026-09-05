import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiUpload, FiMapPin, FiCalendar, FiClock, FiTool } from 'react-icons/fi';
import { MdOutlineElectricBolt, MdOutlinePlumbing, MdOutlineCarpenter, MdFormatPaint, MdAcUnit, MdHomeRepairService } from 'react-icons/md';

const services = [
  { id: 'electrician', name: 'Electrician', icon: <MdOutlineElectricBolt size={24} /> },
  { id: 'plumber', name: 'Plumber', icon: <MdOutlinePlumbing size={24} /> },
  { id: 'carpenter', name: 'Carpenter', icon: <MdOutlineCarpenter size={24} /> },
  { id: 'painter', name: 'Painter', icon: <MdFormatPaint size={24} /> },
  { id: 'ac', name: 'AC Technician', icon: <MdAcUnit size={24} /> },
  { id: 'appliance', name: 'Appliance Repair', icon: <MdHomeRepairService size={24} /> },
];

const HomeRepair = () => {
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = null || useState(null);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('Addis Ababa');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedService || !date || !time) {
      alert('Please select a service, date, and time.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in to book a service.');
        navigate('/login');
        return;
      }

      // 1. Fetch available home repair businesses
      const bizRes = await axios.get('http://localhost:5000/api/businesses?category=home-repair');
      if (!bizRes.data || bizRes.data.length === 0) {
        alert('No home repair providers are currently available in your area.');
        return;
      }

      // Grab the first available business for now
      const provider = bizRes.data[0];
      
      // 2. Find a matching service for the selected category or just grab the first one
      let service = provider.services?.find(s => s.name.toLowerCase().includes(selectedService));
      if (!service) service = provider.services?.[0];

      if (!service) {
        alert('This provider does not offer specific services yet.');
        return;
      }

      // 3. Create the booking
      const start_time = new Date(`${date}T${time}`).toISOString();
      await axios.post('http://localhost:5000/api/bookings', {
        business_id: provider.id,
        service_id: service.id,
        start_time: start_time
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('Booking request sent successfully!');
      navigate('/my-bookings');
    } catch (error) {
      console.error('Booking error:', error);
      alert('Failed to send booking request. Please try again.');
    }
  };

  return (
    <div className="container" style={{ padding: '40px 24px' }}>
      <div className="glass-panel" style={{ maxWidth: '800px', margin: '0 auto', padding: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '50%',
              background: 'var(--accent-gradient)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: 'var(--accent-glow)'
            }}>
              <FiTool size={32} color="white" />
            </div>
          </div>
          <h1 className="gradient-text" style={{ fontSize: '2.5rem', marginBottom: '12px' }}>HOME REPAIR</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>What do you need?</p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', 
          gap: '16px',
          marginBottom: '40px'
        }}>
          {services.map((service) => (
            <button
              key={service.id}
              onClick={() => setSelectedService(service.id)}
              style={{
                background: selectedService === service.id ? 'rgba(107, 70, 193, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                border: selectedService === service.id ? '1px solid var(--accent-primary)' : '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '16px',
                padding: '24px 16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
                color: selectedService === service.id ? 'white' : 'var(--text-secondary)',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              className="hover-scale"
            >
              <div style={{ color: selectedService === service.id ? 'var(--accent-secondary)' : 'inherit' }}>
                {service.icon}
              </div>
              <span style={{ fontWeight: '500' }}>{service.name}</span>
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <h3 style={{ marginBottom: '16px', fontSize: '1.5rem' }}>Request form</h3>
            
            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label>Describe your problem</label>
              <textarea 
                className="input-field"
                placeholder="My kitchen sink is leaking..."
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{ resize: 'vertical' }}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label>Upload photos</label>
              <div style={{
                border: '2px dashed rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '32px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }} className="hover-scale">
                <FiUpload size={24} style={{ color: 'var(--accent-secondary)', marginBottom: '8px' }} />
                <p style={{ color: 'var(--text-secondary)', margin: 0 }}>+ Upload</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
              <div className="form-group">
                <label><FiMapPin style={{ marginRight: '8px', verticalAlign: 'middle' }}/>Location</label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              
              <div className="form-group">
                <label><FiCalendar style={{ marginRight: '8px', verticalAlign: 'middle' }}/>Preferred Date</label>
                <input 
                  type="date" 
                  className="input-field" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label><FiClock style={{ marginRight: '8px', verticalAlign: 'middle' }}/>Preferred Time</label>
                <input 
                  type="time" 
                  className="input-field" 
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            className="btn-primary" 
            style={{ width: '100%', marginTop: '16px', padding: '16px', fontSize: '1.2rem' }}
          >
            REQUEST SERVICE
          </button>
        </form>
      </div>
    </div>
  );
};

export default HomeRepair;
