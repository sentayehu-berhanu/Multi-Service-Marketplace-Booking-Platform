import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const CATEGORY_ICONS = {
  'Barber': '💈',
  "Women's Salon": '💇‍♀️',
  'Cosmetics': '💄',
  'Parking': '🅿️',
  'Pharmacy': '💊',
  'Café': '☕',
  'Restaurant': '🍽️',
  'Spa': '💆',
  'Car Wash': '🚗',
  'Gym': '🏋️',
  'Cleaning': '🧹',
  'Home Repair': '🔧',
  'Hotel': '🏨',
  'Healthcare': '🩺',
  'Tutors': '🎓',
  'Transportation': '🚕',
  'Local Delivery': '📦',
  'Events/Tickets': '🎟️'
};

const CategoryPage = () => {
  const { categoryName } = useParams();
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCategoryBusinesses = async () => {
      try {
        setLoading(true);
        // Ensure you match the query parameter properly, could be URL encoded
        const res = await axios.get(`http://localhost:5000/api/businesses?category=${encodeURIComponent(categoryName)}`);
        setBusinesses(res.data);
      } catch (err) {
        console.error('Failed to fetch businesses:', err);
        setError('Failed to load businesses for this category.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryBusinesses();
  }, [categoryName]);

  const icon = CATEGORY_ICONS[categoryName] || '🏷️';

  return (
    <div className="container" style={{ padding: '2rem 24px' }}>
      
      {/* Category Hero */}
      <section style={{ textAlign: 'center', padding: '3rem 0 4rem 0' }}>
        <div style={{ 
          fontSize: '4rem', 
          width: '100px', 
          height: '100px', 
          margin: '0 auto 1.5rem', 
          background: 'var(--bg-card)', 
          borderRadius: '50%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          border: '1px solid rgba(255,255,255,0.05)'
        }}>
          {icon}
        </div>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>
          All <span className="gradient-text">{categoryName}</span> Services
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>
          Discover and book the best {categoryName.toLowerCase()} professionals near you.
        </p>
      </section>

      {/* Business Grid */}
      <section style={{ paddingBottom: '4rem' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
            Loading {categoryName.toLowerCase()}s...
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--danger)' }}>
            {error}
          </div>
        ) : businesses.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', background: 'var(--bg-card)', borderRadius: '20px', border: 'var(--glass-border)' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>No {categoryName}s found</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
              We are expanding quickly. Check back soon for new services in your area!
            </p>
            <Link to="/" className="btn-secondary">Explore other categories</Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
            {businesses.map(biz => (
              <Link to={`/business/${biz.id}`} key={biz.id} className="hover-scale">
                <div className="glass-panel" style={{ overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ 
                    height: '220px', 
                    background: biz.cover_image ? `url(${biz.cover_image}) center/cover no-repeat` : 'var(--bg-secondary)',
                    borderBottom: '1px solid rgba(255,255,255,0.05)'
                  }}>
                    {!biz.cover_image && (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', opacity: 0.2 }}>
                        {icon}
                      </div>
                    )}
                  </div>
                  <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <h3 style={{ fontSize: '1.4rem', margin: 0 }}>{biz.name}</h3>
                      <span style={{ background: 'rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: '8px', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>
                        ⭐ {biz.rating || 'New'}
                      </span>
                    </div>
                    
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem', flex: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {biz.description || 'No description provided.'}
                    </p>
                    
                    <div style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', marginTop: 'auto' }}>
                      <span>📍</span> {biz.address || 'Address not available'}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default CategoryPage;
