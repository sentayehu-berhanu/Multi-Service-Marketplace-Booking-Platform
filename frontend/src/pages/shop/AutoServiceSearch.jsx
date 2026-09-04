import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AutoServiceSearch = () => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Filters
  const [serviceTypeFilter, setServiceTypeFilter] = useState('');
  const [ratingFilter, setRatingFilter] = useState(0);

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/businesses');
        
        // Client-side filtering to avoid backend query param issues
        const autoBusinesses = res.data.filter(b => 
          b.category?.slug === 'car-wash' || 
          b.category?.name.includes('Auto') || 
          b.category?.name.includes('Car Wash')
        );
        
        setBusinesses(autoBusinesses.map(b => ({
          id: b.id,
          name: b.name,
          rating: b.rating || 4.5,
          location: b.address || b.location || 'Addis Ababa',
          serviceType: 'Car Wash', // Assuming fallback, can be adjusted based on tags
          image: b.cover_image || 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        })));
      } catch (err) {
        console.error("Failed to fetch auto businesses", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBusinesses();
  }, []);

  const filteredBusinesses = businesses.filter(b => {
    if (serviceTypeFilter && b.serviceType !== serviceTypeFilter) return false;
    if (b.rating < ratingFilter) return false;
    return true;
  });

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      
      {/* Header Banner */}
      <div style={{ background: '#0f172a', padding: '4rem 24px', color: 'white', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', margin: '0 0 1rem 0' }}>AUTO SERVICES</h1>
        <p style={{ fontSize: '1.2rem', color: '#94a3b8', maxWidth: '600px', margin: '0 auto' }}>
          Find trusted car washes, repair shops, and auto detailers near you.
        </p>
      </div>

      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 24px', display: 'flex', gap: '2rem' }}>
        
        {/* Left Sidebar - Filters */}
        <div style={{ width: '280px', flexShrink: 0 }}>
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '15px', border: '1px solid #e2e8f0', position: 'sticky', top: '2rem' }}>
            <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.2rem', color: '#0f172a' }}>Filters</h3>
            
            {/* Service Type Filter */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '1rem', color: '#475569', marginBottom: '10px' }}>Service Type</h4>
              <select 
                value={serviceTypeFilter} 
                onChange={(e) => setServiceTypeFilter(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
              >
                <option value="">All Services</option>
                <option value="Car Wash">Car Wash</option>
                <option value="Repair">Repair</option>
                <option value="Detailing">Detailing</option>
                <option value="Oil Change">Oil Change</option>
                <option value="Tire Service">Tire Service</option>
                <option value="Inspection">Inspection</option>
              </select>
            </div>

            {/* Rating Filter */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '1rem', color: '#475569', marginBottom: '10px' }}>Rating</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[4, 3, 2].map(r => (
                  <label key={r} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#475569', cursor: 'pointer' }}>
                    <input 
                      type="radio" 
                      name="rating" 
                      checked={ratingFilter === r}
                      onChange={() => setRatingFilter(r)}
                    />
                    ⭐ {r}+
                  </label>
                ))}
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#475569', cursor: 'pointer' }}>
                  <input 
                    type="radio" 
                    name="rating" 
                    checked={ratingFilter === 0}
                    onChange={() => setRatingFilter(0)}
                  />
                  Any Rating
                </label>
              </div>
            </div>
            
            <button 
              onClick={() => { setServiceTypeFilter(''); setRatingFilter(0); }}
              style={{ width: '100%', padding: '10px', background: 'transparent', color: '#2563eb', border: '1px solid #2563eb', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Right Side - Results */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2 style={{ margin: 0, color: '#0f172a' }}>{filteredBusinesses.length} Services found</h2>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem' }}>Loading Auto Services...</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
              {filteredBusinesses.map(r => (
                <div key={r.id} style={{ background: 'white', borderRadius: '15px', overflow: 'hidden', border: '1px solid #e2e8f0', transition: '0.2s', ':hover': { transform: 'translateY(-5px)', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' } }}>
                  <div style={{ height: '200px', background: `url(${r.image}) center/cover no-repeat` }}></div>
                  <div style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                      <h3 style={{ margin: 0, fontSize: '1.3rem', color: '#0f172a' }}>{r.name}</h3>
                      <div style={{ background: '#fef08a', color: '#854d0e', padding: '4px 8px', borderRadius: '6px', fontWeight: 'bold', fontSize: '0.9rem' }}>
                        ⭐ {r.rating}
                      </div>
                    </div>
                    
                    <div style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '15px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                      <span>📍 {r.location}</span>
                      <span>🚗 {r.serviceType}</span>
                    </div>

                    <button 
                      onClick={() => navigate(`/business/auto/${r.id}`)}
                      style={{ width: '100%', padding: '12px', background: '#0f172a', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s' }}
                      onMouseOver={(e) => e.target.style.background = '#1e293b'}
                      onMouseOut={(e) => e.target.style.background = '#0f172a'}
                    >
                      View Services
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {!loading && filteredBusinesses.length === 0 && (
            <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
              No services match your filters. Try clearing them.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default AutoServiceSearch;
