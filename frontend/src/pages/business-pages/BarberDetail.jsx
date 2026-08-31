import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const BarberDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [biz, setBiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Services');

  const TABS = ['About', 'Services', 'Barbers', 'Reviews', 'Gallery', 'Location'];

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
    <div>
      {/* Cover Image & Basic Info */}
      <div style={{ height: '400px', background: biz.cover_image ? `url(${biz.cover_image}) center/cover no-repeat` : 'url(https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80) center/cover no-repeat', position: 'relative' }}>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '250px', background: 'linear-gradient(to top, var(--bg-color), transparent)' }} />
      </div>

      <div className="container" style={{ marginTop: '-120px', position: 'relative', zIndex: 10, padding: '0 24px' }}>
        <Link to="/shop/barber" style={{ color: 'var(--text-secondary)', display: 'inline-block', marginBottom: '1rem', textDecoration: 'none' }}>← Back to Barbers</Link>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '3.5rem', margin: '0 0 0.5rem 0' }}>{biz.name}</h1>
            <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-secondary)', alignItems: 'center', fontSize: '1.1rem' }}>
              <span style={{ color: 'var(--warning)', fontWeight: 'bold' }}>⭐ {biz.rating || '4.9'} ({biz.reviews?.length || 128} reviews)</span>
              <span>📍 {biz.address || 'Addis Ababa'}</span>
              <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>🟢 Open Now</span>
            </div>
          </div>
          <button 
            className="btn-primary hover-scale" 
            style={{ padding: '15px 40px', fontSize: '1.2rem', fontWeight: 'bold', borderRadius: '30px' }}
            onClick={() => navigate(`/book/${biz.id}`)}
          >
            BOOK NOW
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '3rem', overflowX: 'auto', scrollbarWidth: 'none' }}>
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: 'none',
                border: 'none',
                color: activeTab === tab ? 'var(--primary)' : 'var(--text-secondary)',
                padding: '1rem 0',
                fontSize: '1.1rem',
                fontWeight: activeTab === tab ? 'bold' : 'normal',
                borderBottom: activeTab === tab ? '3px solid var(--primary)' : '3px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap'
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div style={{ paddingBottom: '5rem', minHeight: '400px' }}>
          
          {activeTab === 'Services' && (
            <div style={{ maxWidth: '800px' }}>
              <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Services</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {(biz.services && biz.services.length > 0) ? biz.services.filter(s => s.status !== 'ARCHIVED').map(service => (
                  <div key={service.id} className="glass-panel" style={{ padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: '15px' }}>
                    <div>
                      <h3 style={{ fontSize: '1.3rem', margin: '0 0 5px 0' }}>{service.name}</h3>
                      <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9rem' }}>⏱ {service.duration} mins • {service.description || 'Premium grooming service.'}</p>
                    </div>
                    <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: 'var(--accent-primary)' }}>
                      {service.price} ETB
                    </div>
                  </div>
                )) : (
                  <>
                    <div className="glass-panel" style={{ padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: '15px' }}>
                      <div>
                        <h3 style={{ fontSize: '1.3rem', margin: '0 0 5px 0' }}>Haircut</h3>
                        <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9rem' }}>⏱ 30 mins • Classic men's haircut with styling</p>
                      </div>
                      <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: 'var(--accent-primary)' }}>200 ETB</div>
                    </div>
                    <div className="glass-panel" style={{ padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: '15px' }}>
                      <div>
                        <h3 style={{ fontSize: '1.3rem', margin: '0 0 5px 0' }}>Beard Trim</h3>
                        <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9rem' }}>⏱ 15 mins • Precision beard shaping and trim</p>
                      </div>
                      <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: 'var(--accent-primary)' }}>100 ETB</div>
                    </div>
                    <div className="glass-panel" style={{ padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: '15px' }}>
                      <div>
                        <h3 style={{ fontSize: '1.3rem', margin: '0 0 5px 0' }}>Haircut + Beard</h3>
                        <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9rem' }}>⏱ 45 mins • Full grooming package</p>
                      </div>
                      <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: 'var(--accent-primary)' }}>280 ETB</div>
                    </div>
                    <div className="glass-panel" style={{ padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: '15px' }}>
                      <div>
                        <h3 style={{ fontSize: '1.3rem', margin: '0 0 5px 0' }}>Kids Haircut</h3>
                        <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9rem' }}>⏱ 30 mins • Gentle and stylish cut for kids</p>
                      </div>
                      <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: 'var(--accent-primary)' }}>150 ETB</div>
                    </div>
                  </>
                )}
              </div>
              <div style={{ marginTop: '3rem', textAlign: 'center' }}>
                <button 
                  className="btn-primary hover-scale" 
                  style={{ padding: '15px 40px', fontSize: '1.2rem', fontWeight: 'bold', borderRadius: '30px' }}
                  onClick={() => navigate(`/book/${biz.id}`)}
                >
                  BOOK AN APPOINTMENT
                </button>
              </div>
            </div>
          )}

          {activeTab === 'About' && (
            <div style={{ maxWidth: '800px' }}>
              <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>About {biz.name}</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: '1.8' }}>
                {biz.description || 'Welcome to our premium barber shop. We pride ourselves on providing the best grooming experience in the city. Our highly trained and experienced barbers use top-quality tools and products to ensure you look your absolute best.'}
              </p>
            </div>
          )}

          {/* Placeholders for other tabs to show it's functional */}
          {['Barbers', 'Reviews', 'Gallery', 'Location'].includes(activeTab) && (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)', background: 'var(--bg-card)', borderRadius: '20px', border: 'var(--glass-border)' }}>
              <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>🏗️</span>
              <h3>{activeTab} section coming soon!</h3>
              <p>We are currently updating our {activeTab.toLowerCase()} information.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default BarberDetail;
