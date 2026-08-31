import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const CATEGORIES = ['All', 'Haircut', 'Beard', 'Styling', 'Kids', 'Color'];

const BarberShop = () => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const fetchBarbers = async () => {
    try {
      setLoading(true);
      let url = `http://localhost:5000/api/businesses?category=Barber`;
      if (search) url += `&search=${encodeURIComponent(search)}`;

      const res = await axios.get(url);
      setBusinesses(res.data);
    } catch (err) {
      console.error('Failed to fetch barbers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBarbers();
  }, []); // Fetch initially

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchBarbers();
  };

  return (
    <div className="container" style={{ padding: '2rem 24px', display: 'flex', gap: '2rem', flexDirection: 'column' }}>
      
      {/* Hero Section */}
      <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'linear-gradient(135deg, #1f2937, #111827)', borderRadius: '20px', border: 'var(--glass-border)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h1 style={{ fontSize: '4rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span>💈</span> FIND YOUR BARBER
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginBottom: '2rem', maxWidth: '600px' }}>
          Discover the top-rated barbers in your area for the perfect haircut and grooming experience.
        </p>

        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '1rem', width: '100%', maxWidth: '600px' }}>
          <input 
            type="text" 
            placeholder="Search barber, location..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="glass-panel"
            style={{ flex: 1, padding: '16px 24px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '15px', color: 'white', outline: 'none', fontSize: '1.1rem' }}
          />
          <button type="submit" className="btn-primary" style={{ padding: '0 2rem', borderRadius: '15px', fontSize: '1.1rem' }}>Search</button>
        </form>
      </div>

      {/* Categories */}
      <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', padding: '1rem 0', scrollbarWidth: 'none' }}>
        {CATEGORIES.map(cat => (
          <button 
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={selectedCategory === cat ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '10px 24px', borderRadius: '30px', whiteSpace: 'nowrap', fontWeight: 'bold' }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div>
        <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Popular Barber Shops</h2>

        {/* Product Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>Loading barbers...</div>
        ) : businesses.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', background: 'var(--bg-card)', borderRadius: '15px', border: 'var(--glass-border)' }}>
            <h3>No barbers found</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Try adjusting your search query.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
            {businesses.map(biz => (
              <div key={biz.id} className="glass-panel hover-scale" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>
                <div 
                  style={{ height: '220px', background: biz.cover_image ? `url(${biz.cover_image}) center/cover no-repeat` : 'url(https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80) center/cover no-repeat' }}
                />
                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <h3 style={{ fontSize: '1.4rem', margin: 0 }}>{biz.name}</h3>
                    <span style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '8px', fontSize: '0.9rem' }}>
                      ⭐ {biz.rating || '4.9'}
                    </span>
                  </div>
                  
                  <div style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                    <span>📍 {biz.address || '0.8 km'}</span>
                    <span>•</span>
                    <span style={{ color: 'var(--success)' }}>🟢 Open</span>
                  </div>
                  
                  <div style={{ marginTop: 'auto' }}>
                    <Link to={`/business/barber/${biz.id}`} className="btn-primary hover-scale" style={{ display: 'block', textAlign: 'center', textDecoration: 'none', padding: '12px' }}>
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default BarberShop;
