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
  const [selectedTable, setSelectedTable] = useState(null);
  const [reserveDate, setReserveDate] = useState('');
  const [reserveTime, setReserveTime] = useState('');
  const [guests, setGuests] = useState(2);

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
    <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      
      {/* Header Info */}
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 24px 1rem 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <Link to="/shop/restaurant" style={{ color: '#64748b', textDecoration: 'none', display: 'inline-block', marginBottom: '1rem', fontSize: '0.9rem', fontWeight: 'bold' }}>← BACK TO SEARCH</Link>
            <h1 style={{ fontSize: '2.5rem', margin: '0 0 10px 0', color: '#0f172a' }}>{business.name}</h1>
            <div style={{ color: '#64748b', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '15px' }}>
              <span>📍 {business.address || business.location || 'Addis Ababa'}</span>
              <span style={{ color: '#2563eb', fontWeight: 'bold' }}>⭐ {business.rating || '4.8'}</span>
              <span>🍽️ {business.cuisine || 'Ethiopian'}</span>
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
        
        {/* Left Content Area */}
        <div style={{ flex: '1 1 700px' }}>
          
          {/* Navigation Tabs */}
          <div style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid #e2e8f0', marginBottom: '2rem' }}>
            {['Menu', 'Tables', 'Reviews', 'About'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{ 
                  background: 'none', border: 'none', padding: '10px 0', 
                  fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer',
                  color: activeTab === tab ? '#2563eb' : '#64748b',
                  borderBottom: activeTab === tab ? '3px solid #2563eb' : '3px solid transparent',
                  marginBottom: '-1px'
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === 'Menu' && (
            <div>
              {/* Popular Items */}
              <h3 style={{ fontSize: '1.5rem', color: '#0f172a', marginBottom: '1rem' }}>Popular Right Now</h3>
              <div style={{ display: 'flex', gap: '15px', overflowX: 'auto', paddingBottom: '15px', marginBottom: '2rem' }}>
                {menu.filter(m => m.popular).map(item => (
                  <div key={`pop-${item.id}`} style={{ width: '220px', flexShrink: 0, background: 'white', borderRadius: '15px', overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                    <div style={{ height: '140px', background: `url(${item.image ? (item.image.startsWith('/uploads') ? 'http://localhost:5000' + item.image : item.image) : 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'}) center/cover no-repeat` }}></div>
                    <div style={{ padding: '1rem' }}>
                      <h4 style={{ margin: '0 0 5px 0', fontSize: '1.1rem', color: '#0f172a' }}>{item.name}</h4>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                        <span style={{ fontWeight: 'bold', color: '#2563eb' }}>{item.price} ETB</span>
                        <button onClick={() => addToCart(item)} style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer', fontWeight: 'bold' }}>+</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Full Menu */}
              <h3 style={{ fontSize: '1.5rem', color: '#0f172a', marginBottom: '1rem' }}>Full Menu</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {menu.map(item => (
                  <div key={item.id} style={{ display: 'flex', background: 'white', borderRadius: '15px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                    <div style={{ padding: '1.5rem', flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                        <h4 style={{ margin: 0, fontSize: '1.2rem', color: '#0f172a' }}>{item.name}</h4>
                        <span style={{ fontWeight: 'bold', color: '#2563eb' }}>{item.price} ETB</span>
                      </div>
                      <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '0 0 15px 0', lineHeight: '1.5' }}>
                        {item.description || 'Delicious freshly prepared meal.'}
                      </p>
                      <button 
                        onClick={() => addToCart(item)}
                        style={{ padding: '8px 15px', background: '#f8fafc', color: '#0f172a', border: '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                      >
                        Add to Order
                      </button>
                    </div>
                    {item.image && (
                      <div style={{ width: '150px', background: `url(${item.image.startsWith('/uploads') ? 'http://localhost:5000' + item.image : item.image}) center/cover no-repeat` }}></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'Tables' && (
            <div>
              <h3 style={{ fontSize: '1.5rem', color: '#0f172a', marginBottom: '1rem' }}>Select a Table</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
                {tables.map(table => (
                  <div 
                    key={table.id}
                    onClick={() => setSelectedTable(table)}
                    style={{ 
                      background: selectedTable?.id === table.id ? '#eff6ff' : 'white', 
                      borderRadius: '15px', padding: '1.5rem', border: selectedTable?.id === table.id ? '2px solid #2563eb' : '1px solid #e2e8f0',
                      cursor: 'pointer', textAlign: 'center', transition: '0.2s',
                      boxShadow: selectedTable?.id === table.id ? '0 10px 15px -3px rgba(37,99,235,0.1)' : 'none'
                    }}
                  >
                    <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🪑</div>
                    <h4 style={{ margin: '0 0 5px 0', color: '#0f172a' }}>{table.name}</h4>
                    <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>Capacity: {table.capacity}</p>
                    <p style={{ margin: '5px 0 0 0', color: '#64748b', fontSize: '0.9rem' }}>{table.location}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'Reviews' && <div style={{ color: '#64748b' }}>Reviews coming soon...</div>}
          {activeTab === 'About' && <div style={{ color: '#64748b' }}>{business.description || 'Welcome to our restaurant! We pride ourselves on excellent food and service.'}</div>}

        </div>

        {/* Right Sidebar - Booking/Order Widget */}
        <div style={{ flex: '1 1 350px' }}>
          <div style={{ background: 'white', padding: '2rem', borderRadius: '15px', border: '1px solid #e2e8f0', position: 'sticky', top: '2rem', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.05)' }}>
            
            {/* Table Reservation Section */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.2rem', color: '#0f172a', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
                Reserve a Table
              </h3>
              
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', color: '#475569', marginBottom: '5px', fontSize: '0.9rem' }}>Date</label>
                <input type="date" value={reserveDate} onChange={e => setReserveDate(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', boxSizing: 'border-box' }} />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginBottom: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', color: '#475569', marginBottom: '5px', fontSize: '0.9rem' }}>Time</label>
                  <input type="time" value={reserveTime} onChange={e => setReserveTime(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', color: '#475569', marginBottom: '5px', fontSize: '0.9rem' }}>Guests</label>
                  <input type="number" min="1" value={guests} onChange={e => setGuests(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', boxSizing: 'border-box' }} />
                </div>
              </div>

              <button 
                onClick={handleReserveTable}
                style={{ width: '100%', padding: '12px', background: '#0f172a', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                RESERVE TABLE {selectedTable && `(${selectedTable.name})`}
              </button>
            </div>

            {/* Food Order Section */}
            <div>
              <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.2rem', color: '#0f172a', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
                Your Order
              </h3>
              
              {cart.length === 0 ? (
                <div style={{ color: '#94a3b8', textAlign: 'center', padding: '1rem 0' }}>Cart is empty</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '1.5rem', maxHeight: '250px', overflowY: 'auto' }}>
                  {cart.map(item => (
                    <div key={`cart-${item.id}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ color: '#0f172a', fontSize: '0.95rem', fontWeight: 'bold' }}>{item.name}</div>
                        <div style={{ color: '#64748b', fontSize: '0.85rem' }}>{item.price} ETB</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <button onClick={() => removeFromCart(item.id)} style={{ background: '#f1f5f9', border: 'none', borderRadius: '4px', width: '25px', height: '25px', cursor: 'pointer' }}>-</button>
                        <span style={{ fontSize: '0.9rem' }}>{item.quantity}</span>
                        <button onClick={() => addToCart(item)} style={{ background: '#f1f5f9', border: 'none', borderRadius: '4px', width: '25px', height: '25px', cursor: 'pointer' }}>+</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
                <span style={{ color: '#475569', fontWeight: 'bold' }}>Total</span>
                <span style={{ color: '#2563eb', fontWeight: 'bold', fontSize: '1.2rem' }}>{cartTotal.toLocaleString()} ETB</span>
              </div>

              <button 
                onClick={handleOrderFood}
                disabled={cart.length === 0}
                style={{ width: '100%', padding: '12px', background: cart.length === 0 ? '#cbd5e1' : '#2563eb', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: cart.length === 0 ? 'not-allowed' : 'pointer' }}
              >
                ORDER FOOD
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default RestaurantDetail;
