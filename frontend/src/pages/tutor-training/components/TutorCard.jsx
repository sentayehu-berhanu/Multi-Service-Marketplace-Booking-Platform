import React from 'react';

function TutorCard({ tutor, onSelect }) {
  return (
    <article className="tutor-card">
      <div className="tutor-image-wrapper">
        <img src={tutor.image} alt={tutor.name} />
        <button className="favorite-button">♡</button>
      </div>

      <div className="tutor-content">
        <h3>{tutor.name}</h3>
        <p className="tutor-subject">{tutor.subject}</p>

        <div className="tutor-rating">
          ⭐ {tutor.rating}
          <span>{tutor.students} students</span>
        </div>

        <div className="tutor-modes">
          {tutor.modes.includes("online") && <span>🟢 Online</span>}
          {tutor.modes.includes("physical") && <span>📍 Physical</span>}
        </div>

        <div className="tutor-price">
          <strong>{tutor.price} {tutor.currency}</strong>
          <span>/ hour</span>
        </div>

        <div className="availability">
          <small>Available</small>
          <div className="availability-days">
            {tutor.availability.map(day => (
              <span key={day}>{day.substring(0, 3)}</span>
            ))}
          </div>
        </div>

        <button className="book-tutor-button" onClick={() => onSelect(tutor)}>
          Book Session
        </button>
      </div>
    </article>
  );
}

export default TutorCard;
