import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const RestaurantSearch = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Filters
  const [cuisineFilter, setCuisineFilter] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [ratingFilter, setRatingFilter] = useState(0);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/businesses?category=Restaurant');
        
        if (res.data.length === 0) {
          // Provide mock data if no restaurants are seeded yet
          setRestaurants([
            { id: 401, name: 'The Great Ethiopian', rating: 4.8, location: 'Bole, Addis Ababa', cuisine: 'Ethiopian', price: '$$', image: 'https://images.unsplash.com/photo-1596484552834-6a58f850d0a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
            { id: 402, name: 'Luigi\'s Italian', rating: 4.5, location: 'Kazanchis, Addis Ababa', cuisine: 'Italian', price: '$$$', image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
            { id: 403, name: 'Spicy Indian Kitchen', rating: 4.2, location: 'Piassa, Addis Ababa', cuisine: 'Indian', price: '$$', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
            { id: 404, name: 'Burger Joint Fast Food', rating: 3.9, location: 'Bole, Addis Ababa', cuisine: 'Fast Food', price: '$', image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
            { id: 405, name: 'Golden Dragon Chinese', rating: 4.6, location: 'Bole, Addis Ababa', cuisine: 'Chinese', price: '$$', image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
          ]);
        } else {
          setRestaurants(res.data.map(b => ({
            id: b.id,
            name: b.name,
            rating: b.rating || 4.5,
            location: b.address || b.location || 'Addis Ababa',
            cuisine: b.cuisine || 'Ethiopian', // Assuming custom field or fallback
            price: '$$', 
            image: b.cover_image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
          })));
        }
      } catch (err) {
        console.error("Failed to fetch restaurants", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  const filteredRestaurants = restaurants.filter(r => {
    if (cuisineFilter && r.cuisine !== cuisineFilter) return false;
    if (priceFilter && r.price !== priceFilter) return false;
    if (r.rating < ratingFilter) return false;
    return true;
  });

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      
      {/* Header Banner */}
      <div style={{ background: '#0f172a', padding: '4rem 24px', color: 'white', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', margin: '0 0 1rem 0' }}>RESTAURANTS</h1>
        <p style={{ fontSize: '1.2rem', color: '#94a3b8', maxWidth: '600px', margin: '0 auto' }}>
          Discover the best food and reserve tables at top-rated restaurants.
        </p>
      </div>

      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 24px', display: 'flex', gap: '2rem' }}>
        
        {/* Left Sidebar - Filters */}
        <div style={{ width: '280px', flexShrink: 0 }}>
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '15px', border: '1px solid #e2e8f0', position: 'sticky', top: '2rem' }}>
            <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.2rem', color: '#0f172a' }}>Filters</h3>
            
            {/* Cuisine Filter */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '1rem', color: '#475569', marginBottom: '10px' }}>Cuisine</h4>
              <select 
                value={cuisineFilter} 
                onChange={(e) => setCuisineFilter(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
              >
                <option value="">All Cuisines</option>
                <option value="Ethiopian">Ethiopian</option>
                <option value="Italian">Italian</option>
                <option value="Indian">Indian</option>
                <option value="Chinese">Chinese</option>
                <option value="Fast Food">Fast Food</option>
              </select>
            </div>

            {/* Price Filter */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '1rem', color: '#475569', marginBottom: '10px' }}>Price</h4>
              <div style={{ display: 'flex', gap: '10px' }}>
                {['$', '$$', '$$$'].map(p => (
                  <button 
                    key={p}
                    onClick={() => setPriceFilter(p === priceFilter ? '' : p)}
                    style={{ 
                      flex: 1, padding: '8px', 
                      background: priceFilter === p ? '#2563eb' : '#f1f5f9', 
                      color: priceFilter === p ? 'white' : '#475569', 
                      border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' 
                    }}
                  >
                    {p}
                  </button>
                ))}
              </div>
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
              onClick={() => { setCuisineFilter(''); setPriceFilter(''); setRatingFilter(0); }}
              style={{ width: '100%', padding: '10px', background: 'transparent', color: '#2563eb', border: '1px solid #2563eb', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Right Side - Results */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2 style={{ margin: 0, color: '#0f172a' }}>{filteredRestaurants.length} Restaurants found</h2>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem' }}>Loading Restaurants...</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
              {filteredRestaurants.map(r => (
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
                      <span>🍽️ {r.cuisine} • {r.price}</span>
                    </div>

                    <button 
                      onClick={() => navigate(`/business/restaurant/${r.id}`)}
                      style={{ width: '100%', padding: '12px', background: '#0f172a', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s' }}
                      onMouseOver={(e) => e.target.style.background = '#1e293b'}
                      onMouseOut={(e) => e.target.style.background = '#0f172a'}
                    >
                      View Restaurant
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {!loading && filteredRestaurants.length === 0 && (
            <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
              No restaurants match your filters. Try clearing them.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default RestaurantSearch;
