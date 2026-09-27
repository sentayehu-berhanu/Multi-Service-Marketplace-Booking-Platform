import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const PharmacyDetail = () => {
  const { id } = useParams();
  
  const [activeTab, setActiveTab] = useState('Products');
  const [activeCategory, setActiveCategory] = useState('Pain Relief');
  const [cart, setCart] = useState([]);
  
  const business = {
    name: 'City Pharmacy',
    rating: 4.8,
    reviews: 112,
    distance: '1.5 km',
    location: 'Bole, Addis Ababa',
    gallery: [
      'https://images.unsplash.com/photo-1585435557343-3b092031a831?ixlib=rb-4.0.3&w=400&q=80',
      'https://images.unsplash.com/photo-1576602976047-174e57a47881?ixlib=rb-4.0.3&w=400&q=80',
      'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?ixlib=rb-4.0.3&w=400&q=80'
    ]
  };

  const TABS = ['Overview', 'Products', 'Reviews', 'Gallery'];
  const CATEGORIES = ['Pain Relief', 'First Aid', 'Vitamins'];

  const handleAddToCart = (item) => {
    setCart([...cart, item]);
  };

  return (
    <div style={{ background: '#f4f7fb', minHeight: '100vh', fontFamily: "'Inter', sans-serif", padding: '2rem' }}>
      
      {/* Top Header */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '15px' }}>
        <div style={{ fontSize: '2rem', color: '#10b981' }}>💊</div>
        <h1 style={{ fontSize: '1.2rem', color: '#0f172a', margin: 0, fontWeight: '800', letterSpacing: '0.5px' }}>SHOPPING - PHARMACY</h1>
      </div>

      {/* Main Container Card */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', background: 'white', borderRadius: '20px', padding: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        
        {/* Business Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
          <div>
            <h2 style={{ fontSize: '1.8rem', margin: '0 0 10px 0', color: '#0f172a' }}>{business.name}</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: '#64748b' }}>
              <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>⭐ {business.rating}</span>
              <span>({business.reviews} reviews)</span>
              <span>•</span>
              <span style={{ color: '#059669', fontWeight: 'bold' }}>Open Now</span>
              <span>•</span>
              <span>📍 {business.distance} - {business.location}</span>
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
              <div style={{ flex: 1, height: '150px', background: `url(${business.gallery[1]}) center/cover`, borderRadius: '12px' }}></div>
              <div style={{ flex: 1, height: '150px', background: `url(${business.gallery[2]}) center/cover`, borderRadius: '12px' }}></div>
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
                    color: activeTab === tab ? '#10b981' : '#64748b',
                    borderBottom: activeTab === tab ? '3px solid #10b981' : '3px solid transparent',
                    marginBottom: '-1px'
                  }}
                >{tab}</button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'Products' && (
              <div style={{ display: 'flex', gap: '2rem' }}>
                
                {/* Categories Sidebar */}
                <div style={{ width: '150px', flexShrink: 0 }}>
                  <h4 style={{ margin: '0 0 1rem 0', color: '#0f172a' }}>Categories</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {CATEGORIES.map(cat => (
                      <button 
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        style={{ 
                          textAlign: 'left', background: activeCategory === cat ? '#ecfdf5' : 'transparent',
                          color: activeCategory === cat ? '#10b981' : '#64748b',
                          border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer',
                          fontWeight: activeCategory === cat ? 'bold' : 'normal'
                        }}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Product List */}
                <div style={{ flex: 1 }}>
                  {activeCategory === 'Pain Relief' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '15px' }}>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                          <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'url(https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=100) center/cover' }}></div>
                          <div>
                            <div style={{ fontWeight: 'bold', color: '#0f172a', fontSize: '0.95rem' }}>Paracetamol 500mg</div>
                            <div style={{ color: '#10b981', fontSize: '0.85rem' }}>In Stock</div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                          <div style={{ fontWeight: 'bold', color: '#0f172a' }}>50 ETB</div>
                          <button onClick={() => handleAddToCart({ name: 'Paracetamol 500mg', price: 50 })} style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#f1f5f9', border: 'none', color: '#10b981', fontWeight: 'bold', cursor: 'pointer' }}>+</button>
                        </div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '15px' }}>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                          <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'url(https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=100) center/cover' }}></div>
                          <div>
                            <div style={{ fontWeight: 'bold', color: '#0f172a', fontSize: '0.95rem' }}>Ibuprofen 400mg</div>
                            <div style={{ color: '#10b981', fontSize: '0.85rem' }}>In Stock</div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                          <div style={{ fontWeight: 'bold', color: '#0f172a' }}>80 ETB</div>
                          <button onClick={() => handleAddToCart({ name: 'Ibuprofen 400mg', price: 80 })} style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#f1f5f9', border: 'none', color: '#10b981', fontWeight: 'bold', cursor: 'pointer' }}>+</button>
                        </div>
                      </div>
                    </div>
                  )}
                  {activeCategory === 'First Aid' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '15px' }}>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                          <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'url(https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=100) center/cover' }}></div>
                          <div>
                            <div style={{ fontWeight: 'bold', color: '#0f172a', fontSize: '0.95rem' }}>Band-Aids (20 pack)</div>
                            <div style={{ color: '#10b981', fontSize: '0.85rem' }}>In Stock</div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                          <div style={{ fontWeight: 'bold', color: '#0f172a' }}>120 ETB</div>
                          <button onClick={() => handleAddToCart({ name: 'Band-Aids', price: 120 })} style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#f1f5f9', border: 'none', color: '#10b981', fontWeight: 'bold', cursor: 'pointer' }}>+</button>
                        </div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '15px' }}>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                          <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'url(https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=100) center/cover' }}></div>
                          <div>
                            <div style={{ fontWeight: 'bold', color: '#0f172a', fontSize: '0.95rem' }}>Antiseptic Cream</div>
                            <div style={{ color: '#10b981', fontSize: '0.85rem' }}>In Stock</div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                          <div style={{ fontWeight: 'bold', color: '#0f172a' }}>150 ETB</div>
                          <button onClick={() => handleAddToCart({ name: 'Antiseptic Cream', price: 150 })} style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#f1f5f9', border: 'none', color: '#10b981', fontWeight: 'bold', cursor: 'pointer' }}>+</button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            {activeTab !== 'Products' && <div style={{ color: '#64748b' }}>{activeTab} content...</div>}
          </div>

          {/* Right Column (Widget) */}
          <div style={{ flex: '1 1 350px' }}>
            <div style={{ background: '#f8fafc', borderRadius: '15px', padding: '2rem', border: '1px solid #e2e8f0' }}>
              
              <div style={{ border: '2px dashed #cbd5e1', padding: '1.5rem', textAlign: 'center', borderRadius: '12px', background: 'white', marginBottom: '2rem', cursor: 'pointer' }}>
                <div style={{ fontSize: '2rem', marginBottom: '10px' }}>📄</div>
                <div style={{ color: '#0f172a', fontWeight: 'bold', marginBottom: '5px' }}>Upload Prescription</div>
                <div style={{ color: '#64748b', fontSize: '0.85rem' }}>Required for some medicines</div>
              </div>

              <h3 style={{ fontSize: '1.2rem', color: '#0f172a', marginBottom: '1rem', fontWeight: 'bold', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>Your Cart</h3>
              
              {cart.length === 0 ? (
                <div style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Your cart is empty.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '1.5rem' }}>
                  {cart.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                      <span>1x {item.name}</span>
                      <span style={{ fontWeight: 'bold' }}>{item.price} ETB</span>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingTop: '10px', borderTop: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '1.1rem', color: '#475569', fontWeight: '500' }}>Total</span>
                <span style={{ fontSize: '1.3rem', color: '#10b981', fontWeight: 'bold' }}>{cart.reduce((sum, item) => sum + item.price, 0)} ETB</span>
              </div>

              <button style={{ width: '100%', padding: '14px', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', marginBottom: '1.5rem', boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.4)' }}>
                Checkout
              </button>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '5px' }}>
                <span style={{ color: '#475569' }}>Delivery Time</span>
                <span style={{ color: '#0f172a', fontWeight: '500' }}>Under 30 mins</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginTop: '10px' }}>
                <span style={{ color: '#475569' }}>Contact</span>
                <span style={{ color: '#0f172a', fontWeight: '500' }}>+251 91 555 4433</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PharmacyDetail;
