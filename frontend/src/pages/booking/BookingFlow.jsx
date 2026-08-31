import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const STEPS = [
  'Service',
  'Barber',
  'Date',
  'Time',
  'Confirm',
  'Payment',
  'Done'
];

const BookingFlow = () => {
  const { businessId } = useParams();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(0);
  
  // Data State
  const [biz, setBiz] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Selections
  const [selectedService, setSelectedService] = useState(null);
  const [selectedBarber, setSelectedBarber] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  
  // Mock Barbers
  const BARBERS = [
    { id: 1, name: 'Mike', rating: 4.9, avatar: '🧔🏽‍♂️' },
    { id: 2, name: 'Alex', rating: 4.8, avatar: '👨🏼‍🦲' },
    { id: 3, name: 'David', rating: 5.0, avatar: '👨🏾‍' }
  ];

  const TIMES = ['09:00 AM', '09:30 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:30 PM', '04:00 PM'];

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/businesses/${businessId}`);
        setBiz(res.data);
      } catch (err) {
        console.error('Failed to fetch business', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBusiness();
  }, [businessId]);

  const handleNext = () => {
    setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
  };
  
  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleBook = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login first to book.');
        navigate('/login');
        return;
      }
      
      const dateStr = `${selectedDate} ${selectedTime}`;
      const start_time = new Date(dateStr).toISOString();

      await axios.post('http://localhost:5000/api/bookings', {
        business_id: parseInt(businessId),
        service_id: selectedService.id,
        start_time: start_time
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      handleNext(); // Move to Done
    } catch (err) {
      console.error(err);
      alert('Failed to create booking: ' + (err.response?.data?.error || err.message));
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '5rem' }}>Loading Booking System...</div>;
  if (!biz) return <div style={{ textAlign: 'center', padding: '5rem' }}>Business not found.</div>;

  return (
    <div className="container" style={{ padding: '2rem 24px', maxWidth: '800px', margin: '0 auto' }}>
      
      {/* Progress Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3rem', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '15px', left: 0, right: 0, height: '4px', background: 'rgba(255,255,255,0.1)', zIndex: 0 }} />
        <div style={{ position: 'absolute', top: '15px', left: 0, height: '4px', background: 'var(--primary)', zIndex: 1, width: `${(currentStep / (STEPS.length - 1)) * 100}%`, transition: 'width 0.3s ease' }} />
        
        {STEPS.map((step, idx) => (
          <div key={step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2 }}>
            <div style={{ 
              width: '34px', height: '34px', borderRadius: '50%', 
              background: idx <= currentStep ? 'var(--primary)' : 'var(--bg-card)',
              color: idx <= currentStep ? 'white' : 'var(--text-secondary)',
              display: 'flex', justifyContent: 'center', alignItems: 'center',
              fontWeight: 'bold', border: `2px solid ${idx <= currentStep ? 'var(--primary)' : 'rgba(255,255,255,0.1)'}`,
              transition: 'all 0.3s ease'
            }}>
              {idx + 1}
            </div>
            <span style={{ fontSize: '0.8rem', marginTop: '8px', color: idx <= currentStep ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{step}</span>
          </div>
        ))}
      </div>

      {/* Main Form Content */}
      <div className="glass-panel" style={{ padding: '3rem', borderRadius: '20px', minHeight: '450px', display: 'flex', flexDirection: 'column' }}>
        
        {/* Step 1: Service */}
        {currentStep === 0 && (
          <div>
            <h2 style={{ fontSize: '2rem', marginBottom: '2rem', textAlign: 'center' }}>Choose Service</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {(biz.services && biz.services.length > 0 ? biz.services : [
                { id: 1, name: 'Haircut', duration: '30', price: '200' },
                { id: 2, name: 'Beard Trim', duration: '15', price: '100' },
                { id: 3, name: 'Haircut + Beard', duration: '45', price: '280' }
              ]).map(service => (
                <div 
                  key={service.id} 
                  onClick={() => setSelectedService(service)}
                  style={{ 
                    padding: '1.5rem', border: selectedService?.id === service.id ? '2px solid var(--primary)' : '2px solid rgba(255,255,255,0.05)', 
                    borderRadius: '15px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    background: selectedService?.id === service.id ? 'rgba(79, 70, 229, 0.1)' : 'transparent',
                    transition: 'all 0.2s'
                  }}
                  className="hover-scale"
                >
                  <div>
                    <h3 style={{ margin: '0 0 5px 0' }}>{service.name}</h3>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>⏱ {service.duration} mins</span>
                  </div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 'bold' }}>{service.price} ETB</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Barber */}
        {currentStep === 1 && (
          <div>
            <h2 style={{ fontSize: '2rem', marginBottom: '2rem', textAlign: 'center' }}>Choose Barber</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
              {BARBERS.map(barber => (
                <div 
                  key={barber.id}
                  onClick={() => setSelectedBarber(barber)}
                  style={{ 
                    padding: '2rem 1rem', border: selectedBarber?.id === barber.id ? '2px solid var(--primary)' : '2px solid rgba(255,255,255,0.05)', 
                    borderRadius: '15px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center',
                    background: selectedBarber?.id === barber.id ? 'rgba(79, 70, 229, 0.1)' : 'transparent',
                    transition: 'all 0.2s'
                  }}
                  className="hover-scale"
                >
                  <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>{barber.avatar}</div>
                  <h3 style={{ margin: '0 0 5px 0' }}>{barber.name}</h3>
                  <span style={{ color: 'var(--warning)', fontSize: '0.9rem' }}>⭐ {barber.rating}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Date */}
        {currentStep === 2 && (
          <div>
            <h2 style={{ fontSize: '2rem', marginBottom: '2rem', textAlign: 'center' }}>Choose Date</h2>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <input 
                type="date" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                style={{ 
                  background: 'rgba(255,255,255,0.05)', border: '2px solid rgba(255,255,255,0.1)',
                  padding: '1.5rem', borderRadius: '15px', fontSize: '1.5rem', color: 'white', colorScheme: 'dark',
                  outline: 'none', width: '100%', maxWidth: '400px', cursor: 'pointer'
                }} 
              />
            </div>
          </div>
        )}

        {/* Step 4: Time */}
        {currentStep === 3 && (
          <div>
            <h2 style={{ fontSize: '2rem', marginBottom: '2rem', textAlign: 'center' }}>Choose Time</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              {TIMES.map(time => (
                <div 
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  style={{ 
                    padding: '1.5rem 1rem', border: selectedTime === time ? '2px solid var(--primary)' : '2px solid rgba(255,255,255,0.05)', 
                    borderRadius: '15px', cursor: 'pointer', textAlign: 'center', fontSize: '1.2rem', fontWeight: 'bold',
                    background: selectedTime === time ? 'rgba(79, 70, 229, 0.1)' : 'transparent',
                    transition: 'all 0.2s'
                  }}
                  className="hover-scale"
                >
                  {time}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 5: Confirm */}
        {currentStep === 4 && (
          <div>
            <h2 style={{ fontSize: '2rem', marginBottom: '2rem', textAlign: 'center' }}>Confirm Booking</h2>
            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '15px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Barber Shop</span>
                <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{biz.name}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Service</span>
                <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{selectedService?.name}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Expert</span>
                <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{selectedBarber?.avatar} {selectedBarber?.name}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Date & Time</span>
                <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{selectedDate} at {selectedTime}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.5rem' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '1.3rem' }}>Total Amount</span>
                <span style={{ fontWeight: 'bold', fontSize: '1.5rem', color: 'var(--accent-primary)' }}>{selectedService?.price} ETB</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 6: Payment */}
        {currentStep === 5 && (
          <div>
            <h2 style={{ fontSize: '2rem', marginBottom: '2rem', textAlign: 'center' }}>Payment details</h2>
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '2rem' }}>Complete your booking by paying securely.</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px', margin: '0 auto' }}>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--primary)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: '1.5rem' }}>💳</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 'bold' }}>Credit / Debit Card</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Mock Payment Gateway</div>
                </div>
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--primary)' }} />
              </div>
              
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: '1.5rem' }}>📱</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 'bold' }}>Telebirr / CBE Birr</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Mobile Money</div>
                </div>
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.2)' }} />
              </div>
            </div>
          </div>
        )}

        {/* Step 7: Done */}
        {currentStep === 6 && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, textAlign: 'center' }}>
            <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.2)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem', marginBottom: '2rem' }}>
              ✓
            </div>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Booking Confirmed!</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '400px', marginBottom: '3rem' }}>
              Your appointment with {selectedBarber?.name} is confirmed for {selectedDate} at {selectedTime}. We've sent a confirmation email.
            </p>
            <button className="btn-primary hover-scale" style={{ padding: '15px 40px', fontSize: '1.2rem', borderRadius: '30px' }} onClick={() => navigate('/my-bookings')}>
              View My Bookings
            </button>
          </div>
        )}

        {/* Navigation Buttons */}
        {currentStep < 6 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '2rem' }}>
            {currentStep > 0 ? (
              <button className="btn-secondary" style={{ padding: '12px 30px', fontSize: '1.1rem' }} onClick={handleBack}>Back</button>
            ) : (
              <div /> // Spacer
            )}
            
            {currentStep < 5 ? (
              <button 
                className="btn-primary" 
                style={{ padding: '12px 40px', fontSize: '1.1rem' }} 
                onClick={handleNext}
                disabled={
                  (currentStep === 0 && !selectedService) ||
                  (currentStep === 1 && !selectedBarber) ||
                  (currentStep === 2 && !selectedDate) ||
                  (currentStep === 3 && !selectedTime)
                }
              >
                Next Step
              </button>
            ) : (
              <button 
                className="btn-primary" 
                style={{ padding: '12px 40px', fontSize: '1.1rem', background: 'var(--success)' }} 
                onClick={handleBook}
              >
                Pay & Book
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default BookingFlow;
