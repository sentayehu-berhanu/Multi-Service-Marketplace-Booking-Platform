import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SpaBooking = () => {
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState(null);
  const [selectedTherapist, setSelectedTherapist] = useState(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const services = [
    { id: 1, name: 'Full Body Massage', price: '700 ETB', icon: '💆‍♀️', duration: '60 min' },
    { id: 2, name: 'Aromatherapy', price: '750 ETB', icon: '🌿', duration: '60 min' },
    { id: 3, name: 'Hot Stone Massage', price: '800 ETB', icon: '🪨', duration: '90 min' },
    { id: 4, name: 'Facial', price: '600 ETB', icon: '✨', duration: '45 min' },
    { id: 5, name: 'Sauna', price: '400 ETB', icon: '🧖‍♀️', duration: '30 min' },
  ];

  const therapists = [
    { id: 1, name: 'Liya', image: 'https://i.pravatar.cc/150?img=1' },
    { id: 2, name: 'Sara', image: 'https://i.pravatar.cc/150?img=5' },
    { id: 3, name: 'Mimi', image: 'https://i.pravatar.cc/150?img=9' },
  ];

  const handleBooking = () => {
    if (!selectedService || !selectedTherapist || !date || !time) {
      alert("Please select a service, therapist, date, and time to proceed.");
      return;
    }
    
    setIsSubmitting(true);
    // Simulate booking process
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Spa Booking Confirmed Successfully!');
      navigate('/');
    }, 1500);
  };

  return (
    <div style={{
      minHeight: '100vh',
      fontFamily: "'Outfit', 'Inter', sans-serif",
      backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.7), rgba(15, 23, 42, 0.8)), url('/relax_spa_background.jpg')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      padding: '3rem 20px',
      color: 'white'
    }}>
      <div style={{
        maxWidth: '1000px',
        margin: '0 auto',
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '30px',
        padding: '3rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
      }}>
        
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <p style={{ color: '#a7f3d0', letterSpacing: '3px', textTransform: 'uppercase', fontSize: '0.9rem', fontWeight: 600, marginBottom: '10px' }}>
            Spa & Wellness
          </p>
          <h1 style={{ fontSize: '3.5rem', margin: 0, fontWeight: 300, fontFamily: 'serif', letterSpacing: '1px' }}>
            Relax Spa
          </h1>
          <p style={{ color: '#cbd5e1', marginTop: '15px', fontSize: '1.1rem', maxWidth: '500px', margin: '15px auto 0' }}>
            Rejuvenate your body and soul with our signature treatments.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
          
          {/* Left Column - Services */}
          <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', fontWeight: 400, borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
              Choose Service
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {services.map((service) => (
                <div 
                  key={service.id}
                  onClick={() => setSelectedService(service)}
                  style={{
                    padding: '1.2rem',
                    borderRadius: '16px',
                    background: selectedService?.id === service.id ? 'rgba(167, 243, 208, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                    border: `1px solid ${selectedService?.id === service.id ? '#a7f3d0' : 'rgba(255,255,255,0.05)'}`,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                  onMouseOver={(e) => {
                    if (selectedService?.id !== service.id) e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                  }}
                  onMouseOut={(e) => {
                    if (selectedService?.id !== service.id) e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <span style={{ fontSize: '1.8rem' }}>{service.icon}</span>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 500 }}>{service.name}</h3>
                      <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#94a3b8' }}>{service.duration}</p>
                    </div>
                  </div>
                  <div style={{ fontWeight: 600, color: selectedService?.id === service.id ? '#a7f3d0' : '#e2e8f0' }}>
                    {service.price}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Therapists & Time */}
          <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', fontWeight: 400, borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
              Choose Therapist
            </h2>
            <div style={{ display: 'flex', gap: '15px', marginBottom: '2.5rem' }}>
              {therapists.map((therapist) => (
                <div 
                  key={therapist.id}
                  onClick={() => setSelectedTherapist(therapist)}
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    padding: '1rem',
                    borderRadius: '16px',
                    background: selectedTherapist?.id === therapist.id ? 'rgba(167, 243, 208, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                    border: `1px solid ${selectedTherapist?.id === therapist.id ? '#a7f3d0' : 'rgba(255,255,255,0.05)'}`,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <img 
                    src={therapist.image} 
                    alt={therapist.name} 
                    style={{
                      width: '70px',
                      height: '70px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: `2px solid ${selectedTherapist?.id === therapist.id ? '#a7f3d0' : 'transparent'}`,
                      marginBottom: '10px'
                    }}
                  />
                  <div style={{ fontWeight: 500 }}>{therapist.name}</div>
                </div>
              ))}
            </div>

            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', fontWeight: 400, borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
              Schedule
            </h2>
            <div style={{ display: 'flex', gap: '15px', marginBottom: '3rem' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '0.9rem', color: '#cbd5e1', marginBottom: '8px' }}>Date</label>
                <input 
                  type="date" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '14px',
                    borderRadius: '12px',
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: 'white',
                    fontFamily: 'inherit',
                    outline: 'none',
                    colorScheme: 'dark'
                  }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '0.9rem', color: '#cbd5e1', marginBottom: '8px' }}>Time</label>
                <input 
                  type="time" 
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '14px',
                    borderRadius: '12px',
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: 'white',
                    fontFamily: 'inherit',
                    outline: 'none',
                    colorScheme: 'dark'
                  }}
                />
              </div>
            </div>

            <button 
              onClick={handleBooking}
              disabled={isSubmitting}
              style={{
                width: '100%',
                padding: '1.2rem',
                borderRadius: '12px',
                background: '#a7f3d0',
                color: '#064e3b',
                border: 'none',
                fontSize: '1.1rem',
                fontWeight: 600,
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 10px 25px -5px rgba(167, 243, 208, 0.4)',
                opacity: isSubmitting ? 0.7 : 1
              }}
              onMouseOver={(e) => {
                if (!isSubmitting) e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                if (!isSubmitting) e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {isSubmitting ? 'PROCESSING...' : 'BOOK SPA'}
            </button>
            
          </div>
        </div>

      </div>
    </div>
  );
};

export default SpaBooking;
