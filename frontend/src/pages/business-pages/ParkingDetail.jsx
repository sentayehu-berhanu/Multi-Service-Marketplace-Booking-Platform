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

  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('telebirr');

  const handleReserve = async () => {
    if (!selectedSpace) return alert('Please select a parking space.');
    if (!vehicle) return alert('Please enter your vehicle details.');
    
    setIsProcessing(true);
    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsProcessing(false);

    // Pass data to confirmation via state
    navigate('/booking/parking/success', {
      state: {
        space: selectedSpace,
        duration: duration,
        vehicle: vehicle,
        total: total,
        parkingName: 'Safe Parking',
        paymentMethod: paymentMethod
      }
    });
  };

  const business = {
    name: 'Safe Parking',
    rating: 4.8,
    reviews: 120,
    distance: '1.2 km',
    location: 'Bole, Addis Ababa',
    gallery: [
      'https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?ixlib=rb-4.0.3&w=400&q=80',
      'https://images.unsplash.com/photo-1590674899484-d5640e854abe?ixlib=rb-4.0.3&w=400&q=80',
      'https://images.unsplash.com/photo-1543881477-8326e5fc5775?ixlib=rb-4.0.3&w=400&q=80'
    ]
  };

  const [activeTab, setActiveTab] = useState('Map');
  const TABS = ['Overview', 'Map', 'Reviews', 'Gallery'];

  return (
    <div style={{ background: '#f4f7fb', minHeight: '100vh', fontFamily: "'Inter', sans-serif", padding: '2rem' }}>
      
      {/* Top Header */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '15px' }}>
        <div style={{ fontSize: '2rem', color: '#3b82f6' }}>🅿️</div>
        <h1 style={{ fontSize: '1.2rem', color: '#0f172a', margin: 0, fontWeight: '800', letterSpacing: '0.5px' }}>RESERVATION - PARKING</h1>
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
                    color: activeTab === tab ? '#3b82f6' : '#64748b',
                    borderBottom: activeTab === tab ? '3px solid #3b82f6' : '3px solid transparent',
                    marginBottom: '-1px'
                  }}
                >{tab}</button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'Map' && (
              <div>
                <h3 style={{ fontSize: '1.2rem', color: '#0f172a', marginBottom: '1.5rem', fontWeight: 'bold' }}>Parking Map</h3>
                
                <div style={{ 
                  background: '#f8fafc', padding: '2rem', borderRadius: '15px', 
                  display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', border: '1px solid #e2e8f0'
                }}>
                  {SPACES.map(space => (
                    <div 
                      key={space.id}
                      onClick={() => space.status === 'available' && setSelectedSpace(space.id)}
                      style={{
                        background: space.status === 'occupied' ? '#e2e8f0' : selectedSpace === space.id ? '#eff6ff' : 'white',
                        color: space.status === 'occupied' ? '#94a3b8' : selectedSpace === space.id ? '#3b82f6' : '#334155',
                        padding: '1.5rem 1rem',
                        borderRadius: '10px',
                        textAlign: 'center',
                        fontWeight: 'bold',
                        fontSize: '1.2rem',
                        cursor: space.status === 'available' ? 'pointer' : 'not-allowed',
                        border: selectedSpace === space.id ? '2px solid #3b82f6' : '2px solid #e2e8f0',
                        transition: 'all 0.2s'
                      }}
                    >
                      {space.id}
                      <div style={{ fontSize: '0.8rem', marginTop: '5px', fontWeight: 'normal', color: space.status === 'occupied' ? '#94a3b8' : '#64748b' }}>
                        {space.status === 'occupied' ? '🔴 Taken' : '🟢 Open'}
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '1.5rem', color: '#64748b', fontSize: '0.9rem' }}>
                  <span><span style={{ color: '#22c55e' }}>🟢</span> Available</span>
                  <span><span style={{ color: '#ef4444' }}>🔴</span> Occupied</span>
                  <span><span style={{ color: '#3b82f6' }}>🔵</span> Selected</span>
                </div>
              </div>
            )}
            {activeTab !== 'Map' && <div style={{ color: '#64748b' }}>{activeTab} content...</div>}
          </div>

          {/* Right Column (Widget) */}
          <div style={{ flex: '1 1 350px' }}>
            <div style={{ background: '#f8fafc', borderRadius: '15px', padding: '2rem', border: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#0f172a', marginBottom: '1.5rem', fontWeight: 'bold' }}>Reservation</h3>
              
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.9rem', color: '#475569', marginBottom: '5px', fontWeight: '500' }}>Selected Space</label>
                <div style={{ padding: '12px', background: 'white', border: '1px solid #cbd5e1', borderRadius: '8px', fontWeight: 'bold', color: selectedSpace ? '#0f172a' : '#94a3b8' }}>
                  {selectedSpace || 'None selected'}
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.9rem', color: '#475569', marginBottom: '5px', fontWeight: '500' }}>Vehicle (Plate / Model)</label>
                <input type="text" placeholder="e.g. 🚗 Toyota Corolla" value={vehicle} onChange={e => setVehicle(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', background: 'white', outline: 'none', fontWeight: '500', color: '#0f172a' }} />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.9rem', color: '#475569', marginBottom: '5px', fontWeight: '500' }}>Duration</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <button onClick={() => setDuration(Math.max(1, duration - 1))} style={{ width: '40px', height: '40px', borderRadius: '8px', border: '1px solid #cbd5e1', background: 'white', fontSize: '1.5rem', cursor: 'pointer' }}>-</button>
                  <div style={{ fontSize: '1rem', fontWeight: 'bold', minWidth: '80px', textAlign: 'center', color: '#0f172a' }}>{duration} Hours</div>
                  <button onClick={() => setDuration(duration + 1)} style={{ width: '40px', height: '40px', borderRadius: '8px', border: '1px solid #cbd5e1', background: 'white', fontSize: '1.5rem', cursor: 'pointer' }}>+</button>
                </div>
              </div>

              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem', marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.9rem', color: '#475569', marginBottom: '10px', fontWeight: '500' }}>Payment Method</label>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                  <button onClick={() => setPaymentMethod('telebirr')} style={{ flex: 1, padding: '10px', border: paymentMethod === 'telebirr' ? '2px solid #00c2cb' : '1px solid #cbd5e1', background: paymentMethod === 'telebirr' ? '#f0fdfa' : 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', color: paymentMethod === 'telebirr' ? '#00c2cb' : '#64748b' }}>Telebirr</button>
                  <button onClick={() => setPaymentMethod('card')} style={{ flex: 1, padding: '10px', border: paymentMethod === 'card' ? '2px solid #3b82f6' : '1px solid #cbd5e1', background: paymentMethod === 'card' ? '#eff6ff' : 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', color: paymentMethod === 'card' ? '#3b82f6' : '#64748b' }}>Bank Card</button>
                </div>

                {paymentMethod === 'telebirr' && (
                  <input type="text" placeholder="09XX XXX XXX" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none', background: 'white' }} />
                )}
                {paymentMethod === 'card' && (
                  <input type="text" placeholder="Card Number" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none', background: 'white' }} />
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingTop: '10px', borderTop: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '1.1rem', color: '#475569', fontWeight: '500' }}>Total to Pay</span>
                <span style={{ fontSize: '1.3rem', color: '#0f172a', fontWeight: 'bold' }}>{total} ETB</span>
              </div>

              <button onClick={handleReserve} disabled={isProcessing} style={{ width: '100%', padding: '14px', background: isProcessing ? '#94a3b8' : '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1rem', cursor: isProcessing ? 'not-allowed' : 'pointer', marginBottom: '1.5rem', boxShadow: isProcessing ? 'none' : '0 4px 6px -1px rgba(59, 130, 246, 0.4)' }}>
                {isProcessing ? 'PROCESSING...' : `PAY & RESERVE`}
              </button>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginTop: '10px' }}>
                <span style={{ color: '#475569' }}>Contact</span>
                <span style={{ color: '#0f172a', fontWeight: '500' }}>+251 91 111 2233</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ParkingDetail;
