import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiMapPin, FiStar, FiClock, FiCheck, FiUsers, FiActivity } from 'react-icons/fi';

const GymDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Membership');

  const [gym, setGym] = useState(null);
  const [loading, setLoading] = useState(true);

  // Booking Form State
  const [selectedPlan, setSelectedPlan] = useState('Standard Plan');
  const [selectedDate, setSelectedDate] = useState('May 21, 2024');
  const [paymentMethod, setPaymentMethod] = useState('Wallet (3,450 ETB)');

  const TABS = ['Overview', 'Membership', 'Trainers', 'Reviews', 'Gallery'];

  useEffect(() => {
    const fetchGym = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/businesses/${id}`);
        setGym(res.data);
        
        const mems = [];
        const cls = [];
        const trn = [];
        
        if (res.data.services) {
          res.data.services.forEach(s => {
            let category = 'Unknown';
            let actualDesc = s.description || '';
            
            if (actualDesc.includes('|')) {
              const parts = actualDesc.split('|');
              category = parts[0];
              actualDesc = parts[1];
            }

            const name = s.name.toLowerCase();
            const mapped = {
              id: s.id,
              name: s.name,
              price: s.price,
              duration: actualDesc || 'Standard',
              description: actualDesc || ''
            };

            // Categorize based on explicit category OR fallback to keywords
            if (category === 'Membership' || name.includes('plan') || name.includes('membership') || name.includes('access')) {
              mems.push({ ...mapped, features: ['Access to gym floor', 'Locker room access'] });
            } else if (category === 'Trainer' || name.includes('pt') || name.includes('trainer') || name.includes('session') || name.includes('coach')) {
              trn.push({ ...mapped, specialty: mapped.duration, rating: 4.8 });
            } else {
              cls.push({ ...mapped, time: mapped.duration, trainer: 'Staff', level: 'All Levels' });
            }
          });
        }
        
        setMemberships(mems);
        setClasses(cls);
        setTrainers(trn);
      } catch (err) {
        console.error('Failed to fetch gym:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGym();
  }, [id]);

  const handleChoosePlan = (plan) => {
    navigate('/checkout/gym', { state: { plan, gymId: id, type: 'membership' } });
  };

  const handleBookClass = (cls) => {
    navigate('/checkout/gym', { state: { 
      plan: { 
        name: cls.name, 
        duration: '1 Class', 
        price: cls.price, 
        features: [`Time: ${cls.time}`, `Level: ${cls.level}`] 
      }, 
      gymId: id, 
      type: 'class' 
    }});
  };

  const handleBookTrainer = (trainer) => {
    navigate('/checkout/gym', { state: { 
      plan: { 
        name: trainer.name, 
        duration: '1 Session', 
        price: trainer.price, 
        features: [`Specialty: ${trainer.specialty}`] 
      }, 
      gymId: id, 
      type: 'trainer' 
    }});
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading Gym...</div>;
  if (!gym) return <div style={{ padding: '40px', textAlign: 'center' }}>Gym not found</div>;

  return (
    <div style={{ background: '#f4f7fb', minHeight: '100vh', fontFamily: "'Inter', sans-serif", padding: '2rem' }}>
      
      {/* Top Header */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '15px' }}>
        <div style={{ fontSize: '2rem', color: '#2563eb' }}>🏋🏽‍♂️</div>
        <h1 style={{ fontSize: '1.2rem', color: '#0f172a', margin: 0, fontWeight: '800', letterSpacing: '0.5px' }}>BOOKING - GYM</h1>
      </div>

      {/* Main Container Card */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', background: 'white', borderRadius: '20px', padding: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        
        {/* Business Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
          <div>
            <h2 style={{ fontSize: '1.8rem', margin: '0 0 10px 0', color: '#0f172a' }}>{gym.name || 'Power Gym'}</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: '#64748b' }}>
              <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>⭐ {gym.rating || '4.6'}</span>
              <span>({gym.reviews?.length || 93} reviews)</span>
              <span>•</span>
              <span style={{ color: '#059669', fontWeight: 'bold' }}>Open Now</span>
              <span>•</span>
              <span>📍 {gym.distance || '1.1 km'} - {gym.location || gym.address || 'Mexico, Addis Ababa'}</span>
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
              <div style={{ flex: 1, height: '150px', background: `url(${gym.gallery?.[0] || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&w=400&q=80'}) center/cover`, borderRadius: '12px' }}></div>
              <div style={{ flex: 1, height: '150px', background: `url(${gym.gallery?.[1] || 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?ixlib=rb-4.0.3&w=400&q=80'}) center/cover`, borderRadius: '12px' }}></div>
              <div style={{ flex: 1, height: '150px', background: `url(${gym.gallery?.[2] || 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-4.0.3&w=400&q=80'}) center/cover`, borderRadius: '12px' }}></div>
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
            {activeTab === 'Membership' && (
              <div>
                <h3 style={{ fontSize: '1.2rem', color: '#0f172a', marginBottom: '1.5rem', fontWeight: 'bold' }}>Membership Plans</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {/* Plan 1 */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '15px' }}>
                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                      <div style={{ width: '45px', height: '45px', borderRadius: '8px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', border: '1px solid #e2e8f0' }}>🎫</div>
                      <div>
                        <div style={{ fontWeight: 'bold', color: '#0f172a', fontSize: '1rem' }}>Basic Plan</div>
                        <div style={{ color: '#64748b', fontSize: '0.85rem' }}>1 Month</div>
                      </div>
                    </div>
                    <div style={{ fontWeight: 'bold', color: '#0f172a', fontSize: '1.1rem' }}>1,000 ETB</div>
                  </div>
                  {/* Plan 2 */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '15px' }}>
                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                      <div style={{ width: '45px', height: '45px', borderRadius: '8px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', border: '1px solid #e2e8f0' }}>🥈</div>
                      <div>
                        <div style={{ fontWeight: 'bold', color: '#0f172a', fontSize: '1rem' }}>Standard Plan</div>
                        <div style={{ color: '#64748b', fontSize: '0.85rem' }}>3 Months</div>
                      </div>
                    </div>
                    <div style={{ fontWeight: 'bold', color: '#0f172a', fontSize: '1.1rem' }}>2,500 ETB</div>
                  </div>
                  {/* Plan 3 */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '15px' }}>
                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                      <div style={{ width: '45px', height: '45px', borderRadius: '8px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', border: '1px solid #e2e8f0' }}>🥇</div>
                      <div>
                        <div style={{ fontWeight: 'bold', color: '#0f172a', fontSize: '1rem' }}>Premium Plan</div>
                        <div style={{ color: '#64748b', fontSize: '0.85rem' }}>6 Months</div>
                      </div>
                    </div>
                    <div style={{ fontWeight: 'bold', color: '#0f172a', fontSize: '1.1rem' }}>4,800 ETB</div>
                  </div>
                  {/* Plan 4 */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '15px' }}>
                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                      <div style={{ width: '45px', height: '45px', borderRadius: '8px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', border: '1px solid #e2e8f0' }}>👑</div>
                      <div>
                        <div style={{ fontWeight: 'bold', color: '#0f172a', fontSize: '1rem' }}>VIP Plan</div>
                        <div style={{ color: '#64748b', fontSize: '0.85rem' }}>12 Months</div>
                      </div>
                    </div>
                    <div style={{ fontWeight: 'bold', color: '#0f172a', fontSize: '1.1rem' }}>7,000 ETB</div>
                  </div>
                  {/* Plan 5 */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '15px' }}>
                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                      <div style={{ width: '45px', height: '45px', borderRadius: '8px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', border: '1px solid #e2e8f0' }}>💪</div>
                      <div>
                        <div style={{ fontWeight: 'bold', color: '#0f172a', fontSize: '1rem' }}>Personal Training</div>
                        <div style={{ color: '#64748b', fontSize: '0.85rem' }}>Per Session</div>
                      </div>
                    </div>
                    <div style={{ fontWeight: 'bold', color: '#0f172a', fontSize: '1.1rem' }}>500 ETB</div>
                  </div>
                  {/* Plan 6 */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '15px' }}>
                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                      <div style={{ width: '45px', height: '45px', borderRadius: '8px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', border: '1px solid #e2e8f0' }}>🧘‍♀️</div>
                      <div>
                        <div style={{ fontWeight: 'bold', color: '#0f172a', fontSize: '1rem' }}>Group Class</div>
                        <div style={{ color: '#64748b', fontSize: '0.85rem' }}>Per Session</div>
                      </div>
                    </div>
                    <div style={{ fontWeight: 'bold', color: '#0f172a', fontSize: '1.1rem' }}>200 ETB</div>
                  </div>
                </div>
              </div>
            )}
            {activeTab !== 'Membership' && <div style={{ color: '#64748b' }}>{activeTab} content...</div>}
          </div>

          {/* Right Column (Widget) */}
          <div style={{ flex: '1 1 350px' }}>
            <div style={{ background: '#f8fafc', borderRadius: '15px', padding: '2rem', border: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#0f172a', marginBottom: '1.5rem', fontWeight: 'bold' }}>Choose Plan</h3>
              
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.9rem', color: '#475569', marginBottom: '5px', fontWeight: '500' }}>Select Plan</label>
                <div style={{ position: 'relative' }}>
                  <select value={selectedPlan} onChange={e => setSelectedPlan(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', background: 'white', outline: 'none', appearance: 'none', fontWeight: '500', color: '#0f172a' }}>
                    <option>Basic Plan</option>
                    <option>Standard Plan</option>
                    <option>Premium Plan</option>
                    <option>VIP Plan</option>
                  </select>
                  <div style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#64748b', fontSize: '0.8rem' }}>▼</div>
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.9rem', color: '#475569', marginBottom: '5px', fontWeight: '500' }}>Select Date</label>
                <input type="text" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', background: 'white', outline: 'none', fontWeight: '500', color: '#0f172a' }} />
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', fontSize: '0.9rem', color: '#475569', marginBottom: '5px', fontWeight: '500' }}>Payment Method</label>
                <div style={{ position: 'relative' }}>
                  <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', background: 'white', outline: 'none', appearance: 'none', fontWeight: '500', color: '#0f172a' }}>
                    <option>Wallet (3,450 ETB)</option>
                    <option>Credit Card</option>
                    <option>Cash</option>
                  </select>
                  <div style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#64748b', fontSize: '0.8rem' }}>▼</div>
                </div>
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
                <span>6:00 AM - 10:00 PM</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginTop: '10px' }}>
                <span style={{ color: '#475569' }}>Contact</span>
                <span style={{ color: '#0f172a', fontWeight: '500' }}>+251 91 111 2233</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default GymDetail;
