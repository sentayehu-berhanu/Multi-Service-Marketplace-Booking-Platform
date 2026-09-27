import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const HealthcareDoctorDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('Doctors');

  // Booking Form State
  const [selectedDoctor, setSelectedDoctor] = useState('Dr. Sarah');
  const [selectedDate, setSelectedDate] = useState('May 21, 2024');
  const [selectedTime, setSelectedTime] = useState('10:00 AM');
  const [consentGiven, setConsentGiven] = useState(false);

  const TABS = ['Overview', 'Doctors', 'Reviews', 'Gallery'];

  const business = {
    name: 'Dr. Sarah Medical Center',
    rating: 4.9,
    reviews: 240,
    distance: '0.8 km',
    location: 'Sarbet, Addis Ababa',
    gallery: [
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&w=400&q=80',
      'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?ixlib=rb-4.0.3&w=400&q=80',
      'https://images.unsplash.com/photo-1538108149393-fbbd81895907?ixlib=rb-4.0.3&w=400&q=80'
    ]
  };

  const handleBookAppointment = () => {
    if (!consentGiven) return;
    if (!selectedDay || !selectedTime) {
      alert("Please select a day and time.");
      return;
    }
    alert(`Appointment booked with ${doctor.name} for ${selectedDay} at ${selectedTime}.`);
    // Navigate to a success page or back to search
    navigate('/shop/healthcare');
  };

  return (
    <div style={{ background: '#f4f7fb', minHeight: '100vh', fontFamily: "'Inter', sans-serif", padding: '2rem' }}>
      
      {/* Top Header */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '15px' }}>
        <div style={{ fontSize: '2rem', color: '#0d9488' }}>🏥</div>
        <h1 style={{ fontSize: '1.2rem', color: '#0f172a', margin: 0, fontWeight: '800', letterSpacing: '0.5px' }}>RESERVATION - CLINIC</h1>
      </div>

      {/* Main Container Card */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', background: 'white', borderRadius: '20px', padding: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        
        {/* Business Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
          <div>
            <h2 style={{ fontSize: '1.8rem', margin: '0 0 10px 0', color: '#0f172a' }}>{business.name}</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: '#64748b' }}>
              <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>⭐ {business.rating}</span>
              <span>({business.reviews} reviews)</span>
              <span>•</span>
              <span style={{ color: '#059669', fontWeight: 'bold' }}>Open Now</span>
              <span>•</span>
              <span>📍 {business.distance} - {business.location}</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '15px' }}>
            <button style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#64748b' }}>♡</button>
            <button style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#64748b' }}>📤</button>
          </div>
        </div>

        {/* Content Layout */}
        <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
          
          {/* Left Column */}
          <div style={{ flex: '1 1 600px' }}>
            
            {/* Gallery */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '1.5rem' }}>
              <div style={{ flex: 1, height: '150px', background: `url(${business.gallery[0]}) center/cover`, borderRadius: '12px' }}></div>
              <div style={{ flex: 1, height: '150px', background: `url(${business.gallery[1]}) center/cover`, borderRadius: '12px' }}></div>
              <div style={{ flex: 1, height: '150px', background: `url(${business.gallery[2]}) center/cover`, borderRadius: '12px' }}></div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid #e2e8f0', marginBottom: '2rem' }}>
              {TABS.map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{ 
                    background: 'none', border: 'none', padding: '10px 0', 
                    fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer',
                    color: activeTab === tab ? '#0d9488' : '#64748b',
                    borderBottom: activeTab === tab ? '3px solid #0d9488' : '3px solid transparent',
                    marginBottom: '-1px'
                  }}
                >{tab}</button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'Doctors' && (
              <div>
                <h3 style={{ fontSize: '1.2rem', color: '#0f172a', marginBottom: '1.5rem', fontWeight: 'bold' }}>Our Doctors</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {/* Doctor 1 */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '15px' }}>
                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                      <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'url(https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100) center/cover' }}></div>
                      <div>
                        <div style={{ fontWeight: 'bold', color: '#0f172a', fontSize: '1rem' }}>Dr. Sarah</div>
                        <div style={{ color: '#64748b', fontSize: '0.85rem' }}>General Physician • 12 Years Exp.</div>
                      </div>
                    </div>
                    <div style={{ fontWeight: 'bold', color: '#0f172a', fontSize: '1.1rem' }}>500 ETB</div>
                  </div>

                  {/* Doctor 2 */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '15px' }}>
                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                      <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'url(https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100) center/cover' }}></div>
                      <div>
                        <div style={{ fontWeight: 'bold', color: '#0f172a', fontSize: '1rem' }}>Dr. Ahmed</div>
                        <div style={{ color: '#64748b', fontSize: '0.85rem' }}>Pediatrician • 8 Years Exp.</div>
                      </div>
                    </div>
                    <div style={{ fontWeight: 'bold', color: '#0f172a', fontSize: '1.1rem' }}>600 ETB</div>
                  </div>

                  {/* Doctor 3 */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '15px' }}>
                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                      <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'url(https://images.unsplash.com/photo-1594824436998-ddf10d68f237?w=100) center/cover' }}></div>
                      <div>
                        <div style={{ fontWeight: 'bold', color: '#0f172a', fontSize: '1rem' }}>Dr. Helina</div>
                        <div style={{ color: '#64748b', fontSize: '0.85rem' }}>Dermatologist • 10 Years Exp.</div>
                      </div>
                    </div>
                    <div style={{ fontWeight: 'bold', color: '#0f172a', fontSize: '1.1rem' }}>800 ETB</div>
                  </div>
                </div>
              </div>
            )}
            {activeTab !== 'Doctors' && <div style={{ color: '#64748b' }}>{activeTab} content...</div>}
          </div>

          {/* Right Column (Widget) */}
          <div style={{ flex: '1 1 350px' }}>
            <div style={{ background: '#f8fafc', borderRadius: '15px', padding: '2rem', border: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#0f172a', marginBottom: '1.5rem', fontWeight: 'bold' }}>Book Appointment</h3>
              
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.9rem', color: '#475569', marginBottom: '5px', fontWeight: '500' }}>Select Doctor</label>
                <div style={{ position: 'relative' }}>
                  <select value={selectedDoctor} onChange={e => setSelectedDoctor(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', background: 'white', outline: 'none', appearance: 'none', fontWeight: '500', color: '#0f172a' }}>
                    <option>Dr. Sarah</option>
                    <option>Dr. Ahmed</option>
                    <option>Dr. Helina</option>
                  </select>
                  <div style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#64748b', fontSize: '0.8rem' }}>▼</div>
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.9rem', color: '#475569', marginBottom: '5px', fontWeight: '500' }}>Select Date</label>
                <input type="text" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', background: 'white', outline: 'none', fontWeight: '500', color: '#0f172a' }} />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.9rem', color: '#475569', marginBottom: '5px', fontWeight: '500' }}>Select Time</label>
                <div style={{ position: 'relative' }}>
                  <select value={selectedTime} onChange={e => setSelectedTime(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', background: 'white', outline: 'none', appearance: 'none', fontWeight: '500', color: '#0f172a' }}>
                    <option>10:00 AM</option>
                    <option>11:00 AM</option>
                  </select>
                  <div style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#64748b', fontSize: '0.8rem' }}>▼</div>
                </div>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <h4 style={{ color: '#0d9488', margin: '0 0 10px 0', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '5px' }}>🔒 Data Protection</h4>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={consentGiven} onChange={e => setConsentGiven(e.target.checked)} style={{ marginTop: '3px' }} />
                  <span style={{ fontSize: '0.8rem', color: '#475569', lineHeight: '1.4' }}>I consent to the collection and secure processing of my health data for appointment booking purposes.</span>
                </label>
              </div>

              <button style={{ width: '100%', padding: '14px', background: consentGiven ? '#0d9488' : '#cbd5e1', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1rem', cursor: consentGiven ? 'pointer' : 'not-allowed', marginBottom: '1.5rem', transition: '0.2s', boxShadow: consentGiven ? '0 4px 6px -1px rgba(13, 148, 136, 0.4)' : 'none' }}>
                Continue
              </button>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '5px' }}>
                <span style={{ color: '#475569' }}>Open Hours</span>
                <span style={{ color: '#0f172a', fontWeight: '500' }}></span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#64748b', marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
                <span>Mon - Sat</span>
                <span>8:00 AM - 6:00 PM</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginTop: '10px' }}>
                <span style={{ color: '#475569' }}>Contact</span>
                <span style={{ color: '#0f172a', fontWeight: '500' }}>+251 91 666 7788</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default HealthcareDoctorDetail;
