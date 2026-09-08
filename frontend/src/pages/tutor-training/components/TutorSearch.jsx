import React from 'react';

function TutorSearch({ value, onChange }) {
  return (
    <section className="tutor-search-bar">
      <div className="search-input-wrapper">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Filter by name, subject or skill..."
          className="tutor-filter-input"
        />
      </div>
    </section>
  );
}

export default TutorSearch;
