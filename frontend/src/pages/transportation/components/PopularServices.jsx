import React, { useState, useEffect } from 'react';
import axios from 'axios';
// Removed mocked services import

function PopularServices({ transportType }) {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransportationBusinesses = async () => {
      try {
        setLoading(true);
        // Fetch all businesses under the 'transportation' category
        const res = await axios.get('http://localhost:5000/api/businesses?category=transportation');
        setBusinesses(res.data);
      } catch (err) {
        console.error('Failed to fetch popular services:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransportationBusinesses();
  }, []);

  return (
    <section className="popular-services">
      <h2>Popular Providers</h2>
      <div className="services-grid">
        {loading ? (
          <p>Loading providers...</p>
        ) : businesses.length > 0 ? (
          businesses.map((biz) => (
            <article key={biz.id} className="service-card">
              <img 
                src={biz.cover_image || "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=500&auto=format&fit=crop&q=60"} 
                alt={biz.name} 
              />
              <div className="service-content">
                <h3>{biz.name}</h3>
                <div className="rating">
                  ⭐ {biz.rating || 'New'} <span>({biz.review_count || 0})</span>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {biz.description || 'Transportation services'}
                </p>
                <button>View Details</button>
              </div>
            </article>
          ))
        ) : (
          <p>No popular providers found.</p>
        )}
      </div>
    </section>
  );
}

export default PopularServices;
