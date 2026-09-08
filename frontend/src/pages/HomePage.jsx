import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const CATEGORIES = [
  // Phase 1 — Core
  { id: 1, name: 'Barber', icon: '💈' },
  { id: 2, name: "Women's Salon", icon: '💇‍♀️' },
  { id: 3, name: 'Cosmetics', icon: '💄' },
  { id: 4, name: 'Parking', icon: '🅿️' },
  { id: 5, name: 'Pharmacy', icon: '💊' },
  { id: 6, name: 'Café', icon: '☕' },
  { id: 7, name: 'Restaurant', icon: '🍽️' },
  
  // Phase 2 — Expand
  { id: 8, name: 'Spa', icon: '💆' },
  { id: 9, name: 'Car Wash', icon: '🚗' },
  { id: 10, name: 'Gym', icon: '🏋️' },
  { id: 11, name: 'Cleaning', icon: '🧹' },
  { id: 12, name: 'Home Repair', icon: '🔧' },
  { id: 13, name: 'Hotel', icon: '🏨' },
  
  // Phase 3 — Advanced
  { id: 14, name: 'Healthcare', icon: '🩺' },
  { id: 15, name: 'Tutors', icon: '🎓' },
  { id: 16, name: 'Transportation', icon: '🚕' },
  { id: 17, name: 'Local Delivery', icon: '📦' },
  { id: 18, name: 'Events/Tickets', icon: '🎟️' },
];

const MOCK_BUSINESSES = [
  { id: 1, name: 'Elite Barber', rating: 4.8, distance: '0.8 km', category: 'Barber', image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60' },
  { id: 2, name: 'Beauty Palace', rating: 4.7, distance: '1.2 km', category: 'Salon', image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60' },
  { id: 3, name: 'Coffee House', rating: 4.9, distance: '1.5 km', category: 'Café', image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60' },
];

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredBusinesses, setFilteredBusinesses] = useState(MOCK_BUSINESSES);
  const navigate = useNavigate();

  const handleSearch = () => {
    const query = searchQuery.toLowerCase();
    const results = MOCK_BUSINESSES.filter(biz => 
      biz.name.toLowerCase().includes(query) || 
      biz.category.toLowerCase().includes(query)
    );
    setFilteredBusinesses(results);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleCategoryClick = (categoryName) => {
    const specialRoutes = {
      'Cosmetics': '/shop/cosmetics',
      'Barber': '/shop/barber',
      'Parking': '/shop/parking',
      'Pharmacy': '/shop/pharmacy',
      'Hotel': '/shop/hotel',
      'Restaurant': '/shop/restaurant',
      'Car Wash': '/shop/auto',
      'Cleaning': '/shop/cleaning',
      'Home Repair': '/shop/repair',
      'Gym': '/shop/gym',
      'Healthcare': '/shop/healthcare',
      'Spa': '/shop/spa',
      'Tutors': '/shop/tutors'
    };

    if (specialRoutes[categoryName]) {
      navigate(specialRoutes[categoryName]);
    } else {
      navigate(`/category/${categoryName}`);
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 24px' }}>
      
      {/* Hero Section */}
      <section style={{ textAlign: 'center', padding: '4rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}>
          Find & Book <br />
          <span className="gradient-text">Local Services Instantly</span>
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '600px', marginBottom: '2rem' }}>
          Discover the best businesses around you, book appointments, reserve spaces, and pay seamlessly—all in one place.
        </p>
        
        {/* Search Bar */}
        <div className="glass-panel" style={{ display: 'flex', width: '100%', maxWidth: '600px', padding: '8px', borderRadius: '16px' }}>
          <input 
            type="text" 
            placeholder="Search for barbers, salons, parking..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{ flex: 1, background: 'transparent', border: 'none', color: 'white', padding: '12px 16px', fontSize: '1rem', outline: 'none' }}
          />
          <button className="btn-primary" style={{ borderRadius: '12px' }} onClick={handleSearch}>Search</button>
        </div>
      </section>

      {/* Categories */}
      <section style={{ padding: '3rem 0' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>Categories</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '1.2rem' }}>
          {CATEGORIES.map(cat => (
            <div 
              key={cat.id} 
              className="category-card" 
              onClick={() => handleCategoryClick(cat.name)}
            >
              <div className="category-icon">{cat.icon}</div>
              <span className="category-name">{cat.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Near You */}
      <section style={{ padding: '3rem 0' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>🔥 Popular Near You</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
          {filteredBusinesses.length > 0 ? (
            filteredBusinesses.map(biz => (
              <Link to={biz.category === 'Barber' ? `/business/barber/${biz.id}` : biz.category === 'Salon' ? `/business/salon/${biz.id}` : biz.category === 'Parking' ? `/business/parking/${biz.id}` : `/business/${biz.id}`} key={biz.id} className="hover-scale">
                <div className="glass-panel" style={{ overflow: 'hidden', height: '100%' }}>
                  <div style={{ height: '200px', background: `url(${biz.image}) center/cover no-repeat` }} />
                  <div style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>{biz.category}</span>
                      <span style={{ background: 'rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: '8px', fontSize: '0.9rem' }}>⭐ {biz.rating}</span>
                    </div>
                    <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>{biz.name}</h3>
                    <div style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <span>📍</span> {biz.distance}
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
              <h3>No services found matching "{searchQuery}"</h3>
              <p>Try searching for "barber" or "salon".</p>
            </div>
          )}
        </div>
      </section>

    </div>
  );
};

export default HomePage;
