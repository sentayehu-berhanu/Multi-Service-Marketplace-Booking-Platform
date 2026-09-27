import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import MapWidget from '../components/MapWidget';

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

// Helper function to calculate distance in km using Haversine formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  const R = 6371; 
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  return R * c; // Distance in km
};

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [allBusinesses, setAllBusinesses] = useState([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState([]);
  
  const [userLocation, setUserLocation] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/businesses');
        setAllBusinesses(res.data);
        
        // Initial sorting (just the first 6 businesses to simulate "Popular" before location is known)
        setFilteredBusinesses(res.data.slice(0, 6));
      } catch (err) {
        console.error('Failed to fetch businesses:', err);
      }
    };
    fetchBusinesses();
  }, []);

  const handleSearch = () => {
    const query = searchQuery.toLowerCase();
    const results = allBusinesses.filter(biz => 
      biz.name.toLowerCase().includes(query) || 
      (biz.category && biz.category.name && biz.category.name.toLowerCase().includes(query))
    );
    setFilteredBusinesses(results);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleCategoryClick = (categoryName) => {
    const routeMap = {
      'Barber': '/shop/barber',
      'Cosmetics': '/shop/cosmetics',
      'Parking': '/shop/parking',
      'Pharmacy': '/shop/pharmacy',
      'Restaurant': '/shop/restaurant',
      'Spa': '/shop/spa',
      'Car Wash': '/shop/auto',
      'Gym': '/shop/gym',
      'Cleaning': '/shop/cleaning',
      'Home Repair': '/shop/repair',
      'Hotel': '/shop/hotel',
      'Healthcare': '/shop/healthcare',
      'Tutors': '/shop/tutors',
      'Transportation': '/shop/transportation',
      'Local Delivery': '/delivery',
      'Events/Tickets': '/events'
    };
    
    const route = routeMap[categoryName];
    if (route) {
      navigate(route);
    } else {
      navigate(`/category/${categoryName}`);
    }
  };

  const locateUser = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        setIsLocating(false);
        
        // Calculate distance for all businesses and sort
        const withDistances = allBusinesses.map(biz => {
          const dist = calculateDistance(latitude, longitude, biz.location_lat, biz.location_lng);
          return { ...biz, calculatedDistance: dist };
        });
        
        withDistances.sort((a, b) => {
          if (a.calculatedDistance === null) return 1;
          if (b.calculatedDistance === null) return -1;
          return a.calculatedDistance - b.calculatedDistance;
        });
        
        // Show top 6 closest
        setFilteredBusinesses(withDistances.slice(0, 6));
      },
      (error) => {
        setIsLocating(false);
        alert('Unable to retrieve your location. Please check browser permissions.');
        console.error(error);
      }
    );
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
        <div className="glass-panel" style={{ display: 'flex', width: '100%', maxWidth: '600px', padding: '8px', borderRadius: '16px', marginBottom: '1rem' }}>
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
        
        <button 
          onClick={locateUser} 
          disabled={isLocating}
          style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', padding: '10px 20px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', transition: '0.3s' }}
          className="hover-scale"
        >
          <span>📍</span> {isLocating ? 'Locating...' : 'Find Near Me'}
        </button>
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

      {/* Popular / Near You */}
      <section style={{ padding: '3rem 0' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>
          {userLocation ? '📍 Closest to You' : '🔥 Popular Near You'}
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
          {filteredBusinesses.length > 0 ? (
            filteredBusinesses.map(biz => (
              <Link to={`/business/${biz.id}`} key={biz.id} className="hover-scale">
                <div className="glass-panel" style={{ overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ height: '200px', background: `url(${biz.cover_image || biz.image || biz.logo || 'https://images.unsplash.com/photo-1556761175-5973dc0f32d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'}) center/cover no-repeat` }} />
                  <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>
                        {biz.category?.name || 'Service'}
                      </span>
                      <span style={{ background: 'rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: '8px', fontSize: '0.9rem' }}>⭐ {biz.rating || 'New'}</span>
                    </div>
                    <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>{biz.name}</h3>
                    
                    <div style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '5px', marginTop: 'auto' }}>
                      <span>📍</span> 
                      {biz.calculatedDistance 
                        ? `${biz.calculatedDistance.toFixed(1)} km away` 
                        : (biz.address || 'Address not available')
                      }
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
              <h3>No services found.</h3>
            </div>
          )}
        </div>
      </section>

      {/* Explore on Map Section */}
      <section style={{ padding: '3rem 0', paddingBottom: '5rem' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>🌍 Explore All Services on Map</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          Browse all businesses and services around you.
        </p>
        <MapWidget businesses={allBusinesses} height="500px" />
      </section>

    </div>
  );
};

export default HomePage;
