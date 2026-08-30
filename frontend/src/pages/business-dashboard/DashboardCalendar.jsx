import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DashboardCalendar = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      // First get the business ID
      const bizRes = await axios.get('http://localhost:5000/api/businesses/my', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const businessId = bizRes.data.id;
      
      // Then get the bookings
      const bookingsRes = await axios.get(`http://localhost:5000/api/bookings/business/${businessId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(bookingsRes.data);
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

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const { daysInMonth, firstDay } = getDaysInMonth(currentDate);
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  // Create grid cells (empty cells for padding before the 1st day)
  const cells = [];
  for (let i = 0; i < firstDay; i++) {
    cells.push(<div key={`empty-${i}`} className="calendar-cell empty"></div>);
  }

  // Create grid cells for actual days
  for (let i = 1; i <= daysInMonth; i++) {
    const cellDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
    // Find bookings for this day
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
    </div>
  );
};

export default DashboardCalendar;
