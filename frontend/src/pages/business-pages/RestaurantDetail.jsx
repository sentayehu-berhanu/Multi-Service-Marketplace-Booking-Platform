import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const MOCK_RESTAURANTS = [
  { id: 401, name: 'The Great Ethiopian', rating: 4.8, address: 'Bole, Addis Ababa', cuisine: 'Ethiopian', price: '$$', cover_image: 'https://images.unsplash.com/photo-1596484552834-6a58f850d0a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { id: 402, name: 'Luigi\'s Italian', rating: 4.5, address: 'Kazanchis, Addis Ababa', cuisine: 'Italian', price: '$$$', cover_image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { id: 403, name: 'Spicy Indian Kitchen', rating: 4.2, address: 'Piassa, Addis Ababa', cuisine: 'Indian', price: '$$', cover_image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { id: 404, name: 'Burger Joint Fast Food', rating: 3.9, address: 'Bole, Addis Ababa', cuisine: 'Fast Food', price: '$', cover_image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { id: 405, name: 'Golden Dragon Chinese', rating: 4.6, address: 'Bole, Addis Ababa', cuisine: 'Chinese', price: '$$', cover_image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
];

const MOCK_MENU = [
  { id: 1, name: 'Doro Wat', price: 450, category: 'Main Course', description: 'Spicy chicken stew with injera and egg.', image: 'https://images.unsplash.com/photo-1596484552993-9c8e88f7b57b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', popular: true },
  { id: 2, name: 'Kitfo', price: 600, category: 'Main Course', description: 'Minced raw beef marinated in mitmita.', image: 'https://images.unsplash.com/photo-1628294895950-9805252327bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', popular: true },
  { id: 3, name: 'Shiro', price: 250, category: 'Main Course', description: 'Chickpea stew served hot.', image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', popular: false },
  { id: 4, name: 'Special Burger', price: 350, category: 'Fast Food', description: 'Double beef patty with cheese and fries.', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', popular: true },
  { id: 5, name: 'Margherita Pizza', price: 400, category: 'Italian', description: 'Classic tomato and cheese pizza.', image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', popular: true },
];

const MOCK_TABLES = [
  { id: 101, name: 'Table for 2', capacity: 2, location: 'Window Seat' },
  { id: 102, name: 'Family Booth', capacity: 6, location: 'Main Floor' },
  { id: 103, name: 'Patio Table', capacity: 4, location: 'Outdoor' },
];

const RestaurantDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [business, setBusiness] = useState(null);
  const [menu, setMenu] = useState([]);
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [activeTab, setActiveTab] = useState('Menu');

  // Order Cart state
  const [cart, setCart] = useState([]);
  
  // Table Reservation state
  const [selectedTable, setSelectedTable] = useState('T3');
  const [reserveDate, setReserveDate] = useState('May 21, 2024');
  const [reserveTime, setReserveTime] = useState('7:00 PM');
  const [guests, setGuests] = useState(2);
  const [area, setArea] = useState('Indoor');

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const numId = parseInt(id);
        if (numId >= 400) {
          // Mock data
          const found = MOCK_RESTAURANTS.find(r => r.id === numId) || MOCK_RESTAURANTS[0];
          setBusiness({
            ...found,
            gallery: [
              found.cover_image,
              'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
              'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            ]
          });
          setMenu(MOCK_MENU);
          setTables(MOCK_TABLES);
        } else {
          // DB Data
          const res = await axios.get('http://localhost:5000/api/businesses');
          const found = res.data.find(b => b.id === numId);
          if (found) {
            setBusiness({
              ...found,
              gallery: [
                found.cover_image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
              ]
            });
            
            // Try fetching products (Menu)
            try {
              const prodRes = await axios.get(`http://localhost:5000/api/products?businessId=${found.id}`);
              const roomKeywords = ['Room', 'room', 'Suite', 'suite', 'Penthouse', 'penthouse', 'Villa', 'villa'];
              setMenu(prodRes.data.filter(p => {
                if (p.status === 'ARCHIVED') return false;
                const isRoomCategory = p.category && roomKeywords.some(kw => p.category.includes(kw));
                const isRoomName = p.name && roomKeywords.some(kw => p.name.includes(kw));
                return !isRoomCategory && !isRoomName;
              }));
            } catch(e) { console.error("No products found"); }
            
            // For now, mock tables if not enough data
            setTables(MOCK_TABLES);
          }
        }
      } catch (err) {
        console.error("Failed to fetch restaurant", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurant();
  }, [id]);

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === itemId);
      if (existing.quantity > 1) {
        return prev.map(i => i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i);
      }
      return prev.filter(i => i.id !== itemId);
    });
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleOrderFood = () => {
    if (cart.length === 0) return alert('Your cart is empty!');
    navigate('/checkout/restaurant', {
      state: { business, cart, type: 'order' }
    });
  };

  const handleReserveTable = () => {
    if (!selectedTable) return alert('Please select a table to reserve.');
    if (!reserveDate || !reserveTime) return alert('Please select a date and time.');
    navigate('/checkout/restaurant', {
      state: { business, table: selectedTable, date: reserveDate, time: reserveTime, guests, type: 'reservation' }
    });
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '4rem' }}>Loading Restaurant...</div>;
  if (!business) return <div style={{ textAlign: 'center', padding: '4rem' }}>Restaurant not found</div>;

  return (
    <div style={{ background: '#f4f7fb', minHeight: '100vh', fontFamily: "'Inter', sans-serif", padding: '2rem' }}>
      
      {/* Top Header */}
      <div style={{ maxWidth: '1000px', margin: '0 auto', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '15px' }}>
        <div style={{ fontSize: '2rem' }}>☕</div>
        <h1 style={{ fontSize: '1.2rem', color: '#0f172a', margin: 0, fontWeight: '800', letterSpacing: '0.5px' }}>RESERVATION - RESTAURANT</h1>
      </div>

      {/* Main Container Card */}
      <div style={{ maxWidth: '1000px', margin: '0 auto', background: 'white', borderRadius: '20px', padding: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        
        {/* Business Header Card */}
        <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2.5rem', alignItems: 'flex-start' }}>
          <div style={{ 
            width: '200px', height: '120px', 
            background: `url(${business.gallery && business.gallery.length > 0 ? business.gallery[0] : 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}) center/cover no-repeat`,
            borderRadius: '15px'
          }}></div>
          
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: '1.8rem', margin: '0 0 10px 0', color: '#0f172a' }}>{business.name}</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: '#64748b', marginBottom: '8px' }}>
              <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>⭐ {business.rating || '4.7'}</span>
              <span>({business.reviewCount || 85} reviews)</span>
              <span>•</span>
              <span style={{ color: '#059669', fontWeight: 'bold' }}>Open Now</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: '#64748b' }}>
              <span>📍 {business.distance || '1.3 km'}</span>
              <span>•</span>
              <span>{business.location || business.address || 'Kazanchis, Addis Ababa'}</span>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '15px' }}>
            <button style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#64748b' }}>♡</button>
            <button style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#64748b' }}>📤</button>
          </div>
        </div>

        {/* Content Layout */}
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          
          {/* Left Column */}
          <div style={{ flex: '1 1 500px' }}>
            <h3 style={{ fontSize: '1.1rem', color: '#0f172a', marginBottom: '1rem', fontWeight: 'bold' }}>Select Table</h3>
            
            {/* Tabs */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '1.5rem' }}>
              <button 
                onClick={() => setArea('Indoor')}
                style={{ 
                  padding: '8px 24px', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer',
                  border: area === 'Indoor' ? '1px solid #e2e8f0' : 'none',
                  background: area === 'Indoor' ? 'white' : '#f8fafc',
                  color: area === 'Indoor' ? '#0f172a' : '#64748b',
                  boxShadow: area === 'Indoor' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none'
                }}
              >Indoor</button>
              <button 
                onClick={() => setArea('Outdoor')}
                style={{ 
                  padding: '8px 24px', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer',
                  border: area === 'Outdoor' ? '1px solid #e2e8f0' : 'none',
                  background: area === 'Outdoor' ? 'white' : '#f8fafc',
                  color: area === 'Outdoor' ? '#0f172a' : '#64748b',
                  boxShadow: area === 'Outdoor' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none'
                }}
              >Outdoor</button>
            </div>

            {/* Tables Grid */}
            <div style={{ 
              display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px', 
              background: '#f8fafc', padding: '1.5rem', borderRadius: '15px', marginBottom: '2rem' 
            }}>
              {['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10'].map(t => (
                <button 
                  key={t}
                  onClick={() => setSelectedTable(t)}
                  style={{
                    padding: '15px 0', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer',
                    background: selectedTable === t ? '#ea580c' : 'white',
                    color: selectedTable === t ? 'white' : '#0f172a',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                  }}
                >{t}</button>
              ))}
            </div>

            {/* People */}
            <h3 style={{ fontSize: '1.1rem', color: '#0f172a', marginBottom: '1rem', fontWeight: 'bold' }}>People</h3>
            <div style={{ position: 'relative' }}>
              <select 
                value={guests} 
                onChange={(e) => setGuests(e.target.value)}
                style={{ 
                  width: '100%', padding: '15px', borderRadius: '10px', border: '1px solid #e2e8f0', 
                  background: 'white', color: '#0f172a', fontSize: '1rem', outline: 'none', appearance: 'none',
                  fontWeight: '500'
                }}
              >
                <option value="1">1 Person</option>
                <option value="2">2 People</option>
                <option value="3">3 People</option>
                <option value="4">4 People</option>
                <option value="5">5 People</option>
                <option value="6">6+ People</option>
              </select>
              <div style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#64748b' }}>
                ▼
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div style={{ flex: '1 1 350px' }}>
            <div style={{ background: '#f8fafc', borderRadius: '15px', padding: '2rem' }}>
              <h3 style={{ fontSize: '1.1rem', color: '#0f172a', marginBottom: '1.5rem', fontWeight: 'bold' }}>Reservation Details</h3>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: '#475569', fontSize: '0.95rem' }}>
                <span>Date</span>
                <span style={{ color: '#0f172a', fontWeight: '600' }}>{reserveDate}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: '#475569', fontSize: '0.95rem' }}>
                <span>Time</span>
                <span style={{ color: '#0f172a', fontWeight: '600' }}>{reserveTime}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: '#475569', fontSize: '0.95rem' }}>
                <span>Table</span>
                <span style={{ color: '#0f172a', fontWeight: '600' }}>{selectedTable || '-'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', color: '#475569', fontSize: '0.95rem' }}>
                <span>Total</span>
                <span style={{ color: '#0f172a', fontWeight: 'bold' }}>0 ETB</span>
              </div>

              <button 
                onClick={handleReserveTable}
                style={{ 
                  width: '100%', padding: '12px', background: '#ea580c', color: 'white', 
                  border: 'none', borderRadius: '10px', fontSize: '1.1rem', fontWeight: 'bold', 
                  cursor: 'pointer', marginBottom: '1.5rem'
                }}
              >Reserve Table</button>

              <div style={{ background: 'white', padding: '1rem', borderRadius: '10px' }}>
                <div style={{ color: '#475569', fontSize: '0.85rem', marginBottom: '5px' }}>Contact</div>
                <div style={{ color: '#0f172a', fontWeight: '600', fontSize: '0.95rem' }}>+251 91 654 3210</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default RestaurantDetail;
