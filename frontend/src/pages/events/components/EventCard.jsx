import React from "react";

function EventCard({ event, onSelect }) {
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    try {
      const [hours, minutes] = timeStr.split(':');
      if (!hours || !minutes) return timeStr;
      const h = parseInt(hours, 10);
      const ampm = h >= 12 ? 'PM' : 'AM';
      const h12 = h % 12 || 12;
      return `${h12}:${minutes} ${ampm}`;
    } catch {
      return timeStr;
    }
  };

  return (
    <article className="event-card">
      <div className="event-image">
        <img src={event.image} alt={event.title} />
        <button className="favorite-btn">♡</button>
      </div>
      <div className="event-content">
        <span className="event-category">{event.category}</span>
        <h3>{event.title}</h3>
        <p className="event-detail">📅 {formatDate(event.date)}</p>
        <p className="event-detail">🕐 {formatTime(event.time)}</p>
        <p className="event-detail">📍 {event.venue}</p>
        
        <div className="event-footer">
          <strong>From {event.price} ETB</strong>
          <button onClick={() => onSelect(event)} className="get-tickets-btn">
            Get Tickets
          </button>
        </div>
      </div>
    </article>
  );
}

export default EventCard;
