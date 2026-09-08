import React from 'react';

function TrainingHero() {
  return (
    <section className="training-hero">
      <div className="training-hero-content">
        <span className="training-badge">🎓 Tutor & Training</span>
        <h1>Learn & Train</h1>
        <p>
          Learn from expert tutors and build the skills you need for your future.
        </p>

        <div className="hero-search">
          <div className="search-input-group">
            <span>🔍</span>
            <input placeholder="Search tutors, subjects, or skills" />
          </div>

          <div className="location-group">
            <span>📍</span>
            <span>Addis Ababa</span>
          </div>

          <button className="primary-btn">Find Tutor</button>
        </div>
      </div>
    </section>
  );
}

export default TrainingHero;
