import React from 'react';
import TutorCard from './TutorCard';

function TutorGrid({ tutors, onSelect }) {
  if (tutors.length === 0) {
    return (
      <div className="empty-state">
        <p>No tutors found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="tutor-grid">
      {tutors.map((tutor) => (
        <TutorCard key={tutor.id} tutor={tutor} onSelect={onSelect} />
      ))}
    </div>
  );
}

export default TutorGrid;
