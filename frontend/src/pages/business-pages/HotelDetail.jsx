import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const HotelDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Extract query params passed from HotelSearch
  const searchParams = new URLSearchParams(location.search);
  const checkInParam = searchParams.get('checkIn');
  const checkOutParam = searchParams.get('checkOut');
  const guestsParam = searchParams.get('guests');

  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);

  // Booking Form State
  const [selectedRoom, setSelectedRoom] = useState('Deluxe Room');
  const [checkInDate, setCheckInDate] = useState('May 21, 2024');
  const [checkOutDate, setCheckOutDate] = useState('May 23, 2024');
  const [guests, setGuests] = useState('2 Adults');

  // MOCK ROOMS (Since backend Services table doesn't have all room-specific details like beds/views, we mock for UI completeness. 
  // In a real app, this would be fetched from business.services)
  const [rooms, setRooms] = useState([
    { id: 1, name: 'Standard Room', price: 1500, capacity: 2, beds: '1 Queen Bed', view: 'City View', image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { id: 2, name: 'Deluxe Room', price: 2500, capacity: 3, beds: '1 King Bed + 1 Sofa Bed', view: 'Pool View', image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { id: 3, name: 'Executive Suite', price: 4000, capacity: 4, beds: '2 King Beds', view: 'Panoramic City View', image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  ]);

  useEffect(() => {
    // If mock ID
    if (parseInt(id) >= 200) {
      setBusiness({
        id: id,
        name: 'Grand Hotel Addis',
        rating: 4.6,
        address: 'Bole Road, Addis Ababa',
        gallery: [
          'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1542314831-c6a4d14eff40?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1522798514-97ceb8c4f1c8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        ]
      });
      setLoading(false);
      return;
    }

    const fetchBusiness = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/businesses`);
        const found = res.data.find(b => b.id === parseInt(id));
        if (found) {
          setBusiness({
            ...found,
            gallery: [
              found.cover_image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
              'https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
              'https://images.unsplash.com/photo-1542314831-c6a4d14eff40?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            ]
          });
          
          try {
            const prodRes = await axios.get(`http://localhost:5000/api/products?businessId=${found.id}`);
            if (prodRes.data && prodRes.data.length > 0) {
              const roomKeywords = ['Room', 'room', 'Suite', 'suite', 'Penthouse', 'penthouse', 'Villa', 'villa'];
              const filteredRooms = prodRes.data.filter(p => {
                if (p.status === 'ARCHIVED') return false;
                const isRoomCategory = p.category && roomKeywords.some(kw => p.category.includes(kw));
                const isRoomName = p.name && roomKeywords.some(kw => p.name.includes(kw));
                return isRoomCategory || isRoomName;
              });

              setRooms(filteredRooms.map(p => ({
                id: p.id,
                name: p.name,
                price: p.price,
                capacity: p.category?.includes('Family') ? 4 : 2, 
                beds: p.category?.includes('Suite') ? '1 King Bed + Sofa' : '1 Double Bed',
                view: 'City View',
                image: p.image?.startsWith('/uploads') ? 'http://localhost:5000' + p.image : (p.image || 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'),
                description: p.description
              })));
            }
          } catch (e) {
            console.error("Failed to fetch rooms:", e);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBusiness();
  }, [id]);

  const handleBookRoom = (room) => {
    navigate('/checkout/hotel', {
      state: {
        hotelId: business.id,
        hotelName: business.name,
        room: room,
        checkIn: checkInParam,
        checkOut: checkOutParam,
        guests: guestsParam
      }
    });
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '4rem' }}>Loading Hotel Details...</div>;
  if (!business) return <div style={{ textAlign: 'center', padding: '4rem' }}>Hotel not found</div>;

  return (
    <div style={{ background: '#f4f7fb', minHeight: '100vh', fontFamily: "'Inter', sans-serif", padding: '2rem' }}>
      
      {/* Top Header */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '15px' }}>
        <div style={{ fontSize: '2rem', color: '#8b5cf6' }}>🛏️</div>
        <h1 style={{ fontSize: '1.2rem', color: '#0f172a', margin: 0, fontWeight: '800', letterSpacing: '0.5px' }}>RESERVATION - HOTEL</h1>
      </div>

      {/* Main Container Card */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', background: 'white', borderRadius: '20px', padding: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        
        {/* Business Header with inline image */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '2rem' }}>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <div style={{ width: '120px', height: '80px', borderRadius: '12px', background: `url(${business.gallery?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&w=400&q=80'}) center/cover` }}></div>
            <div>
              <h2 style={{ fontSize: '1.8rem', margin: '0 0 10px 0', color: '#0f172a' }}>{business.name || 'Grand Hotel'}</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: '#64748b' }}>
                <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>⭐ {business.rating || '4.8'}</span>
                <span>({business.reviews?.length || 115} reviews)</span>
                <span>•</span>
                <span style={{ color: '#059669', fontWeight: 'bold' }}>Open Now</span>
                <span>•</span>
                <span>📍 {business.distance || '2.2 km'} - {business.location || business.address || 'Bole Road, Addis Ababa'}</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '15px' }}>
            <button style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#64748b' }}>♡</button>
            <button style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#64748b' }}>📤</button>
          </div>
        </div>

        {/* Content Layout */}
        <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
          
          {/* Left Column - Select Room */}
          <div style={{ flex: '1 1 600px' }}>
            <h3 style={{ fontSize: '1.2rem', color: '#0f172a', marginBottom: '1.5rem', fontWeight: 'bold' }}>Select Room</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Room 1 */}
              <div 
                onClick={() => setSelectedRoom('Standard Room')}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: selectedRoom === 'Standard Room' ? '2px solid #8b5cf6' : '1px solid #e2e8f0', borderRadius: '12px', padding: '15px', cursor: 'pointer', background: selectedRoom === 'Standard Room' ? '#f5f3ff' : 'white' }}
              >
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: selectedRoom === 'Standard Room' ? '6px solid #8b5cf6' : '2px solid #cbd5e1', background: 'white' }}></div>
                  <div style={{ fontWeight: 'bold', color: '#0f172a', fontSize: '1rem' }}>Standard Room</div>
                </div>
                <div style={{ color: '#64748b', fontSize: '1rem' }}>1,500 ETB <span style={{ fontSize: '0.85rem' }}>/ Night</span></div>
              </div>

              {/* Room 2 */}
              <div 
                onClick={() => setSelectedRoom('Deluxe Room')}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: selectedRoom === 'Deluxe Room' ? '2px solid #8b5cf6' : '1px solid #e2e8f0', borderRadius: '12px', padding: '15px', cursor: 'pointer', background: selectedRoom === 'Deluxe Room' ? '#f5f3ff' : 'white' }}
              >
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: selectedRoom === 'Deluxe Room' ? '6px solid #8b5cf6' : '2px solid #cbd5e1', background: 'white' }}></div>
                  <div style={{ fontWeight: 'bold', color: '#0f172a', fontSize: '1rem' }}>Deluxe Room</div>
                </div>
                <div style={{ color: '#64748b', fontSize: '1rem' }}>3,000 ETB <span style={{ fontSize: '0.85rem' }}>/ Night</span></div>
              </div>

              {/* Room 3 */}
              <div 
                onClick={() => setSelectedRoom('Suite Room')}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: selectedRoom === 'Suite Room' ? '2px solid #8b5cf6' : '1px solid #e2e8f0', borderRadius: '12px', padding: '15px', cursor: 'pointer', background: selectedRoom === 'Suite Room' ? '#f5f3ff' : 'white' }}
              >
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: selectedRoom === 'Suite Room' ? '6px solid #8b5cf6' : '2px solid #cbd5e1', background: 'white' }}></div>
                  <div style={{ fontWeight: 'bold', color: '#0f172a', fontSize: '1rem' }}>Suite Room</div>
                </div>
                <div style={{ color: '#64748b', fontSize: '1rem' }}>6,000 ETB <span style={{ fontSize: '0.85rem' }}>/ Night</span></div>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Details */}
          <div style={{ flex: '1 1 350px' }}>
            <div style={{ background: '#f8fafc', borderRadius: '15px', padding: '2rem', border: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#0f172a', marginBottom: '1.5rem', fontWeight: 'bold' }}>Booking Details</h3>
              
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.9rem', color: '#475569', marginBottom: '5px', fontWeight: '500' }}>Check-in</label>
                <input type="text" value={checkInDate} onChange={e => setCheckInDate(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', background: 'white', outline: 'none', fontWeight: '500', color: '#0f172a' }} />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.9rem', color: '#475569', marginBottom: '5px', fontWeight: '500' }}>Check-out</label>
                <input type="text" value={checkOutDate} onChange={e => setCheckOutDate(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', background: 'white', outline: 'none', fontWeight: '500', color: '#0f172a' }} />
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', fontSize: '0.9rem', color: '#475569', marginBottom: '5px', fontWeight: '500' }}>Guests</label>
                <div style={{ position: 'relative' }}>
                  <select value={guests} onChange={e => setGuests(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', background: 'white', outline: 'none', appearance: 'none', fontWeight: '500', color: '#0f172a' }}>
                    <option>1 Adult</option>
                    <option>2 Adults</option>
                    <option>2 Adults, 1 Child</option>
                  </select>
                  <div style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#64748b', fontSize: '0.8rem' }}>▼</div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingTop: '10px', borderTop: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '1.1rem', color: '#475569', fontWeight: '500' }}>Total Price</span>
                <span style={{ fontSize: '1.3rem', color: '#0f172a', fontWeight: 'bold' }}>5,000 ETB</span>
              </div>

              <button style={{ width: '100%', padding: '14px', background: '#8b5cf6', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', marginBottom: '1.5rem', boxShadow: '0 4px 6px -1px rgba(139, 92, 246, 0.4)' }}>
                Book Now
              </button>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginTop: '10px' }}>
                <span style={{ color: '#475569' }}>Contact</span>
                <span style={{ color: '#0f172a', fontWeight: '500' }}>+251 91 222 3344</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default HotelDetail;
