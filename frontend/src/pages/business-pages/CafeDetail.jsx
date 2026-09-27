import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CafeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);

  // Reservation State
  const [selectedDate, setSelectedDate] = useState('May 21, 2024');
  const [selectedTime, setSelectedTime] = useState('7:00 PM');
  const [guests, setGuests] = useState(2);
  const [selectedTable, setSelectedTable] = useState('T3');
  const [area, setArea] = useState('Indoor');
  const [activeTab, setActiveTab] = useState('Tables');
  
  const TABS = ['Overview', 'Tables', 'Menu', 'Reviews', 'Gallery'];

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
    <div style={{ background: '#f4f7fb', minHeight: '100vh', fontFamily: "'Inter', sans-serif", padding: '2rem' }}>
      
      {/* Top Header */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '15px' }}>
        <div style={{ fontSize: '2rem', color: '#ea580c' }}>☕</div>
        <h1 style={{ fontSize: '1.2rem', color: '#0f172a', margin: 0, fontWeight: '800', letterSpacing: '0.5px' }}>RESERVATION - CAFÉ</h1>
      </div>

      {/* Main Container Card */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', background: 'white', borderRadius: '20px', padding: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        
        {/* Business Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
          <div>
            <h2 style={{ fontSize: '1.8rem', margin: '0 0 10px 0', color: '#0f172a' }}>{business.name}</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: '#64748b' }}>
              <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>⭐ {business.rating || '4.7'}</span>
              <span>({business.reviewCount || 85} reviews)</span>
              <span>•</span>
              <span style={{ color: '#059669', fontWeight: 'bold' }}>Open Now</span>
              <span>•</span>
              <span>📍 {business.distance || '1.3 km'} - {business.location || business.address || 'Kazanchis, Addis Ababa'}</span>
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
              <div style={{ flex: 1, height: '150px', background: `url(${business.gallery[0]}) center/cover`, borderRadius: '12px' }}></div>
              <div style={{ flex: 1, height: '150px', background: `url(${business.gallery[1] || 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=400'}) center/cover`, borderRadius: '12px' }}></div>
              <div style={{ flex: 1, height: '150px', background: `url(${business.gallery[2] || 'https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=400'}) center/cover`, borderRadius: '12px' }}></div>
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
                    color: activeTab === tab ? '#ea580c' : '#64748b',
                    borderBottom: activeTab === tab ? '3px solid #ea580c' : '3px solid transparent',
                    marginBottom: '-1px'
                  }}
                >{tab}</button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'Tables' && (
              <div>
                <h3 style={{ fontSize: '1.2rem', color: '#0f172a', marginBottom: '1.5rem', fontWeight: 'bold' }}>Select Table</h3>
                
                {/* Area Tabs */}
                <div style={{ display: 'flex', gap: '10px', marginBottom: '1.5rem' }}>
                  <button onClick={() => setArea('Indoor')} style={{ padding: '8px 24px', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer', border: area === 'Indoor' ? '1px solid #e2e8f0' : 'none', background: area === 'Indoor' ? 'white' : '#f8fafc', color: area === 'Indoor' ? '#0f172a' : '#64748b', boxShadow: area === 'Indoor' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none' }}>Indoor</button>
                  <button onClick={() => setArea('Outdoor')} style={{ padding: '8px 24px', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer', border: area === 'Outdoor' ? '1px solid #e2e8f0' : 'none', background: area === 'Outdoor' ? 'white' : '#f8fafc', color: area === 'Outdoor' ? '#0f172a' : '#64748b', boxShadow: area === 'Outdoor' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none' }}>Outdoor</button>
                </div>

                {/* Tables Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '15px', background: '#f8fafc', padding: '1.5rem', borderRadius: '15px', marginBottom: '2rem', border: '1px solid #e2e8f0' }}>
                  {['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10'].map(t => (
                    <button 
                      key={t}
                      onClick={() => setSelectedTable(t)}
                      style={{
                        padding: '15px 0', borderRadius: '8px', border: selectedTable === t ? '2px solid #ea580c' : '1px solid #e2e8f0', fontWeight: 'bold', cursor: 'pointer',
                        background: selectedTable === t ? '#fff7ed' : 'white',
                        color: selectedTable === t ? '#ea580c' : '#0f172a',
                        transition: '0.2s'
                      }}
                    >{t}</button>
                  ))}
                </div>
              </div>
            )}
            {activeTab !== 'Tables' && <div style={{ color: '#64748b' }}>{activeTab} content...</div>}
          </div>

          {/* Right Column (Widget) */}
          <div style={{ flex: '1 1 350px' }}>
            <div style={{ background: '#f8fafc', borderRadius: '15px', padding: '2rem', border: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#0f172a', marginBottom: '1.5rem', fontWeight: 'bold' }}>Reservation Details</h3>
              
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.9rem', color: '#475569', marginBottom: '5px', fontWeight: '500' }}>Date</label>
                <input type="text" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', background: 'white', outline: 'none', fontWeight: '500', color: '#0f172a' }} />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.9rem', color: '#475569', marginBottom: '5px', fontWeight: '500' }}>Time</label>
                <div style={{ position: 'relative' }}>
                  <select value={selectedTime} onChange={e => setSelectedTime(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', background: 'white', outline: 'none', appearance: 'none', fontWeight: '500', color: '#0f172a' }}>
                    <option>7:00 PM</option>
                    <option>7:30 PM</option>
                    <option>8:00 PM</option>
                  </select>
                  <div style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#64748b', fontSize: '0.8rem' }}>▼</div>
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.9rem', color: '#475569', marginBottom: '5px', fontWeight: '500' }}>People</label>
                <div style={{ position: 'relative' }}>
                  <select value={guests} onChange={e => setGuests(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', background: 'white', outline: 'none', appearance: 'none', fontWeight: '500', color: '#0f172a' }}>
                    <option value="1">1 Person</option>
                    <option value="2">2 People</option>
                    <option value="3">3 People</option>
                    <option value="4">4 People</option>
                  </select>
                  <div style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#64748b', fontSize: '0.8rem' }}>▼</div>
                </div>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', fontSize: '0.9rem', color: '#475569', marginBottom: '5px', fontWeight: '500' }}>Selected Table</label>
                <div style={{ padding: '12px', background: 'white', border: '1px solid #cbd5e1', borderRadius: '8px', fontWeight: 'bold', color: selectedTable ? '#0f172a' : '#94a3b8' }}>
                  {selectedTable || 'None selected'}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingTop: '10px', borderTop: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '1.1rem', color: '#475569', fontWeight: '500' }}>Total</span>
                <span style={{ fontSize: '1.3rem', color: '#0f172a', fontWeight: 'bold' }}>0 ETB</span>
              </div>

              <button onClick={handleReserve} style={{ width: '100%', padding: '14px', background: '#ea580c', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', marginBottom: '1.5rem', boxShadow: '0 4px 6px -1px rgba(234, 88, 12, 0.4)' }}>
                Reserve Table
              </button>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginTop: '10px' }}>
                <span style={{ color: '#475569' }}>Contact</span>
                <span style={{ color: '#0f172a', fontWeight: '500' }}>+251 91 654 3210</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CafeDetail;
