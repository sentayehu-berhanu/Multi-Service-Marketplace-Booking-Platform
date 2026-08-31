import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';

const ParkingConfirmation = () => {
  const location = useLocation();
  const state = location.state;

  if (!state) {
    return <Navigate to="/" />;
  }

  const { space, duration, vehicle, total, parkingName } = state;
  const bookingRef = `#PK${Math.floor(10000 + Math.random() * 90000)}`;

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      
      <div style={{ background: 'white', padding: '3rem', borderRadius: '20px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', maxWidth: '500px', width: '100%', textAlign: 'center' }}>
        
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#dcfce7', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', margin: '0 auto 1.5rem' }}>
          ✓
        </div>
        
        <h1 style={{ fontSize: '2rem', color: '#0f172a', margin: '0 0 0.5rem 0' }}>Reservation Confirmed!</h1>
        <p style={{ color: '#64748b', fontSize: '1.1rem', marginBottom: '2rem' }}>Your parking space is secured.</p>

        <div style={{ background: '#f1f5f9', padding: '2rem', borderRadius: '15px', marginBottom: '2rem' }}>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '0.9rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Parking Location</span>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#0f172a' }}>{parkingName}</div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <div>
              <span style={{ fontSize: '0.9rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Space</span>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3b82f6' }}>{space}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.9rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Duration</span>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#0f172a' }}>{duration} {duration === 1 ? 'Hour' : 'Hours'}</div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ textAlign: 'left' }}>
              <span style={{ fontSize: '0.9rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Vehicle</span>
              <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#0f172a' }}>{vehicle}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.9rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Paid</span>
              <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#0f172a' }}>{total} ETB</div>
            </div>
          </div>

        </div>

        {/* QR Code Mock */}
        <div style={{ marginBottom: '2rem' }}>
          <span style={{ display: 'block', fontSize: '0.9rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>Scan to Enter</span>
          <div style={{ width: '150px', height: '150px', margin: '0 auto', background: 'white', padding: '10px', border: '2px solid #e2e8f0', borderRadius: '10px', position: 'relative' }}>
            {/* Simple CSS pattern to mock a QR code visually */}
            <div style={{ 
              width: '100%', height: '100%', 
              background: 'repeating-linear-gradient(45deg, #0f172a 0px, #0f172a 10px, transparent 10px, transparent 20px), repeating-linear-gradient(135deg, #0f172a 0px, #0f172a 10px, transparent 10px, transparent 20px)',
              borderRadius: '5px'
            }}></div>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'white', padding: '5px', fontWeight: 'bold', fontSize: '0.8rem' }}>
              P
            </div>
          </div>
          <div style={{ marginTop: '10px', fontWeight: 'bold', color: '#0f172a' }}>Booking {bookingRef}</div>
        </div>

        <Link to="/" style={{ textDecoration: 'none' }}>
          <button style={{ 
            width: '100%', padding: '15px', background: 'white', color: '#0f172a', 
            border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer',
            transition: 'all 0.2s'
          }}>
            Back to Home
          </button>
        </Link>
      </div>

    </div>
  );
};

export default ParkingConfirmation;
