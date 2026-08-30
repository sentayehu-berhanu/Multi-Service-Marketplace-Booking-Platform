import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DashboardReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        // Fetch my businesses to get the business ID
        const bizRes = await axios.get('http://localhost:5000/api/businesses/my', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (bizRes.data.length > 0) {
          const businessId = bizRes.data[0].id;

          // Fetch reviews for this business
          const reviewsRes = await axios.get(`http://localhost:5000/api/reviews/business/${businessId}`);
          setReviews(reviewsRes.data);
        }
      } catch (err) {
        console.error('Error fetching reviews:', err);
        setError('Failed to load reviews.');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <span key={i} style={{ color: i < rating ? 'var(--warning)' : 'var(--glass-border)' }}>
        ★
      </span>
    ));
  };

  if (loading) return <div>Loading reviews...</div>;
  if (error) return <div style={{ color: 'var(--danger)' }}>{error}</div>;

  return (
    <div>
      <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Customer Reviews</h2>
      
      {reviews.length === 0 ? (
        <p style={{ color: 'var(--text-secondary)' }}>You don't have any reviews yet.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
          {reviews.map(review => (
            <div key={review.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'white' }}>
                    {review.customer?.name ? review.customer.name.charAt(0).toUpperCase() : 'A'}
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{review.customer?.name || 'Anonymous'}</h3>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                <div style={{ fontSize: '1.2rem', letterSpacing: '2px' }}>
                  {renderStars(review.rating)}
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '8px', borderLeft: '3px solid var(--accent-primary)' }}>
                <p style={{ margin: 0, color: 'var(--text-primary)', fontStyle: 'italic', lineHeight: '1.5' }}>
                  "{review.comment || 'No comment provided.'}"
                </p>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardReviews;
