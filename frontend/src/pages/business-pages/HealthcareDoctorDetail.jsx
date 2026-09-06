import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const HealthcareDoctorDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [selectedDay, setSelectedDay] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [consentGiven, setConsentGiven] = useState(false);

  // Mock data for Dr. Ahmed (or generic based on ID)
  const doctor = {
    name: 'Dr. Ahmed',
    specialist: 'General Physician',
    rating: 4.9,
    experience: '12 years',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    about: 'Dr. Ahmed is a highly experienced General Physician dedicated to providing comprehensive and compassionate care. He specializes in diagnosing and treating a wide range of adult illnesses and strongly believes in preventative medicine.',
    availableDays: ['Mon', 'Tue', 'Wed'],
    timeSlots: ['10:00', '10:30', '11:00', '11:30']
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
    <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: "'Inter', sans-serif", paddingBottom: '4rem' }}>
      
      {/* Header Banner */}
      <div style={{ background: '#115e59', padding: '3rem 24px', color: 'white' }}>
        <div className="container" style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <img 
            src={doctor.image} 
            alt={doctor.name} 
            style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover', border: '4px solid white' }}
          />
          <div>
            <h1 style={{ fontSize: '2.5rem', margin: '0 0 10px 0' }}>{doctor.name}</h1>
            <p style={{ fontSize: '1.2rem', color: '#ccfbf1', margin: '0 0 10px 0' }}>
              {doctor.specialist}
            </p>
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
              <span style={{ background: '#0f766e', padding: '5px 12px', borderRadius: '20px', fontSize: '0.9rem', fontWeight: 'bold' }}>
                ⭐ {doctor.rating} Rating
              </span>
              <span style={{ background: '#0f766e', padding: '5px 12px', borderRadius: '20px', fontSize: '0.9rem', fontWeight: 'bold' }}>
                💼 {doctor.experience} Experience
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ maxWidth: '1000px', margin: '3rem auto', padding: '0 24px', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        
        {/* Left Content - About & Schedule */}
        <div>
          <div style={{ background: 'white', padding: '2rem', borderRadius: '15px', border: '1px solid #e2e8f0', marginBottom: '2rem' }}>
            <h2 style={{ color: '#0f172a', marginTop: 0 }}>About</h2>
            <p style={{ color: '#475569', lineHeight: '1.7' }}>
              {doctor.about}
            </p>
          </div>

          <div style={{ background: 'white', padding: '2rem', borderRadius: '15px', border: '1px solid #e2e8f0' }}>
            <h2 style={{ color: '#0f172a', marginTop: 0 }}>Schedule Appointment</h2>
            
            <h3 style={{ color: '#334155', fontSize: '1.1rem', marginTop: '1.5rem' }}>Select Day</h3>
            <div style={{ display: 'flex', gap: '10px' }}>
              {doctor.availableDays.map(day => (
                <button 
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  style={{
                    padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', border: '1px solid #0d9488',
                    background: selectedDay === day ? '#0d9488' : 'white',
                    color: selectedDay === day ? 'white' : '#0d9488',
                    fontWeight: 'bold', transition: '0.2s'
                  }}
                >
                  {day}
                </button>
              ))}
            </div>

            <h3 style={{ color: '#334155', fontSize: '1.1rem', marginTop: '1.5rem' }}>Select Time</h3>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {doctor.timeSlots.map(time => (
                <button 
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  style={{
                    padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', border: '1px solid #0d9488',
                    background: selectedTime === time ? '#0d9488' : 'white',
                    color: selectedTime === time ? 'white' : '#0d9488',
                    fontWeight: 'bold', transition: '0.2s'
                  }}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar - Booking & Privacy */}
        <div>
          <div style={{ background: 'white', padding: '2rem', borderRadius: '15px', border: '1px solid #e2e8f0', position: 'sticky', top: '2rem' }}>
            <h3 style={{ color: '#0f172a', marginTop: 0, fontSize: '1.3rem' }}>Booking Summary</h3>
            
            <div style={{ padding: '15px', background: '#f8fafc', borderRadius: '8px', marginBottom: '1.5rem' }}>
              <p style={{ margin: '0 0 10px 0', color: '#475569' }}><strong>Doctor:</strong> {doctor.name}</p>
              <p style={{ margin: '0 0 10px 0', color: '#475569' }}><strong>Day:</strong> {selectedDay || 'Not selected'}</p>
              <p style={{ margin: 0, color: '#475569' }}><strong>Time:</strong> {selectedTime || 'Not selected'}</p>
            </div>

            {/* Privacy and Consent Section */}
            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem', marginBottom: '1.5rem' }}>
              <h4 style={{ color: '#115e59', display: 'flex', alignItems: 'center', gap: '5px', marginTop: 0 }}>
                🔒 Data Protection
              </h4>
              <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: '1.5' }}>
                Your health data is processed with end-to-end encryption. 
                We comply with strict medical privacy regulations (e.g. HIPAA / GDPR) and will never share your medical history without explicit consent.
              </p>
              
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginTop: '1rem', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={consentGiven}
                  onChange={(e) => setConsentGiven(e.target.checked)}
                  style={{ marginTop: '4px', width: '16px', height: '16px', accentColor: '#0d9488' }}
                />
                <span style={{ fontSize: '0.85rem', color: '#334155', fontWeight: 'bold' }}>
                  I consent to the collection and secure processing of my data for appointment booking purposes.
                </span>
              </label>
            </div>

            <button 
              onClick={handleBookAppointment}
              disabled={!consentGiven || !selectedDay || !selectedTime}
              style={{ 
                width: '100%', padding: '15px', 
                background: (!consentGiven || !selectedDay || !selectedTime) ? '#cbd5e1' : '#0d9488', 
                color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1rem',
                cursor: (!consentGiven || !selectedDay || !selectedTime) ? 'not-allowed' : 'pointer',
                transition: '0.2s'
              }}
            >
              BOOK APPOINTMENT
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default HealthcareDoctorDetail;
