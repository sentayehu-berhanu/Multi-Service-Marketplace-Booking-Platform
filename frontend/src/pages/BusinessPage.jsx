import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const MOCK_SERVICES = [
  { id: 1, name: 'Haircut', duration: '30 min', price: '200 ETB' },
  { id: 2, name: 'Beard Trim', duration: '15 min', price: '100 ETB' },
  { id: 3, name: 'Hair + Beard', duration: '45 min', price: '280 ETB' },
];

const BusinessPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const toggleService = (serviceId) => {
    setSelectedServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  // In a real app, we would fetch the business details based on the id
  const biz = {
    name: 'Elite Barber',
    rating: 4.8,
    reviews: 124,
    location: 'Bole, Addis Ababa',
    about: 'Premium barber services providing the best haircuts and grooming experiences in the city. Our professional staff ensures you leave looking your absolute best.',
    image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
  };

  return (
    <div>
      {/* Cover Image */}
      <div style={{ height: '350px', background: `url(${biz.image}) center/cover no-repeat`, position: 'relative' }}>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '200px', background: 'linear-gradient(to top, var(--bg-color), transparent)' }} />
      </div>

      <div className="container" style={{ marginTop: '-80px', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
          
          {/* Main Info */}
          <div style={{ flex: '1 1 600px' }}>
            <div style={{ marginBottom: '2rem' }}>
              <Link to="/" style={{ color: 'var(--text-secondary)', display: 'inline-block', marginBottom: '1rem' }}>← Back to Search</Link>
              <h1 style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>{biz.name}</h1>
              <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-secondary)', alignItems: 'center' }}>
                <span style={{ color: 'var(--warning)', fontWeight: 'bold' }}>⭐ {biz.rating}</span>
                <span>({biz.reviews} reviews)</span>
                <span>•</span>
                <span>📍 {biz.location}</span>
              </div>
            </div>

            <section style={{ marginBottom: '3rem' }}>
              <h2 style={{ marginBottom: '1rem' }}>About Us</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>{biz.about}</p>
            </section>

            <section>
              <h2 style={{ marginBottom: '1.5rem' }}>Services</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {MOCK_SERVICES.map(service => {
                  const isSelected = selectedServices.includes(service.id);
                  return (
                    <div key={service.id} className="glass-panel hover-scale" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: isSelected ? '1px solid var(--primary)' : undefined }}>
                      <div>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '5px' }}>{service.name}</h3>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>⏱ {service.duration}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <span style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-primary)' }}>{service.price}</span>
                        <button 
                          className={isSelected ? "btn-primary" : "btn-secondary"} 
                          style={{ padding: '8px 16px' }}
                          onClick={() => toggleService(service.id)}
                        >
                          {isSelected ? 'Selected' : 'Select'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

          {/* Booking Widget */}
          <div style={{ flex: '1 1 350px' }}>
            <div className="glass-panel" style={{ padding: '2rem', position: 'sticky', top: '100px' }}>
              <h3 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Book Appointment</h3>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '8px' }}>Select Date</label>
                <input 
                  type="date" 
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '12px', border: 'var(--glass-border)', color: 'var(--text-primary)', colorScheme: 'dark' }} 
                />
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '8px' }}>Select Time</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {['09:00 AM', '10:00 AM', '11:30 AM', '01:00 PM'].map(time => (
                    <button 
                      key={time}
                      className={selectedTime === time ? "btn-primary" : "btn-secondary"} 
                      style={{ padding: '10px' }}
                      onClick={() => setSelectedTime(time)}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                className="btn-primary" 
                style={{ width: '100%', fontSize: '1.1rem', padding: '15px' }}
                onClick={async () => {
                  if (selectedServices.length === 0) {
                    alert('Please select at least one service to book.');
                    return;
                  }
                  if (!selectedDate) {
                    alert('Please select a date for your appointment.');
                    return;
                  }
                  if (!selectedTime) {
                    alert('Please select a time for your appointment.');
                    return;
                  }
                  
                  try {
                    const token = localStorage.getItem('token');
                    if (!token) {
                      alert('You must be logged in to book an appointment.');
                      navigate('/login');
                      return;
                    }

                    // Convert selectedDate and selectedTime to a Date object
                    const dateStr = `${selectedDate} ${selectedTime}`;
                    const start_time = new Date(dateStr).toISOString();

                    // Book the first selected service for simplicity
                    const payload = {
                      business_id: parseInt(id || 1), // fallback to 1 since url might not have proper id in mock
                      service_id: selectedServices[0],
                      start_time: start_time
                    };

                    await axios.post('http://localhost:5000/api/bookings', payload, {
                      headers: { Authorization: `Bearer ${token}` }
                    });

                    alert('Booking Confirmed!');
                    navigate('/my-bookings');
                  } catch (error) {
                    console.error('Booking failed', error);
                    alert('Failed to create booking: ' + (error.response?.data?.error || error.message));
                  }
                }}
              >
                Continue to Book
              </button>
              <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '1rem', fontSize: '0.9rem' }}>
                You won't be charged yet
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default BusinessPage;
