import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import UpdateAvailabilityModal from '../../components/UpdateAvailabilityModal';
import CreateCouponModal from '../../components/CreateCouponModal';
import UpdateGalleryModal from '../../components/UpdateGalleryModal';

const DashboardHome = () => {
  const [business, setBusiness] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAvailabilityModalOpen, setIsAvailabilityModalOpen] = useState(false);
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        // Fetch my businesses
        const bizRes = await axios.get('http://localhost:5000/api/businesses/my', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (bizRes.data.length > 0) {
          const myBiz = bizRes.data[0];
          setBusiness(myBiz);
          
          // Fetch bookings for this business
          const bookRes = await axios.get(`http://localhost:5000/api/bookings/business/${myBiz.id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setBookings(bookRes.data);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const handleAcceptBooking = async (bookingId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:5000/api/bookings/${bookingId}/status`, 
        { status: 'CONFIRMED' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update local state
      setBookings(bookings.map(b => b.id === bookingId ? { ...b, status: 'CONFIRMED' } : b));
    } catch (error) {
      console.error('Error accepting booking:', error);
      alert('Failed to accept booking');
    }
  };

  const pendingCount = bookings.filter(b => b.status === 'PENDING').length;
  const todayRevenue = bookings.filter(b => b.status === 'CONFIRMED').reduce((acc, curr) => acc + curr.total_price, 0);

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem' }}>Overview {business ? `- ${business.name}` : ''}</h1>
        <button className="btn-primary" style={{ padding: '10px 20px', fontSize: '0.9rem' }} onClick={() => navigate('/business-dashboard/services')}>+ Add Service</button>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div className="glass-panel hover-scale" style={{ padding: '1.5rem' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Total Bookings</p>
          <h2 style={{ fontSize: '2.5rem', color: 'var(--text-primary)' }}>{bookings.length}</h2>
        </div>
        <div className="glass-panel hover-scale" style={{ padding: '1.5rem' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Expected Revenue</p>
          <h2 style={{ fontSize: '2.5rem', color: 'var(--success)' }}>{todayRevenue} ETB</h2>
        </div>
        <div className="glass-panel hover-scale" style={{ padding: '1.5rem' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Pending Requests</p>
          <h2 style={{ fontSize: '2.5rem', color: 'var(--warning)' }}>{pendingCount}</h2>
        </div>
        <div className="glass-panel hover-scale" style={{ padding: '1.5rem' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Total Customers</p>
          <h2 style={{ fontSize: '2.5rem', color: 'var(--text-primary)' }}>{new Set(bookings.map(b => b.customer_id)).size}</h2>
        </div>
      </div>

      {/* Schedule & Recent Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Recent Bookings</h3>
          {bookings.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)' }}>No bookings yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {bookings.map(booking => {
                const date = new Date(booking.start_time);
                const isPending = booking.status === 'PENDING';
                return (
                  <div key={booking.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', borderLeft: `4px solid ${isPending ? 'var(--warning)' : 'var(--success)'}` }}>
                    <div>
                      <strong style={{ display: 'block', fontSize: '1.1rem' }}>{date.toLocaleDateString()} {date.toLocaleTimeString()}</strong>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{booking.customer?.name || 'Customer'}</span>
                    </div>
                    <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ display: 'block', fontWeight: 500 }}>{booking.service?.name}</span>
                        <span style={{ color: isPending ? 'var(--warning)' : 'var(--success)', fontSize: '0.8rem', fontWeight: 'bold' }}>{booking.status}</span>
                      </div>
                      {isPending && (
                        <button 
                          className="btn-primary" 
                          style={{ padding: '5px 12px', fontSize: '0.85rem' }}
                          onClick={() => handleAcceptBooking(booking.id)}
                        >
                          Accept
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button className="btn-secondary" style={{ textAlign: 'left' }} onClick={() => setIsAvailabilityModalOpen(true)}>📅 Update Availability</button>
            <button className="btn-secondary" style={{ textAlign: 'left' }} onClick={() => setIsCouponModalOpen(true)}>🎫 Create Coupon</button>
            <button className="btn-secondary" style={{ textAlign: 'left' }} onClick={() => setIsGalleryModalOpen(true)}>📸 Update Gallery</button>
          </div>
        </div>

      </div>

      {business && (
        <UpdateAvailabilityModal 
          isOpen={isAvailabilityModalOpen} 
          onClose={() => setIsAvailabilityModalOpen(false)} 
          businessId={business.id} 
        />
      )}

      {business && (
        <CreateCouponModal 
          isOpen={isCouponModalOpen} 
          onClose={() => setIsCouponModalOpen(false)} 
          businessId={business.id}
          onCouponCreated={(coupon) => alert(`Coupon ${coupon.code} created successfully!`)}
        />
      )}

      {business && (
        <UpdateGalleryModal 
          isOpen={isGalleryModalOpen} 
          onClose={() => setIsGalleryModalOpen(false)} 
          businessId={business.id} 
        />
      )}

    </div>
  );
};

export default DashboardHome;
