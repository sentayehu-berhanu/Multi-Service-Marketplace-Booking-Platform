import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const CustomerBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }
        
        const res = await axios.get('http://localhost:5000/api/bookings/my', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBookings(res.data);
      } catch (error) {
        console.error('Error fetching bookings', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  if (loading) {
    return <div className="container" style={{ padding: '4rem 24px', textAlign: 'center' }}>Loading bookings...</div>;
  }

  return (
    <div className="container" style={{ padding: '4rem 24px' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>My Bookings</h1>
      
      {bookings.length === 0 ? (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
          <h2 style={{ marginBottom: '1rem' }}>No Bookings Yet</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Looks like you haven't booked any services yet.</p>
          <Link to="/"><button className="btn-primary">Explore Services</button></Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {bookings.map(booking => (
            <div key={booking.id} className="glass-panel hover-scale" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1.4rem', marginBottom: '8px' }}>{booking.business?.name || 'Business Name'}</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '4px' }}>Service: <span style={{ color: 'var(--text-primary)' }}>{booking.service?.name || 'Service Name'}</span></p>
                <p style={{ color: 'var(--text-secondary)' }}>Time: <span style={{ color: 'var(--text-primary)' }}>{new Date(booking.start_time).toLocaleString()}</span></p>
              </div>
              <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
                <span style={{ 
                  padding: '6px 14px', 
                  borderRadius: '20px', 
                  fontSize: '0.85rem', 
                  fontWeight: 'bold',
                  background: booking.status === 'CONFIRMED' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                  color: booking.status === 'CONFIRMED' ? 'var(--success)' : 'var(--warning)',
                  border: `1px solid ${booking.status === 'CONFIRMED' ? 'var(--success)' : 'var(--warning)'}`
                }}>
                  {booking.status}
                </span>
                <p style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--accent-secondary)' }}>{booking.total_price} ETB</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerBookings;
