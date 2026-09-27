import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const BarberDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [biz, setBiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Services');

  // Booking Form State
  const [selectedService, setSelectedService] = useState('Haircut');
  const [selectedBarber, setSelectedBarber] = useState('Ahmed');
  const [selectedDate, setSelectedDate] = useState('May 21, 2024');
  const [selectedTime, setSelectedTime] = useState('10:00 AM');

  const TABS = ['Overview', 'Services', 'Barbers', 'Reviews', 'Gallery'];

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/businesses/${id}`);
        setBiz(res.data);
      } catch (err) {
        console.error('Failed to fetch business details', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBusiness();
  }, [id]);

  if (loading) return <div style={{ textAlign: 'center', padding: '5rem' }}>Loading barber details...</div>;
  if (!biz) return <div style={{ textAlign: 'center', padding: '5rem' }}>Barber not found.</div>;

  return (
    <div style={{ background: '#f4f7fb', minHeight: '100vh', fontFamily: "'Inter', sans-serif", padding: '2rem' }}>
      
      {/* Top Header */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '15px' }}>
        <div style={{ fontSize: '2rem' }}>✂️</div>
        <h1 style={{ fontSize: '1.2rem', color: '#0f172a', margin: 0, fontWeight: '800', letterSpacing: '0.5px' }}>BOOKING - BARBER</h1>
      </div>

      {/* Main Container Card */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', background: 'white', borderRadius: '20px', padding: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        
        {/* Business Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
          <div>
            <h2 style={{ fontSize: '1.8rem', margin: '0 0 10px 0', color: '#0f172a' }}>{biz.name || 'Elite Barber Shop'}</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: '#64748b' }}>
              <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>⭐ {biz.rating || '4.8'}</span>
              <span>({biz.reviews?.length || 88} reviews)</span>
              <span>•</span>
              <span style={{ color: '#059669', fontWeight: 'bold' }}>Open Now</span>
              <span>•</span>
              <span>📍 {biz.distance || '0.8 km'} - {biz.location || biz.address || 'Bole Road, Addis Ababa'}</span>
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
              <div style={{ flex: 1, height: '150px', background: `url(${biz.gallery?.[0] || 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-4.0.3&w=400&q=80'}) center/cover`, borderRadius: '12px' }}></div>
              <div style={{ flex: 1, height: '150px', background: `url(${biz.gallery?.[1] || 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?ixlib=rb-4.0.3&w=400&q=80'}) center/cover`, borderRadius: '12px' }}></div>
              <div style={{ flex: 1, height: '150px', background: `url(${biz.gallery?.[2] || 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?ixlib=rb-4.0.3&w=400&q=80'}) center/cover`, borderRadius: '12px' }}></div>
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
            {activeTab === 'Services' && (
              <div>
                <h3 style={{ fontSize: '1.2rem', color: '#0f172a', marginBottom: '1.5rem', fontWeight: 'bold' }}>Our Services</h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  {/* Service Card 1 */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '15px' }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'url(https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=100) center/cover' }}></div>
                      <div>
                        <div style={{ fontWeight: 'bold', color: '#0f172a', fontSize: '0.95rem' }}>Haircut</div>
                        <div style={{ color: '#64748b', fontSize: '0.85rem' }}>30 min</div>
                      </div>
                    </div>
                    <div style={{ fontWeight: 'bold', color: '#0f172a' }}>200 ETB</div>
                  </div>
                  {/* Service Card 2 */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '15px' }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'url(https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=100) center/cover' }}></div>
                      <div>
                        <div style={{ fontWeight: 'bold', color: '#0f172a', fontSize: '0.95rem' }}>Beard Trim</div>
                        <div style={{ color: '#64748b', fontSize: '0.85rem' }}>15 min</div>
                      </div>
                    </div>
                    <div style={{ fontWeight: 'bold', color: '#0f172a' }}>100 ETB</div>
                  </div>
                  {/* Service Card 3 */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '15px' }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'url(https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=100) center/cover' }}></div>
                      <div>
                        <div style={{ fontWeight: 'bold', color: '#0f172a', fontSize: '0.95rem' }}>Haircut & Beard</div>
                        <div style={{ color: '#64748b', fontSize: '0.85rem' }}>45 min</div>
                      </div>
                    </div>
                    <div style={{ fontWeight: 'bold', color: '#0f172a' }}>280 ETB</div>
                  </div>
                  {/* Service Card 4 */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '15px' }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'url(https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=100) center/cover' }}></div>
                      <div>
                        <div style={{ fontWeight: 'bold', color: '#0f172a', fontSize: '0.95rem' }}>Kids Haircut</div>
                        <div style={{ color: '#64748b', fontSize: '0.85rem' }}>20 min</div>
                      </div>
                    </div>
                    <div style={{ fontWeight: 'bold', color: '#0f172a' }}>150 ETB</div>
                  </div>
                </div>
              </div>
            )}
            {activeTab !== 'Services' && <div style={{ color: '#64748b' }}>{activeTab} content...</div>}
          </div>

          {/* Right Column (Widget) */}
          <div style={{ flex: '1 1 350px' }}>
            <div style={{ background: '#f8fafc', borderRadius: '15px', padding: '2rem', border: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#0f172a', marginBottom: '1.5rem', fontWeight: 'bold' }}>Book Appointment</h3>
              
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.9rem', color: '#475569', marginBottom: '5px', fontWeight: '500' }}>Select Service</label>
                <div style={{ position: 'relative' }}>
                  <select value={selectedService} onChange={e => setSelectedService(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', background: 'white', outline: 'none', appearance: 'none', fontWeight: '500', color: '#0f172a' }}>
                    <option>Haircut</option>
                    <option>Beard Trim</option>
                    <option>Haircut & Beard</option>
                  </select>
                  <div style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#64748b', fontSize: '0.8rem' }}>▼</div>
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.9rem', color: '#475569', marginBottom: '5px', fontWeight: '500' }}>Select Barber</label>
                <div style={{ position: 'relative' }}>
                  <select value={selectedBarber} onChange={e => setSelectedBarber(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', background: 'white', outline: 'none', appearance: 'none', fontWeight: '500', color: '#0f172a' }}>
                    <option>Ahmed</option>
                    <option>Elias</option>
                  </select>
                  <div style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#64748b', fontSize: '0.8rem' }}>▼</div>
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.9rem', color: '#475569', marginBottom: '5px', fontWeight: '500' }}>Select Date</label>
                <input type="text" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', background: 'white', outline: 'none', fontWeight: '500', color: '#0f172a' }} />
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', fontSize: '0.9rem', color: '#475569', marginBottom: '5px', fontWeight: '500' }}>Select Time</label>
                <div style={{ position: 'relative' }}>
                  <select value={selectedTime} onChange={e => setSelectedTime(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', background: 'white', outline: 'none', appearance: 'none', fontWeight: '500', color: '#0f172a' }}>
                    <option>10:00 AM</option>
                    <option>11:00 AM</option>
                  </select>
                  <div style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#64748b', fontSize: '0.8rem' }}>▼</div>
                </div>
              </div>

              <button style={{ width: '100%', padding: '14px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', marginBottom: '1.5rem', boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.4)' }}>
                Continue
              </button>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '5px' }}>
                <span style={{ color: '#475569' }}>Open Hours</span>
                <span style={{ color: '#0f172a', fontWeight: '500' }}></span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#64748b', marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
                <span>Mon - Sun</span>
                <span>9:00 AM - 9:00 PM</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginTop: '10px' }}>
                <span style={{ color: '#475569' }}>Contact</span>
                <span style={{ color: '#0f172a', fontWeight: '500' }}>+251 91 234 5678</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default BarberDetail;
