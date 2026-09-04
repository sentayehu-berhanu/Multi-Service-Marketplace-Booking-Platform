import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const BusinessPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Tab Navigation
  const [activeTab, setActiveTab] = useState('Services');

  // Booking details
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  // Cart logic instead of a simple selected array
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/businesses');
        const found = res.data.find(b => b.id === parseInt(id));
        if (found) {
          const gallery = [
            found.cover_image || 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1621605815971-fbc98d665033?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
          ];
          
          setBusiness({
            ...found,
            gallery: gallery,
            services: (found.services && found.services.length > 0) ? found.services : [
              { id: 991, name: 'Haircut', duration: 30, price: 200, description: 'Premium cut with a hot towel finish.' },
              { id: 992, name: 'Beard Trim', duration: 15, price: 100, description: 'Detailed trim and styling.' },
              { id: 993, name: 'Hair + Beard', duration: 45, price: 280, description: 'The complete grooming experience.' },
              { id: 994, name: 'Facial Treatment', duration: 60, price: 500, description: 'Deep cleansing and relaxing facial.' }
            ]
          });
        }
      } catch (err) {
        console.error("Failed to fetch business:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBusiness();
  }, [id]);

  const addToCart = (service) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === service.id);
      if (existing) {
        return prev.map(item => item.id === service.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...service, quantity: 1 }];
    });
  };

  const removeFromCart = (serviceId) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === serviceId);
      if (existing.quantity > 1) {
        return prev.map(item => item.id === serviceId ? { ...item, quantity: item.quantity - 1 } : item);
      }
      return prev.filter(item => item.id !== serviceId);
    });
  };

  const handleBooking = async () => {
    if (cart.length === 0) {
      alert('Please select at least one service to book.');
      return;
    }
    if (!selectedDate) {
      alert('Please select a date for your appointment.');
      return;
    }
    if (!selectedTime) {
      alert('Please select a time for your appointment.');
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You must be logged in to book an appointment.');
        navigate('/login');
        return;
      }

      const dateStr = `${selectedDate} ${selectedTime}`;
      const start_time = new Date(dateStr).toISOString();

      // For MVP, if multiple services are in cart, we book the first one. 
      // In a real advanced implementation, you'd send the full cart array to an order table.
      const payload = {
        business_id: business.id,
        service_id: cart[0].id,
        start_time: start_time
      };

      await axios.post('http://localhost:5000/api/bookings', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('Booking Confirmed!');
      navigate('/my-bookings');
    } catch (error) {
      console.error('Booking failed', error);
      alert('Failed to create booking: ' + (error.response?.data?.error || error.message));
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '4rem' }}>Loading Business...</div>;
  if (!business) return <div style={{ textAlign: 'center', padding: '4rem' }}>Business not found</div>;

  const totalDuration = cart.reduce((sum, item) => sum + (item.duration * item.quantity), 0);
  const totalPrice = cart.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);

  // We mock "Popular" as the first 3 services
  const popularServices = business.services.slice(0, 3);

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      
      {/* Header Info */}
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 24px 1rem 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <Link to="/" style={{ color: '#64748b', textDecoration: 'none', display: 'inline-block', marginBottom: '1rem', fontSize: '0.9rem', fontWeight: 'bold' }}>← BACK TO SEARCH</Link>
            <h1 style={{ fontSize: '2.5rem', margin: '0 0 10px 0', color: '#0f172a' }}>{business.name}</h1>
            <div style={{ color: '#64748b', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '15px' }}>
              <span>📍 {business.address || business.location || 'Addis Ababa'}</span>
              <span style={{ color: '#2563eb', fontWeight: 'bold' }}>⭐ {business.rating || '4.8'}</span>
              <span>({business.review_count || 124} reviews)</span>
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
        
        {/* Left: Tab Content */}
        <div style={{ flex: '1 1 700px' }}>
          
          {/* Navigation Tabs */}
          <div style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid #e2e8f0', marginBottom: '2rem' }}>
            {['Services', 'Reviews', 'About'].map(tab => (
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

          {activeTab === 'Services' && (
            <div>
              {/* Popular Right Now */}
              <h3 style={{ fontSize: '1.5rem', color: '#0f172a', marginBottom: '1rem' }}>Popular Right Now</h3>
              <div style={{ display: 'flex', gap: '15px', overflowX: 'auto', paddingBottom: '15px', marginBottom: '2rem' }}>
                {popularServices.map(service => (
                  <div key={`pop-${service.id}`} style={{ width: '220px', flexShrink: 0, background: 'white', borderRadius: '15px', overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                    <div style={{ height: '140px', background: `url(${service.image || 'https://images.unsplash.com/photo-1593062096033-9a26b09da705?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'}) center/cover no-repeat` }}></div>
                    <div style={{ padding: '1rem' }}>
                      <h4 style={{ margin: '0 0 5px 0', fontSize: '1.1rem', color: '#0f172a' }}>{service.name}</h4>
                      <p style={{ margin: '0 0 10px 0', color: '#64748b', fontSize: '0.85rem' }}>⏱️ {service.duration} mins</p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 'bold', color: '#2563eb' }}>{service.price} ETB</span>
                        <button onClick={() => addToCart(service)} style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer', fontWeight: 'bold' }}>+</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Full Services List */}
              <h3 style={{ fontSize: '1.5rem', color: '#0f172a', marginBottom: '1rem' }}>Full Services</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {business.services.map(service => (
                  <div key={service.id} style={{ display: 'flex', background: 'white', borderRadius: '15px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                    <div style={{ padding: '1.5rem', flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                        <h4 style={{ margin: 0, fontSize: '1.2rem', color: '#0f172a' }}>{service.name}</h4>
                        <span style={{ fontWeight: 'bold', color: '#2563eb' }}>{service.price} ETB</span>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#475569', fontSize: '0.9rem', marginBottom: '10px' }}>
                        <span>⏱️</span> {service.duration} mins
                      </div>

                      <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '0 0 15px 0', lineHeight: '1.5' }}>
                        {service.description || 'A comprehensive service tailored to your needs.'}
                      </p>
                      
                      <button 
                        onClick={() => addToCart(service)}
                        style={{ padding: '8px 15px', background: '#f8fafc', color: '#0f172a', border: '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                      >
                        Add to Order
                      </button>
                    </div>
                    {service.image && (
                      <div style={{ width: '150px', background: `url(${service.image}) center/cover no-repeat` }}></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'Reviews' && <div style={{ color: '#64748b', padding: '1rem 0' }}>User reviews will be displayed here...</div>}
          
          {activeTab === 'About' && (
            <div style={{ padding: '1rem 0' }}>
              <h3 style={{ fontSize: '1.5rem', color: '#0f172a', marginBottom: '1rem' }}>About {business.name}</h3>
              <p style={{ color: '#475569', fontSize: '1.1rem', lineHeight: '1.6' }}>
                {business.description || 'Premium services providing the best experiences in the city. Our professional staff ensures you leave looking and feeling your absolute best.'}
              </p>
            </div>
          )}

        </div>

        {/* Right: Booking Cart Widget */}
        <div style={{ flex: '1 1 350px' }}>
          <div style={{ background: 'white', padding: '2rem', borderRadius: '15px', border: '1px solid #e2e8f0', position: 'sticky', top: '2rem', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.05)' }}>
            <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.2rem', color: '#0f172a', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
              Your Appointment
            </h3>
            
            {/* Cart Items */}
            {cart.length === 0 ? (
              <div style={{ color: '#94a3b8', textAlign: 'center', padding: '1rem 0', marginBottom: '1rem' }}>
                No services selected yet.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '1.5rem', maxHeight: '250px', overflowY: 'auto' }}>
                {cart.map(item => (
                  <div key={`cart-${item.id}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ color: '#0f172a', fontSize: '0.95rem', fontWeight: 'bold' }}>{item.name}</div>
                      <div style={{ color: '#64748b', fontSize: '0.85rem' }}>{item.price} ETB • {item.duration}m</div>
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

            {/* Cart Summary */}
            <div style={{ marginBottom: '1.5rem', borderTop: cart.length > 0 ? '1px solid #e2e8f0' : 'none', paddingTop: cart.length > 0 ? '1rem' : '0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.9rem', color: '#64748b' }}>
                <span>Total Duration</span>
                <span style={{ fontWeight: 'bold', color: '#0f172a' }}>{totalDuration} mins</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', fontSize: '1.1rem' }}>
                <span style={{ color: '#0f172a', fontWeight: 'bold' }}>Total Price</span>
                <span style={{ fontWeight: 'bold', color: '#2563eb' }}>{totalPrice.toLocaleString()} ETB</span>
              </div>
            </div>

            {/* Date and Time Selection */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', color: '#475569', marginBottom: '8px', fontWeight: 'bold', fontSize: '0.9rem' }}>Select Date</label>
              <input 
                type="date" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                style={{ width: '100%', boxSizing: 'border-box', background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', color: '#0f172a', outline: 'none', fontFamily: 'inherit' }} 
              />
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', color: '#475569', marginBottom: '8px', fontWeight: 'bold', fontSize: '0.9rem' }}>Select Time</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {['09:00 AM', '10:00 AM', '11:30 AM', '01:00 PM'].map(time => (
                  <button 
                    key={time}
                    style={{ 
                      padding: '10px', 
                      background: selectedTime === time ? '#2563eb' : '#f8fafc',
                      color: selectedTime === time ? 'white' : '#475569',
                      border: selectedTime === time ? '1px solid #2563eb' : '1px solid #cbd5e1',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      transition: '0.2s'
                    }}
                    onClick={() => setSelectedTime(time)}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={handleBooking}
              style={{ width: '100%', padding: '15px', background: '#0f172a', color: 'white', border: 'none', borderRadius: '10px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', opacity: cart.length === 0 ? 0.7 : 1 }}
            >
              Continue to Book
            </button>
            <p style={{ textAlign: 'center', color: '#64748b', marginTop: '1rem', fontSize: '0.9rem' }}>
              You won't be charged yet
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default BusinessPage;
