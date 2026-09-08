import React from 'react';

function CourseCard({ course, onSelect }) {
  return (
    <article className="course-card">
      <div className="course-image-wrapper">
        <img src={course.image} alt={course.title} />
        <span className="course-duration-badge">{course.duration}</span>
      </div>

      <div className="course-content">
        <div className="course-meta">
          <span className="course-category">{course.category}</span>
          <span className="course-rating">⭐ {course.rating} ({course.students})</span>
        </div>

        <h3>{course.title}</h3>
        <p className="course-instructor">By {course.instructor}</p>

        <div className="course-details">
          <span>📚 {course.lessons} Lessons</span>
          <span>{course.mode === 'Online' ? '🟢 Online' : '📍 Physical'}</span>
        </div>

        <div className="course-footer">
          <div className="course-price">
            <strong>{course.price} ETB</strong>
          </div>
          <button className="enroll-button" onClick={() => onSelect(course)}>Enroll Now</button>
        </div>
      </div>
    </article>
  );
}

export default CourseCard;
