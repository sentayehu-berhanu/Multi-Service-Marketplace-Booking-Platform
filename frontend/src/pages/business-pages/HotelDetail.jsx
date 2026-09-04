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
    <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      
      {/* Header Info */}
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 24px 1rem 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', margin: '0 0 10px 0', color: '#0f172a' }}>{business.name}</h1>
            <div style={{ color: '#64748b', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '15px' }}>
              <span>📍 {business.address || business.location || 'Addis Ababa'}</span>
              <span style={{ color: '#2563eb', fontWeight: 'bold' }}>⭐ {business.rating || '4.6'}</span>
            </div>
          </div>
          <button style={{ background: 'white', border: '1px solid #cbd5e1', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', color: '#0f172a' }}>
            ♡ Save
          </button>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px 2rem 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gridTemplateRows: '200px 200px', gap: '10px', borderRadius: '20px', overflow: 'hidden' }}>
          <div style={{ gridRow: '1 / 3', background: `url(${business.gallery[0]}) center/cover no-repeat` }}></div>
          <div style={{ background: `url(${business.gallery[1]}) center/cover no-repeat` }}></div>
          <div style={{ background: `url(${business.gallery[2]}) center/cover no-repeat` }}></div>
        </div>
      </div>

      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px 4rem 24px', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        
        {/* Left: Rooms */}
        <div style={{ flex: '1 1 700px' }}>
          <h2 style={{ fontSize: '1.8rem', color: '#0f172a', marginBottom: '1.5rem' }}>Available Rooms</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {rooms.map(room => (
              <div key={room.id} style={{ display: 'flex', background: 'white', borderRadius: '15px', overflow: 'hidden', border: '1px solid #e2e8f0', flexWrap: 'wrap' }}>
                <div style={{ width: '250px', background: `url(${room.image}) center/cover no-repeat`, minHeight: '200px' }}></div>
                
                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ fontSize: '1.5rem', margin: '0 0 15px 0', color: '#0f172a' }}>{room.name}</h3>
                  
                  <div style={{ display: 'flex', gap: '20px', marginBottom: '15px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#475569', fontSize: '0.9rem' }}>
                      <span>🛏️</span> {room.beds}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#475569', fontSize: '0.9rem' }}>
                      <span>👤</span> Max {room.capacity} Guests
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#475569', fontSize: '0.9rem' }}>
                      <span>🖼️</span> {room.view}
                    </div>
                  </div>

                  <ul style={{ margin: '0 0 20px 0', paddingLeft: '20px', color: '#64748b', fontSize: '0.9rem', lineHeight: '1.6' }}>
                    <li>Free cancellation before {checkInParam || 'check-in'}</li>
                    <li>Breakfast included</li>
                  </ul>

                  <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                      <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0f172a' }}>{room.price} ETB</div>
                      <div style={{ color: '#64748b', fontSize: '0.9rem' }}>per night</div>
                    </div>
                    <button 
                      onClick={() => handleBookRoom(room)}
                      style={{ background: '#2563eb', color: 'white', border: 'none', padding: '12px 25px', borderRadius: '8px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer' }}
                    >
                      Book Room
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Booking Summary / Sticky Box */}
        <div style={{ flex: '1 1 350px' }}>
          <div style={{ background: 'white', padding: '2rem', borderRadius: '15px', border: '1px solid #e2e8f0', position: 'sticky', top: '2rem' }}>
            <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.2rem', color: '#0f172a', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>Your Search Details</h3>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span style={{ color: '#64748b' }}>Check-in</span>
              <span style={{ fontWeight: 'bold', color: '#0f172a' }}>{checkInParam || 'Not selected'}</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span style={{ color: '#64748b' }}>Check-out</span>
              <span style={{ fontWeight: 'bold', color: '#0f172a' }}>{checkOutParam || 'Not selected'}</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <span style={{ color: '#64748b' }}>Guests</span>
              <span style={{ fontWeight: 'bold', color: '#0f172a' }}>{guestsParam || 1} Guests</span>
            </div>

            <div style={{ background: '#f1f5f9', padding: '1rem', borderRadius: '8px', fontSize: '0.9rem', color: '#475569', textAlign: 'center' }}>
              Select a room on the left to proceed with booking.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default HotelDetail;
