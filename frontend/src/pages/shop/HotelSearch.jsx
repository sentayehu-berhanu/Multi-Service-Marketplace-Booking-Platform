import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const HotelSearch = () => {
  const navigate = useNavigate();
  
  const [destination, setDestination] = useState('Addis Ababa');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);
  
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set default dates (tomorrow and day after tomorrow)
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfter = new Date(today);
    dayAfter.setDate(dayAfter.getDate() + 2);
    
    setCheckIn(tomorrow.toISOString().split('T')[0]);
    setCheckOut(dayAfter.toISOString().split('T')[0]);

    // Fetch hotels
    const fetchHotels = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/businesses?category=Hotel');
        
        if (res.data.length === 0) {
          // Provide a mock hotel if none exist in DB yet
          setHotels([{
            id: 200,
            name: 'Grand Hotel Addis',
            rating: 4.6,
            address: 'Bole Road, Addis Ababa',
            cover_image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            description: 'Luxury hotel in the heart of the city featuring a spa, pool, and fine dining.'
          }]);
        } else {
          setHotels(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch hotels:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    // In a real app, this would refetch with query params. Here we just mock it visually.
    alert(`Searching for hotels in ${destination} for ${guests} guests from ${checkIn} to ${checkOut}...`);
  };

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      
      {/* Hero Search Section */}
      <div style={{ 
        background: 'linear-gradient(rgba(15, 23, 42, 0.7), rgba(15, 23, 42, 0.7)), url("https://images.unsplash.com/photo-1542314831-c6a4d14eff40?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80") center/cover',
        padding: '6rem 24px 4rem 24px',
        textAlign: 'center',
        color: 'white'
      }}>
        <h1 style={{ fontSize: '3.5rem', margin: '0 0 1rem 0', fontWeight: '800' }}>Find Your Perfect Stay</h1>
        <p style={{ fontSize: '1.2rem', margin: '0 0 3rem 0', opacity: 0.9 }}>Hotels, resorts, and guesthouses across Ethiopia</p>
        
        {/* Search Widget */}
        <div style={{ 
          background: 'white', borderRadius: '15px', padding: '10px', 
          maxWidth: '900px', margin: '0 auto', display: 'flex', gap: '10px', 
          boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', flexWrap: 'wrap'
        }}>
          <div style={{ flex: '1 1 200px', padding: '10px' }}>
            <label style={{ display: 'block', color: '#64748b', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '5px', textAlign: 'left' }}>Destination</label>
            <input type="text" value={destination} onChange={e => setDestination(e.target.value)} style={{ width: '100%', border: 'none', fontSize: '1.1rem', color: '#0f172a', outline: 'none', fontWeight: 'bold' }} />
          </div>
          <div style={{ width: '1px', background: '#e2e8f0', margin: '10px 0' }}></div>
          <div style={{ flex: '1 1 150px', padding: '10px' }}>
            <label style={{ display: 'block', color: '#64748b', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '5px', textAlign: 'left' }}>Check-in</label>
            <input type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)} style={{ width: '100%', border: 'none', fontSize: '1rem', color: '#0f172a', outline: 'none', fontFamily: 'inherit' }} />
          </div>
          <div style={{ width: '1px', background: '#e2e8f0', margin: '10px 0' }}></div>
          <div style={{ flex: '1 1 150px', padding: '10px' }}>
            <label style={{ display: 'block', color: '#64748b', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '5px', textAlign: 'left' }}>Check-out</label>
            <input type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)} style={{ width: '100%', border: 'none', fontSize: '1rem', color: '#0f172a', outline: 'none', fontFamily: 'inherit' }} />
          </div>
          <div style={{ width: '1px', background: '#e2e8f0', margin: '10px 0' }}></div>
          <div style={{ flex: '1 1 100px', padding: '10px' }}>
            <label style={{ display: 'block', color: '#64748b', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '5px', textAlign: 'left' }}>Guests</label>
            <select value={guests} onChange={e => setGuests(e.target.value)} style={{ width: '100%', border: 'none', fontSize: '1.1rem', color: '#0f172a', outline: 'none', fontWeight: 'bold', background: 'transparent' }}>
              <option value="1">1 Guest</option>
              <option value="2">2 Guests</option>
              <option value="3">3 Guests</option>
              <option value="4">4 Guests</option>
            </select>
          </div>
          <button onClick={handleSearch} style={{ background: '#2563eb', color: 'white', border: 'none', padding: '0 30px', borderRadius: '10px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', flex: '1 1 100px' }}>
            Search
          </button>
        </div>
      </div>

      {/* Results Section */}
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 24px' }}>
        <h2 style={{ fontSize: '2rem', color: '#0f172a', marginBottom: '2rem' }}>Top Hotels in {destination}</h2>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem' }}>Loading hotels...</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {hotels.map(hotel => (
              <div key={hotel.id} style={{ display: 'flex', background: 'white', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
                <div style={{ width: '350px', background: `url(${hotel.cover_image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3'}) center/cover no-repeat` }}></div>
                <div style={{ padding: '2rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h3 style={{ fontSize: '1.8rem', margin: '0 0 10px 0', color: '#0f172a' }}>{hotel.name}</h3>
                      <div style={{ color: '#64748b', marginBottom: '15px' }}>📍 {hotel.address || 'Addis Ababa'}</div>
                    </div>
                    <div style={{ background: '#1e40af', color: 'white', padding: '5px 10px', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1rem' }}>
                      {hotel.rating || '4.5'}
                    </div>
                  </div>
                  
                  <p style={{ color: '#475569', lineHeight: '1.6', marginBottom: '20px' }}>
                    {hotel.description || 'Experience ultimate luxury and comfort at our premier destination. Featuring state-of-the-art amenities, breathtaking views, and exceptional hospitality designed to make your stay unforgettable.'}
                  </p>
                  
                  <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                    <span style={{ fontSize: '0.9rem', color: '#64748b', background: '#f1f5f9', padding: '5px 10px', borderRadius: '20px' }}>Free WiFi</span>
                    <span style={{ fontSize: '0.9rem', color: '#64748b', background: '#f1f5f9', padding: '5px 10px', borderRadius: '20px' }}>Pool</span>
                    <span style={{ fontSize: '0.9rem', color: '#64748b', background: '#f1f5f9', padding: '5px 10px', borderRadius: '20px' }}>Spa</span>
                    <span style={{ fontSize: '0.9rem', color: '#64748b', background: '#f1f5f9', padding: '5px 10px', borderRadius: '20px' }}>Restaurant</span>
                  </div>

                  <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'flex-end' }}>
                    <Link to={`/business/hotel/${hotel.id}?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`}>
                      <button style={{ background: '#0f172a', color: 'white', border: 'none', padding: '12px 25px', borderRadius: '8px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer' }}>
                        View Availability
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default HotelSearch;
