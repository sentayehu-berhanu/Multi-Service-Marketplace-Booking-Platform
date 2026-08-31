import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ParkingShop = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const MOCK_PARKING = [
    { id: 4, name: 'Safe Parking', distance: '0.5 km', rating: 4.7, price: 100, available: 43, image: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60' },
    { id: 5, name: 'City Center Garage', distance: '1.2 km', rating: 4.5, price: 150, available: 12, image: 'https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60' },
    { id: 6, name: 'Airport Long Term', distance: '5.0 km', rating: 4.9, price: 50, available: 105, image: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60' }
  ];

  const filtered = MOCK_PARKING.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', color: '#1e293b' }}>
      
      {/* Search Header */}
      <div style={{ background: '#0f172a', padding: '4rem 24px', textAlign: 'center', color: 'white' }}>
        <h1 style={{ fontSize: '3rem', margin: '0 0 1rem 0' }}>Find Parking</h1>
        <p style={{ color: '#94a3b8', fontSize: '1.2rem', marginBottom: '2rem' }}>Reserve a secure spot in advance.</p>
        
        <div style={{ display: 'flex', gap: '1rem', maxWidth: '600px', margin: '0 auto' }}>
          <button style={{ 
            padding: '15px 25px', background: '#3b82f6', border: 'none', borderRadius: '12px', 
            color: 'white', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' 
          }}>
            📍 Use my location
          </button>
          <input 
            type="text" 
            placeholder="Search by area or parking name..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ 
              flex: 1, padding: '15px', borderRadius: '12px', border: 'none', 
              fontSize: '1rem', outline: 'none' 
            }}
          />
        </div>
      </div>

      {/* Nearby Parking List */}
      <div className="container" style={{ padding: '4rem 24px' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Nearby Parking</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '800px', margin: '0 auto' }}>
          {filtered.map(park => (
            <div key={park.id} style={{ 
              display: 'flex', background: 'white', borderRadius: '15px', overflow: 'hidden', 
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' 
            }}>
              <div style={{ width: '250px', background: `url(${park.image}) center/cover no-repeat` }} />
              <div style={{ padding: '2rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ fontSize: '1.8rem', margin: '0 0 5px 0' }}>{park.name}</h3>
                    <div style={{ display: 'flex', gap: '15px', color: '#64748b', fontSize: '1rem', marginBottom: '1rem' }}>
                      <span>📍 {park.distance}</span>
                      <span style={{ color: '#d97706', fontWeight: 'bold' }}>⭐ {park.rating}</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0f172a' }}>{park.price} ETB<span style={{ fontSize: '1rem', color: '#64748b', fontWeight: 'normal' }}>/hour</span></div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                  <div style={{ background: '#dcfce7', color: '#166534', padding: '6px 12px', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.9rem' }}>
                    🟢 {park.available} spaces available
                  </div>
                  <Link to={`/business/parking/${park.id}`} style={{ textDecoration: 'none' }}>
                    <button style={{ 
                      background: '#0f172a', color: 'white', border: 'none', padding: '12px 24px', 
                      borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' 
                    }}>
                      View Parking
                    </button>
                  </Link>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default ParkingShop;
