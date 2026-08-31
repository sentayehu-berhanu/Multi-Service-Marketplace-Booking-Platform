import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ParkingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [selectedSpace, setSelectedSpace] = useState(null);
  const [vehicle, setVehicle] = useState('');
  const [duration, setDuration] = useState(2);

  const SPACES = [
    { id: 'A01', status: 'available' }, { id: 'A02', status: 'occupied' }, { id: 'A03', status: 'available' },
    { id: 'A04', status: 'available' }, { id: 'A05', status: 'occupied' }, { id: 'A06', status: 'available' },
    { id: 'B01', status: 'occupied' },  { id: 'B02', status: 'available' }, { id: 'B03', status: 'available' },
  ];

  const pricePerHour = 100;
  const total = duration * pricePerHour;

  const handleReserve = () => {
    if (!selectedSpace) return alert('Please select a parking space.');
    if (!vehicle) return alert('Please enter your vehicle details.');
    
    // Pass data to confirmation via state
    navigate('/booking/parking/success', {
      state: {
        space: selectedSpace,
        duration: duration,
        vehicle: vehicle,
        total: total,
        parkingName: 'Safe Parking'
      }
    });
  };

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', color: '#1e293b' }}>
      
      {/* Header */}
      <div style={{ background: '#0f172a', padding: '3rem 24px', color: 'white' }}>
        <div className="container" style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <span style={{ textTransform: 'uppercase', color: '#94a3b8', fontSize: '0.9rem', fontWeight: 'bold', letterSpacing: '2px' }}>Parking Detail</span>
            <h1 style={{ fontSize: '3rem', margin: '0.5rem 0' }}>SAFE PARKING</h1>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <span style={{ fontSize: '1.2rem' }}>📍 Addis Ababa, Bole</span>
              <span style={{ background: '#166534', color: '#4ade80', padding: '5px 12px', borderRadius: '20px', fontWeight: 'bold' }}>🟢 43 Available</span>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#38bdf8' }}>{pricePerHour} ETB<span style={{ fontSize: '1rem', color: '#94a3b8' }}>/hr</span></div>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '3rem 24px', maxWidth: '900px', margin: '0 auto', display: 'flex', gap: '3rem' }}>
        
        {/* Left Col: Map */}
        <div style={{ flex: '1 1 60%' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>Parking Map</h2>
          
          <div style={{ 
            background: '#e2e8f0', padding: '2rem', borderRadius: '15px', 
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px'
          }}>
            {SPACES.map(space => (
              <div 
                key={space.id}
                onClick={() => space.status === 'available' && setSelectedSpace(space.id)}
                style={{
                  background: space.status === 'occupied' ? '#cbd5e1' : selectedSpace === space.id ? '#3b82f6' : 'white',
                  color: space.status === 'occupied' ? '#94a3b8' : selectedSpace === space.id ? 'white' : '#334155',
                  padding: '2rem 1rem',
                  borderRadius: '10px',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  fontSize: '1.2rem',
                  cursor: space.status === 'available' ? 'pointer' : 'not-allowed',
                  boxShadow: space.status === 'available' ? '0 4px 6px -1px rgba(0,0,0,0.1)' : 'none',
                  border: selectedSpace === space.id ? '2px solid #2563eb' : '2px solid transparent',
                  transition: 'all 0.2s'
                }}
              >
                {space.id}
                <div style={{ fontSize: '0.8rem', marginTop: '5px', fontWeight: 'normal' }}>
                  {space.status === 'occupied' ? '🔴 Taken' : '🟢 Open'}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '1.5rem', color: '#64748b' }}>
            <span><span style={{ color: '#22c55e' }}>🟢</span> Available</span>
            <span><span style={{ color: '#ef4444' }}>🔴</span> Occupied</span>
            <span><span style={{ color: '#3b82f6' }}>🔵</span> Selected</span>
          </div>
        </div>

        {/* Right Col: Booking Form */}
        <div style={{ flex: '1 1 40%' }}>
          <div style={{ background: 'white', padding: '2rem', borderRadius: '15px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', position: 'sticky', top: '20px' }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '2rem' }}>Reservation</h2>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontWeight: 'bold', color: '#64748b', marginBottom: '5px' }}>Selected Space</label>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: selectedSpace ? '#0f172a' : '#cbd5e1' }}>
                {selectedSpace || 'None selected'}
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontWeight: 'bold', color: '#64748b', marginBottom: '5px' }}>Vehicle (Plate / Model)</label>
              <input 
                type="text" 
                placeholder="e.g. 🚗 Toyota Corolla"
                value={vehicle}
                onChange={(e) => setVehicle(e.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none' }}
              />
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', fontWeight: 'bold', color: '#64748b', marginBottom: '5px' }}>Duration</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <button 
                  onClick={() => setDuration(Math.max(1, duration - 1))}
                  style={{ width: '40px', height: '40px', borderRadius: '8px', border: '1px solid #cbd5e1', background: 'white', fontSize: '1.5rem', cursor: 'pointer' }}
                >-</button>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', minWidth: '80px', textAlign: 'center' }}>
                  {duration} {duration === 1 ? 'Hour' : 'Hours'}
                </div>
                <button 
                  onClick={() => setDuration(duration + 1)}
                  style={{ width: '40px', height: '40px', borderRadius: '8px', border: '1px solid #cbd5e1', background: 'white', fontSize: '1.5rem', cursor: 'pointer' }}
                >+</button>
              </div>
            </div>

            <div style={{ borderTop: '2px dashed #cbd5e1', paddingTop: '1.5rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#64748b' }}>Total:</span>
              <span style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0f172a' }}>{total} ETB</span>
            </div>

            <button 
              onClick={handleReserve}
              style={{ 
                width: '100%', padding: '16px', background: '#3b82f6', color: 'white', 
                border: 'none', borderRadius: '8px', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer',
                boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.5)'
              }}
            >
              RESERVE NOW
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ParkingDetail;
