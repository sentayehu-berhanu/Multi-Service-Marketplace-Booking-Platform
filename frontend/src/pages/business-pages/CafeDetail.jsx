import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CafeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);

  // Reservation State
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [guests, setGuests] = useState(2);
  const [selectedTable, setSelectedTable] = useState(null);

  // MOCK TABLES (In a real app, these would come from the backend based on Date/Time/Guests)
  const [tables, setTables] = useState([
    { id: 'T1', capacity: 2, available: true },
    { id: 'T2', capacity: 4, available: false },
    { id: 'T3', capacity: 4, available: true },
    { id: 'T4', capacity: 6, available: true },
    { id: 'T5', capacity: 2, available: false },
    { id: 'T6', capacity: 8, available: true },
  ]);

  // MOCK MENU (In a real app, this would be fetched from business.products)
  const MENU = {
    Coffee: [
      { id: 201, name: 'Espresso', price: 80 },
      { id: 202, name: 'Macchiato', price: 90 },
      { id: 203, name: 'Latte', price: 120 },
      { id: 204, name: 'Cappuccino', price: 130 },
      { id: 205, name: 'Americano', price: 100 },
    ],
    Food: [
      { id: 301, name: 'Beef Burger', price: 350 },
      { id: 302, name: 'Chicken Wrap', price: 280 },
      { id: 303, name: 'Club Sandwich', price: 300 },
      { id: 304, name: 'Margherita Pizza', price: 450 },
      { id: 305, name: 'Pasta Carbonara', price: 400 },
    ],
    Pastries: [
      { id: 401, name: 'Croissant', price: 80 },
      { id: 402, name: 'Chocolate Muffin', price: 90 },
      { id: 403, name: 'Cheesecake Slice', price: 150 },
    ]
  };

  useEffect(() => {
    // If we only have mocked data (e.g. for id 100), bypass the fetch
    if (parseInt(id) >= 100) {
      setBusiness({
        id: id,
        name: 'Sunshine Café',
        rating: 4.8,
        location: '1.8 km away - Bole Road',
        isOpen: true,
        gallery: [
          'https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1445116572660-236099ec97a0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
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
              found.cover_image || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            ]
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBusiness();
  }, [id]);

  const handleReserve = () => {
    if (!selectedDate || !selectedTime || !selectedTable) {
      alert("Please select date, time, and an available table.");
      return;
    }
    
    navigate('/booking/cafe/success', {
      state: {
        businessName: business.name,
        date: selectedDate,
        time: selectedTime,
        guests: guests,
        tableId: selectedTable
      }
    });
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '4rem' }}>Loading Café...</div>;
  if (!business) return <div style={{ textAlign: 'center', padding: '4rem' }}>Café not found</div>;

  return (
    <div style={{ background: '#fef3c7', minHeight: '100vh', fontFamily: "'Outfit', sans-serif" }}>
      
      {/* Header Info */}
      <div style={{ background: '#78350f', padding: '4rem 24px', color: 'white' }}>
        <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '3.5rem', margin: '0 0 1rem 0' }}>{business.name}</h1>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center', fontSize: '1.1rem' }}>
            <span style={{ background: 'rgba(255,255,255,0.2)', padding: '5px 15px', borderRadius: '20px' }}>⭐ {business.rating || '4.8'}</span>
            <span>📍 {business.location || business.address || 'Bole, Addis Ababa'}</span>
            <span style={{ color: '#86efac', fontWeight: 'bold' }}>🟢 Open Now</span>
          </div>
        </div>
      </div>

      {/* Gallery */}
      <div style={{ background: '#451a03' }}>
        <div className="container" style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', overflowX: 'auto', gap: '10px', padding: '20px' }}>
          {business.gallery.map((img, idx) => (
            <img key={idx} src={img} alt="Cafe" style={{ height: '250px', borderRadius: '15px', objectFit: 'cover', flexShrink: 0 }} />
          ))}
        </div>
      </div>

      {/* Main Content: Split Menu and Reservation */}
      <div className="container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '3rem 24px', display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
        
        {/* Left Col: Menu */}
        <div style={{ flex: '1 1 400px' }}>
          <div style={{ background: 'white', padding: '2.5rem', borderRadius: '20px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '2rem', color: '#78350f', margin: '0 0 1rem 0', borderBottom: '2px solid #fde68a', paddingBottom: '1rem' }}>Menu</h2>
            
            {Object.entries(MENU).map(([category, items]) => (
              <div key={category} style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.3rem', color: '#92400e', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>{category}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {items.map(item => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span style={{ fontSize: '1.1rem', color: '#451a03', fontWeight: '500' }}>{item.name}</span>
                      <div style={{ flex: 1, borderBottom: '1px dotted #cbd5e1', margin: '0 10px' }}></div>
                      <span style={{ fontSize: '1.1rem', color: '#78350f', fontWeight: 'bold' }}>{item.price} ETB</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <button style={{ width: '100%', padding: '15px', background: '#fef3c7', color: '#78350f', border: '2px solid #fde68a', borderRadius: '10px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', marginTop: '1rem' }}>
              Download Full Menu (PDF)
            </button>
          </div>
        </div>

        {/* Right Col: Reservation */}
        <div style={{ flex: '1 1 400px' }}>
          <div style={{ background: '#fffbeb', padding: '2.5rem', borderRadius: '20px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', border: '1px solid #fde68a' }}>
            <h2 style={{ fontSize: '2rem', color: '#78350f', margin: '0 0 2rem 0' }}>Reserve a Table</h2>
            
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#92400e', fontWeight: 'bold' }}>Date</label>
                <input 
                  type="date" 
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #fcd34d', outline: 'none', background: 'white' }} 
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#92400e', fontWeight: 'bold' }}>Time</label>
                <input 
                  type="time" 
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #fcd34d', outline: 'none', background: 'white' }} 
                />
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#92400e', fontWeight: 'bold' }}>Guests</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <button 
                  onClick={() => setGuests(Math.max(1, guests - 1))}
                  style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'white', border: '2px solid #fcd34d', color: '#78350f', fontSize: '1.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >-</button>
                <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#451a03', width: '30px', textAlign: 'center' }}>{guests}</span>
                <button 
                  onClick={() => setGuests(guests + 1)}
                  style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'white', border: '2px solid #fcd34d', color: '#78350f', fontSize: '1.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >+</button>
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#92400e', fontWeight: 'bold' }}>Available Tables</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
                {tables.map(table => {
                  const isMatch = guests <= table.capacity; // Table must fit guests
                  const isSelectable = table.available && isMatch;
                  
                  return (
                    <div 
                      key={table.id}
                      onClick={() => isSelectable && setSelectedTable(table.id)}
                      style={{ 
                        padding: '15px 10px', textAlign: 'center', borderRadius: '10px', cursor: isSelectable ? 'pointer' : 'not-allowed',
                        background: selectedTable === table.id ? '#78350f' : isSelectable ? 'white' : '#f1f5f9',
                        color: selectedTable === table.id ? 'white' : isSelectable ? '#451a03' : '#94a3b8',
                        border: selectedTable === table.id ? '2px solid #78350f' : isSelectable ? '2px solid #fcd34d' : '2px solid #cbd5e1',
                        opacity: isSelectable ? 1 : 0.6
                      }}
                    >
                      <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{table.id}</div>
                      <div style={{ fontSize: '0.8rem', marginTop: '5px' }}>Up to {table.capacity} pax</div>
                      {table.available ? (
                        <div style={{ width: '8px', height: '8px', background: '#22c55e', borderRadius: '50%', margin: '8px auto 0' }}></div>
                      ) : (
                        <div style={{ width: '8px', height: '8px', background: '#ef4444', borderRadius: '50%', margin: '8px auto 0' }}></div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <button 
              onClick={handleReserve}
              disabled={!selectedTable}
              style={{ 
                width: '100%', padding: '15px', background: selectedTable ? '#d97706' : '#cbd5e1', 
                color: 'white', border: 'none', borderRadius: '10px', fontSize: '1.2rem', fontWeight: 'bold', 
                cursor: selectedTable ? 'pointer' : 'not-allowed', transition: 'all 0.2s',
                boxShadow: selectedTable ? '0 4px 6px -1px rgba(217, 119, 6, 0.5)' : 'none'
              }}
            >
              Reserve Table {selectedTable}
            </button>

          </div>
        </div>

      </div>
    </div>
  );
};

export default CafeDetail;
