import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FiSearch, FiMapPin, FiStar } from 'react-icons/fi';

const GymSearch = () => {
  const [gyms, setGyms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchGyms();
  }, []);

  const fetchGyms = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/businesses?category=gym');
      
      if (res.data && res.data.length > 0) {
        setGyms(res.data);
      } else {
        // Fallback mock data if DB is empty
        setGyms([
          {
            id: 1,
            name: 'Power Gym',
            address: 'Bole, Addis Ababa',
            rating: 4.8,
            distance: '0.8 km'
          },
          {
            id: 2,
            name: 'Iron Fitness',
            address: 'Piassa, Addis Ababa',
            rating: 4.5,
            distance: '2.5 km'
          },
          {
            id: 3,
            name: 'Flex Studio',
            address: 'CMC, Addis Ababa',
            rating: 4.9,
            distance: '5.0 km'
          }
        ]);
      }
    } catch (err) {
      console.error('Error fetching gyms:', err);
      // Fallback
      setGyms([
        {
          id: 1,
          name: 'Power Gym',
          address: 'Bole, Addis Ababa',
          rating: 4.8,
          distance: '0.8 km'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredGyms = gyms.filter(gym => 
    gym.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    gym.address?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container" style={{ padding: '40px 24px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 className="gradient-text" style={{ fontSize: '3rem', marginBottom: '16px' }}>FITNESS</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
          Find the perfect gym for your fitness journey. Memberships, classes, and personal trainers.
        </p>
      </div>

      {/* Search Bar */}
      <div style={{ maxWidth: '600px', margin: '0 auto 40px auto' }}>
        <div className="input-field" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 24px', borderRadius: '30px' }}>
          <FiSearch size={20} style={{ color: 'var(--text-secondary)' }} />
          <input 
            type="text" 
            placeholder="Search location or gym name..."
            style={{ 
              background: 'transparent', border: 'none', color: 'var(--text-primary)', 
              outline: 'none', width: '100%', fontSize: '1rem' 
            }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <h2 style={{ fontSize: '1.5rem', marginBottom: '24px' }}>Gyms Near You</h2>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>Loading fitness centers...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
          {filteredGyms.map(gym => (
            <div key={gym.id} className="glass-panel hover-scale" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ height: '160px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '4rem' }}>🏋️</span>
              </div>
              
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h3 style={{ fontSize: '1.4rem', margin: '0 0 8px 0' }}>{gym.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(250, 204, 21, 0.1)', padding: '4px 8px', borderRadius: '8px', color: 'var(--warning)' }}>
                    <FiStar size={14} />
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{gym.rating || '4.8'}</span>
                  </div>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><FiMapPin /> {gym.address || 'Addis Ababa'}</span>
                  <span style={{ color: 'var(--accent-secondary)' }}>{gym.distance || '0.8 km'}</span>
                </div>
              </div>

              <Link to={`/business/gym/${gym.id}`} className="btn-primary" style={{ textAlign: 'center', marginTop: 'auto', textDecoration: 'none' }}>
                VIEW GYM
              </Link>
            </div>
          ))}
          {filteredGyms.length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
              No gyms found matching your search.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GymSearch;
