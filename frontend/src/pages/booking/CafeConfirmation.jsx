import React, { useEffect, useState } from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';

const CafeConfirmation = () => {
  const location = useLocation();
  const state = location.state;
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate booking delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (!state) {
    return <Navigate to="/" />;
  }

  const { businessName, date, time, guests, tableId } = state;

  return (
    <div style={{ background: '#fef3c7', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: "'Outfit', sans-serif" }}>
      
      <div style={{ background: 'white', padding: '3rem', borderRadius: '20px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', maxWidth: '500px', width: '100%', textAlign: 'center' }}>
        
        {loading ? (
          <div>
            <div style={{ fontSize: '4rem', marginBottom: '1rem', animation: 'spin 2s linear infinite' }}>☕</div>
            <h2 style={{ color: '#78350f' }}>Confirming Table...</h2>
            <p style={{ color: '#92400e' }}>Hold tight while we reserve {tableId} for you.</p>
          </div>
        ) : (
          <div>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#dcfce7', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', margin: '0 auto 1.5rem' }}>
              ✓
            </div>
            <h2 style={{ fontSize: '2rem', color: '#78350f', margin: '0 0 0.5rem 0' }}>Table Reserved!</h2>
            <p style={{ color: '#92400e', marginBottom: '2rem' }}>Your table is booked at {businessName}</p>

            {/* Ticket */}
            <div style={{ background: '#fffbeb', border: '2px dashed #fde68a', borderRadius: '15px', padding: '2rem', textAlign: 'left', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span style={{ color: '#92400e', fontWeight: 'bold' }}>Date</span>
                <span style={{ color: '#451a03', fontWeight: 'bold' }}>{date}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span style={{ color: '#92400e', fontWeight: 'bold' }}>Time</span>
                <span style={{ color: '#451a03', fontWeight: 'bold' }}>{time}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span style={{ color: '#92400e', fontWeight: 'bold' }}>Guests</span>
                <span style={{ color: '#451a03', fontWeight: 'bold' }}>{guests} People</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid #fde68a' }}>
                <span style={{ color: '#92400e', fontWeight: 'bold' }}>Table No.</span>
                <span style={{ color: '#d97706', fontSize: '1.5rem', fontWeight: 'bold' }}>{tableId}</span>
              </div>
            </div>

            <div style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '2rem' }}>
              Show this screen to the host when you arrive.
            </div>

            <Link to="/">
              <button style={{ width: '100%', padding: '15px', background: '#78350f', color: 'white', border: 'none', borderRadius: '10px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer' }}>
                Back to Home
              </button>
            </Link>
          </div>
        )}

      </div>
    </div>
  );
};

export default CafeConfirmation;
