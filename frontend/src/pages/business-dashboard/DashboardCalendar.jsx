import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DashboardCalendar = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const bizRes = await axios.get('http://localhost:5000/api/businesses/my', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const businessId = bizRes.data[0]?.id;
      
      if (businessId) {
        const bookingsRes = await axios.get(`http://localhost:5000/api/bookings/business/${businessId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBookings(bookingsRes.data);
      }
    } catch (error) {
      console.error('Error fetching calendar bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    return { daysInMonth, firstDay };
  };

  const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const updateBookingStatus = async (status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:5000/api/bookings/${selectedBooking.id}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update local state
      setBookings(bookings.map(b => b.id === selectedBooking.id ? { ...b, status } : b));
      setSelectedBooking({ ...selectedBooking, status });
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update booking status.');
    }
  };

  const openBookingDetails = (booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const { daysInMonth, firstDay } = getDaysInMonth(currentDate);
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  const cells = [];
  for (let i = 0; i < firstDay; i++) {
    cells.push(<div key={`empty-${i}`} className="calendar-cell empty"></div>);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    const cellDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
    const dayBookings = bookings.filter(b => {
      const bDate = new Date(b.start_time);
      return bDate.getDate() === i && bDate.getMonth() === currentDate.getMonth() && bDate.getFullYear() === currentDate.getFullYear();
    });

    cells.push(
      <div key={`day-${i}`} className="calendar-cell">
        <div className="calendar-day-number">{i}</div>
        <div className="calendar-bookings-list">
          {dayBookings.map(b => (
            <div 
              key={b.id} 
              onClick={() => openBookingDetails(b)}
              className={`calendar-booking-item ${b.status === 'CONFIRMED' ? 'confirmed' : 'pending'}`}
              title={`${new Date(b.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - ${b.customer.name}`}
            >
              <span className="booking-time">{new Date(b.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
              <span className="booking-name">{b.customer.name}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="calendar-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '2rem', margin: 0 }}>Calendar</h1>
        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
            <span style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '50%', background: 'var(--success)' }}></span> Confirmed
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
            <span style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '50%', background: 'var(--warning)' }}></span> Pending
          </div>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '2rem' }}>
        <div className="calendar-header-actions">
          <button className="btn-secondary hover-scale" onClick={handlePrevMonth}>&larr; Prev</button>
          <h2 className="calendar-month-title">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
          <button className="btn-secondary hover-scale" onClick={handleNextMonth}>Next &rarr;</button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>Loading calendar...</div>
        ) : (
          <div>
            <div className="calendar-grid-header">
              <div>Sun</div>
              <div>Mon</div>
              <div>Tue</div>
              <div>Wed</div>
              <div>Thu</div>
              <div>Fri</div>
              <div>Sat</div>
            </div>
            <div className="calendar-grid">
              {cells}
            </div>
          </div>
        )}
      </div>

      {isModalOpen && selectedBooking && (
        <div style={{ 
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 
        }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', padding: '2rem', position: 'relative' }}>
            <h2 style={{ marginBottom: '1.5rem', marginTop: 0 }}>Booking Details</h2>
            
            <div style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Customer</span>
                <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>{selectedBooking.customer?.name}</div>
              </div>
              
              <div>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Service</span>
                <div style={{ fontSize: '1.1rem' }}>{selectedBooking.service?.name}</div>
              </div>

              <div>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Time</span>
                <div style={{ fontSize: '1.1rem' }}>
                  {new Date(selectedBooking.start_time).toLocaleDateString()} at {new Date(selectedBooking.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
              </div>

              <div>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Status</span>
                <div style={{ 
                  display: 'inline-block',
                  marginTop: '4px',
                  padding: '4px 12px',
                  borderRadius: '12px',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  color: selectedBooking.status === 'CONFIRMED' ? 'var(--success)' : 'var(--warning)',
                  background: selectedBooking.status === 'CONFIRMED' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)'
                }}>
                  {selectedBooking.status}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', flexDirection: 'column' }}>
              {selectedBooking.status === 'PENDING' && (
                <button className="btn-primary hover-scale" onClick={() => updateBookingStatus('CONFIRMED')}>
                  Accept Booking
                </button>
              )}
              {selectedBooking.status === 'CONFIRMED' && (
                <button className="btn-primary hover-scale" style={{ background: 'var(--success)' }} onClick={() => updateBookingStatus('COMPLETED')}>
                  Mark as Completed
                </button>
              )}
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button className="btn-secondary hover-scale" style={{ flex: 1 }} onClick={() => setIsModalOpen(false)}>Close</button>
                {selectedBooking.status !== 'CANCELLED' && selectedBooking.status !== 'COMPLETED' && (
                  <button className="btn-secondary hover-scale" style={{ flex: 1, color: 'var(--danger)', borderColor: 'rgba(239,68,68,0.3)' }} onClick={() => updateBookingStatus('CANCELLED')}>
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardCalendar;
