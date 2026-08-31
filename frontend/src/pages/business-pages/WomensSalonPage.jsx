import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CATEGORIES = ['Hair', 'Makeup', 'Nails', 'Hair Color', 'Facial', 'Waxing', 'Beauty Packages'];

const EXPERTS = [
  { id: 1, name: 'Sarah', role: 'Hair Stylist', avatar: '👩🏼' },
  { id: 2, name: 'Mimi', role: 'Makeup Artist', avatar: '👩🏽' },
  { id: 3, name: 'Hana', role: 'Nail Tech', avatar: '👩🏾' }
];

const WomensSalonPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [biz, setBiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('Hair');
  const [selectedExpert, setSelectedExpert] = useState(null);

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

  if (loading) return <div style={{ textAlign: 'center', padding: '5rem', color: '#f472b6' }}>Loading salon details...</div>;
  
  // Use mock data if API fails or for the requested specific look
  const displayBiz = biz || {
    id: id || 2,
    name: 'Glow Beauty Salon',
    rating: 4.8,
    address: '1.2 km',
    cover_image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1522337660859-02fbefca4702?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
      'https://images.unsplash.com/photo-1596704017254-9b121068fb31?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
      'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
    ]
  };

  const POPULAR_SERVICES = [
    { id: 1, name: 'Hair Styling', price: '500' },
    { id: 2, name: 'Hair Coloring', price: '800' },
    { id: 3, name: 'Makeup', price: '600' },
    { id: 4, name: 'Manicure', price: '300' },
    { id: 5, name: 'Pedicure', price: '350' }
  ];

  return (
    <div style={{ background: '#faf5f7', minHeight: '100vh', color: '#333', fontFamily: "'Playfair Display', serif" }}>
      {/* Soft Header */}
      <div style={{ height: '450px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ 
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, 
          background: `url(${displayBiz.cover_image}) center/cover no-repeat`,
          filter: 'brightness(0.8)'
        }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '300px', background: 'linear-gradient(to top, #faf5f7, transparent)' }} />
        
        <div className="container" style={{ position: 'absolute', bottom: '40px', left: '0', right: '0', padding: '0 24px' }}>
          <h1 style={{ fontSize: '4rem', margin: '0 0 10px 0', color: '#1a1a1a', textShadow: '2px 2px 4px rgba(255,255,255,0.5)' }}>
            {displayBiz.name}
          </h1>
          <div style={{ display: 'flex', gap: '2rem', color: '#4a4a4a', alignItems: 'center', fontSize: '1.2rem', fontWeight: 'bold' }}>
            <span style={{ color: '#d97706' }}>⭐ {displayBiz.rating}</span>
            <span>📍 {displayBiz.address}</span>
            <span style={{ color: '#059669', background: '#d1fae5', padding: '4px 12px', borderRadius: '20px', fontSize: '1rem' }}>🟢 Open</span>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '2rem 24px 5rem 24px' }}>
        
        {/* Large Gallery */}
        <div style={{ marginBottom: '4rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '15px', height: '300px' }}>
            <div style={{ background: `url(${displayBiz.images ? displayBiz.images[0] : 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?ixlib=rb-4.0.3'}) center/cover`, borderRadius: '15px 0 0 15px' }} />
            <div style={{ background: `url(${displayBiz.images ? displayBiz.images[1] : 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?ixlib=rb-4.0.3'}) center/cover` }} />
            <div style={{ background: `url(${displayBiz.images ? displayBiz.images[2] : 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?ixlib=rb-4.0.3'}) center/cover`, borderRadius: '0 15px 15px 0' }} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '4rem' }}>
          
          {/* Left Column: Categories and Services */}
          <div style={{ flex: '1 1 65%' }}>
            
            {/* Category Tabs */}
            <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '1.5rem', marginBottom: '2rem', borderBottom: '1px solid #e5e7eb', scrollbarWidth: 'none' }}>
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    background: activeCategory === cat ? '#f472b6' : 'transparent',
                    border: 'none',
                    color: activeCategory === cat ? 'white' : '#6b7280',
                    padding: '8px 20px',
                    borderRadius: '25px',
                    fontSize: '1.1rem',
                    fontWeight: activeCategory === cat ? 'bold' : 'normal',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem', color: '#1f2937' }}>Popular Services</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              {POPULAR_SERVICES.map(service => (
                <div key={service.id} style={{ 
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                  padding: '1.5rem 2rem', background: 'white', borderRadius: '15px', 
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                }}>
                  <h3 style={{ margin: 0, fontSize: '1.4rem', color: '#374151' }}>{service.name}</h3>
                  <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#db2777' }}>
                    {service.price} ETB
                  </div>
                </div>
              ))}
            </div>
            
          </div>

          {/* Right Column: Experts & Booking */}
          <div style={{ flex: '1 1 35%' }}>
            <div style={{ background: 'white', padding: '2.5rem', borderRadius: '20px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', position: 'sticky', top: '100px' }}>
              
              <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', textAlign: 'center', color: '#1f2937' }}>Choose Expert</h2>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3rem' }}>
                {EXPERTS.map(expert => (
                  <div 
                    key={expert.id} 
                    onClick={() => setSelectedExpert(expert)}
                    style={{ 
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px',
                      cursor: 'pointer', opacity: selectedExpert?.id === expert.id ? 1 : 0.6,
                      transform: selectedExpert?.id === expert.id ? 'scale(1.1)' : 'scale(1)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <div style={{ 
                      width: '80px', height: '80px', borderRadius: '50%', background: '#fce7f3', 
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem',
                      border: selectedExpert?.id === expert.id ? '3px solid #f472b6' : '3px solid transparent'
                    }}>
                      {expert.avatar}
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#1f2937' }}>{expert.name}</div>
                      <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>{expert.role}</div>
                    </div>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => navigate(`/book/${displayBiz.id}`)}
                style={{ 
                  width: '100%', padding: '18px', background: '#db2777', color: 'white', 
                  border: 'none', borderRadius: '30px', fontSize: '1.2rem', fontWeight: 'bold',
                  cursor: 'pointer', boxShadow: '0 4px 14px 0 rgba(219, 39, 119, 0.39)',
                  transition: 'background 0.3s'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = '#be185d'}
                onMouseOut={(e) => e.currentTarget.style.background = '#db2777'}
              >
                BOOK APPOINTMENT
              </button>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default WomensSalonPage;
