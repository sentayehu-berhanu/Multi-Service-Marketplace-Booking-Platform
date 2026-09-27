import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const MOCK_SERVICES = [
  { id: 1, name: 'Basic Wash', price: 150, duration: 30, category: 'Car Wash', description: 'Exterior wash and tire shine.' },
  { id: 2, name: 'Premium Wash', price: 400, duration: 60, category: 'Car Wash', description: 'Exterior wash, interior vacuum, and wax.' },
  { id: 3, name: 'Full Detailing', price: 800, duration: 180, category: 'Detailing', description: 'Complete interior and exterior deep clean and polish.' },
  { id: 4, name: 'Interior Cleaning', price: 300, duration: 60, category: 'Car Wash', description: 'Deep vacuum, seat cleaning, and dashboard wipe down.' },
  { id: 5, name: 'Oil Change', price: 1200, duration: 45, category: 'Oil Change', description: 'Premium synthetic oil change and filter replacement.' },
];

const AutoServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [business, setBusiness] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [activeTab, setActiveTab] = useState('Services');

  // Booking Form State
  const [selectedService, setSelectedService] = useState('Premium Wash');
  const [selectedDate, setSelectedDate] = useState('May 21, 2024');
  const [selectedTime, setSelectedTime] = useState('10:30 AM');

  const TABS = ['Overview', 'Services', 'Reviews', 'Gallery'];

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const numId = parseInt(id);
        if (numId >= 500) {
          // Mock data
          setBusiness({
            id: numId,
            name: numId === 501 ? 'Shine Car Wash' : 'Auto Service Pro',
            rating: 4.8,
            address: 'Bole, Addis Ababa',
            category: 'Auto Services',
            gallery: [
              'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
              'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
              'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            ]
          });
          setServices(MOCK_SERVICES);
        } else {
          // DB Data
          const res = await axios.get('http://localhost:5000/api/businesses');
          const found = res.data.find(b => b.id === numId);
          if (found) {
            setBusiness({
              ...found,
              gallery: [
                found.cover_image || 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
              ]
            });
            
            // Try fetching services
            try {
              const servRes = await axios.get(`http://localhost:5000/api/businesses/${found.id}/services`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
              }).catch(() => null);
              
              if (servRes && servRes.data.length > 0) {
                setServices(servRes.data.filter(s => s.status !== 'ARCHIVED'));
              } else if (found.services && found.services.length > 0) {
                setServices(found.services);
              } else {
                setServices(MOCK_SERVICES);
              }
            } catch(e) { 
              setServices(MOCK_SERVICES);
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch business", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBusiness();
  }, [id]);

  const handleBookService = () => {
    if (!selectedService) return alert('Please select a service.');
    if (!vehicleModel || !licensePlate) return alert('Please enter your vehicle model and license plate.');
    if (!reserveDate || !reserveTime) return alert('Please select a date and time.');
    
    // Instead of creating a whole new checkout page, we'll route to the generic BusinessCheckoutFlow
    // or RestaurantCheckoutFlow (we can adapt BusinessCheckoutFlow)
    // Actually, BusinessCheckoutFlow doesn't support cart arrays easily if not built for it, 
    // but we have a single service selected here.
    navigate('/checkout', {
      state: { 
        business, 
        service: selectedService, 
        date: reserveDate, 
        time: reserveTime, 
        vehicleInfo: `${vehicleModel} (Plate: ${licensePlate})`,
        type: 'auto'
      }
    });
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '4rem' }}>Loading Services...</div>;
  if (!business) return <div style={{ textAlign: 'center', padding: '4rem' }}>Business not found</div>;

  return (
    <div style={{ background: '#f4f7fb', minHeight: '100vh', fontFamily: "'Inter', sans-serif", padding: '2rem' }}>
      
      {/* Top Header */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '15px' }}>
        <div style={{ fontSize: '2rem', color: '#2563eb' }}>🚙</div>
        <h1 style={{ fontSize: '1.2rem', color: '#0f172a', margin: 0, fontWeight: '800', letterSpacing: '0.5px' }}>BOOKING - CAR WASH</h1>
      </div>

      {/* Main Container Card */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', background: 'white', borderRadius: '20px', padding: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        
        {/* Business Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
          <div>
            <h2 style={{ fontSize: '1.8rem', margin: '0 0 10px 0', color: '#0f172a' }}>{business.name || 'Shine Car Wash'}</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: '#64748b' }}>
              <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>⭐ {business.rating || '4.8'}</span>
              <span>({business.reviews?.length || 120} reviews)</span>
              <span>•</span>
              <span style={{ color: '#059669', fontWeight: 'bold' }}>Open Now</span>
              <span>•</span>
              <span>📍 {business.distance || '2.0 km'} - {business.location || business.address || 'Mekanisa, Addis Ababa'}</span>
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
              <div style={{ flex: 1, height: '150px', background: `url(${business.gallery?.[0] || 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?ixlib=rb-4.0.3&w=400&q=80'}) center/cover`, borderRadius: '12px' }}></div>
              <div style={{ flex: 1, height: '150px', background: `url(${business.gallery?.[1] || 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?ixlib=rb-4.0.3&w=400&q=80'}) center/cover`, borderRadius: '12px' }}></div>
              <div style={{ flex: 1, height: '150px', background: `url(${business.gallery?.[2] || 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?ixlib=rb-4.0.3&w=400&q=80'}) center/cover`, borderRadius: '12px' }}></div>
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
                    color: activeTab === tab ? '#2563eb' : '#64748b',
                    borderBottom: activeTab === tab ? '3px solid #2563eb' : '3px solid transparent',
                    marginBottom: '-1px'
                  }}
                >{tab}</button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'Services' && (
              <div>
                <h3 style={{ fontSize: '1.2rem', color: '#0f172a', marginBottom: '1.5rem', fontWeight: 'bold' }}>Our Services</h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  {/* Service Card 1 */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '15px' }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'url(https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=100) center/cover' }}></div>
                      <div>
                        <div style={{ fontWeight: 'bold', color: '#0f172a', fontSize: '0.95rem' }}>Basic Wash</div>
                        <div style={{ color: '#64748b', fontSize: '0.85rem' }}>30 min</div>
                      </div>
                    </div>
                    <div style={{ fontWeight: 'bold', color: '#0f172a' }}>150 ETB</div>
                  </div>
                  {/* Service Card 2 */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '15px' }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'url(https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=100) center/cover' }}></div>
                      <div>
                        <div style={{ fontWeight: 'bold', color: '#0f172a', fontSize: '0.95rem' }}>Premium Wash</div>
                        <div style={{ color: '#64748b', fontSize: '0.85rem' }}>60 min</div>
                      </div>
                    </div>
                    <div style={{ fontWeight: 'bold', color: '#0f172a' }}>400 ETB</div>
                  </div>
                  {/* Service Card 3 */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '15px' }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'url(https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=100) center/cover' }}></div>
                      <div>
                        <div style={{ fontWeight: 'bold', color: '#0f172a', fontSize: '0.95rem' }}>Full Detailing</div>
                        <div style={{ color: '#64748b', fontSize: '0.85rem' }}>180 min</div>
                      </div>
                    </div>
                    <div style={{ fontWeight: 'bold', color: '#0f172a' }}>800 ETB</div>
                  </div>
                  {/* Service Card 4 */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '15px' }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'url(https://images.unsplash.com/photo-1518991278859-9976378eebc4?w=100) center/cover' }}></div>
                      <div>
                        <div style={{ fontWeight: 'bold', color: '#0f172a', fontSize: '0.95rem' }}>Interior Clean</div>
                        <div style={{ color: '#64748b', fontSize: '0.85rem' }}>60 min</div>
                      </div>
                    </div>
                    <div style={{ fontWeight: 'bold', color: '#0f172a' }}>300 ETB</div>
                  </div>
                  {/* Service Card 5 */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '15px' }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'url(https://images.unsplash.com/photo-1626620584768-45e05d0e7a16?w=100) center/cover' }}></div>
                      <div>
                        <div style={{ fontWeight: 'bold', color: '#0f172a', fontSize: '0.95rem' }}>Engine Wash</div>
                        <div style={{ color: '#64748b', fontSize: '0.85rem' }}>30 min</div>
                      </div>
                    </div>
                    <div style={{ fontWeight: 'bold', color: '#0f172a' }}>250 ETB</div>
                  </div>
                </div>
              </div>
            )}
            {activeTab !== 'Services' && <div style={{ color: '#64748b' }}>{activeTab} content...</div>}
          </div>

          {/* Right Column (Widget) */}
          <div style={{ flex: '1 1 350px' }}>
            <div style={{ background: '#f8fafc', borderRadius: '15px', padding: '2rem', border: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#0f172a', marginBottom: '1.5rem', fontWeight: 'bold' }}>Book Service</h3>
              
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.9rem', color: '#475569', marginBottom: '5px', fontWeight: '500' }}>Select Service</label>
                <div style={{ position: 'relative' }}>
                  <select value={selectedService} onChange={e => setSelectedService(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', background: 'white', outline: 'none', appearance: 'none', fontWeight: '500', color: '#0f172a' }}>
                    <option>Basic Wash</option>
                    <option>Premium Wash</option>
                    <option>Full Detailing</option>
                  </select>
                  <div style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#64748b', fontSize: '0.8rem' }}>▼</div>
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.9rem', color: '#475569', marginBottom: '5px', fontWeight: '500' }}>Select Date</label>
                <input type="text" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', background: 'white', outline: 'none', fontWeight: '500', color: '#0f172a' }} />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.9rem', color: '#475569', marginBottom: '5px', fontWeight: '500' }}>Select Time</label>
                <div style={{ position: 'relative' }}>
                  <select value={selectedTime} onChange={e => setSelectedTime(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', background: 'white', outline: 'none', appearance: 'none', fontWeight: '500', color: '#0f172a' }}>
                    <option>10:30 AM</option>
                    <option>11:30 AM</option>
                  </select>
                  <div style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#64748b', fontSize: '0.8rem' }}>▼</div>
                </div>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', fontSize: '0.9rem', color: '#475569', marginBottom: '10px', fontWeight: '500' }}>Add Extras</label>
                
                <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', marginBottom: '10px', background: 'white', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input type="checkbox" defaultChecked />
                    <span style={{ fontSize: '0.9rem', color: '#0f172a', fontWeight: '500' }}>Interior Cleaning</span>
                  </div>
                  <span style={{ fontSize: '0.9rem', color: '#475569' }}>+300 ETB</span>
                </label>
                
                <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', background: 'white', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input type="checkbox" />
                    <span style={{ fontSize: '0.9rem', color: '#0f172a', fontWeight: '500' }}>Engine Wash</span>
                  </div>
                  <span style={{ fontSize: '0.9rem', color: '#475569' }}>+250 ETB</span>
                </label>
              </div>

              <button style={{ width: '100%', padding: '14px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', marginBottom: '1.5rem', boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.4)' }}>
                Continue
              </button>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '5px' }}>
                <span style={{ color: '#475569' }}>Open Hours</span>
                <span style={{ color: '#0f172a', fontWeight: '500' }}></span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#64748b', marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
                <span>Mon - Sun</span>
                <span>7:00 AM - 8:00 PM</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginTop: '10px' }}>
                <span style={{ color: '#475569' }}>Contact</span>
                <span style={{ color: '#0f172a', fontWeight: '500' }}>+251 91 876 5432</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AutoServiceDetail;
