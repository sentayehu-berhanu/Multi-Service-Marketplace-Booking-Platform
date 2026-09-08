import React, { useState } from 'react';

function CourseModal({ course, onClose }) {
  const [step, setStep] = useState(1); // 1: Course Details, 2: Payment, 3: Confirmation

  const handleNextStep = () => setStep(step + 1);
  const handleBackStep = () => setStep(step - 1);

  const handleEnroll = () => {
    // Mocking enrollment API call
    setTimeout(() => {
      setStep(3);
    }, 1500);
  };

  return (
    <div className="booking-modal-overlay">
      <div className="booking-modal course-modal">
        <button className="close-btn" onClick={onClose}>×</button>

        {step === 1 && (
          <div className="modal-step course-details-step">
            <div className="course-header-banner" style={{ backgroundImage: `url(${course.image})` }}>
              <div className="course-header-overlay">
                <span className="course-category-badge">{course.category}</span>
              </div>
            </div>
            
            <div className="course-details-content">
              <h2>{course.title}</h2>
              <div className="course-meta-info">
                <span>⭐ {course.rating} ({course.students} students)</span>
                <span>Instructor: {course.instructor}</span>
              </div>
              
              <div className="course-stats">
                <div className="stat">
                  <strong>{course.duration}</strong>
                  <span>Duration</span>
                </div>
                <div className="stat">
                  <strong>{course.lessons}</strong>
                  <span>Lessons</span>
                </div>
                <div className="stat">
                  <strong>{course.mode}</strong>
                  <span>Format</span>
                </div>
              </div>

              <hr className="divider" />

              <div className="course-section">
                <h3>What You Will Learn</h3>
                <ul className="learning-list">
                  {course.whatYouWillLearn?.map((item, index) => (
                    <li key={index}>
                      <span className="check-icon">✓</span> {item}
                    </li>
                  ))}
                </ul>
              </div>

              <hr className="divider" />

              <div className="course-section">
                <h3>Course Content</h3>
                <div className="syllabus-list">
                  {course.courseContent?.map((item) => (
                    <div key={item.id} className="syllabus-item">
                      <span className="syllabus-id">{item.id}</span>
                      <span className="syllabus-title">{item.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <div className="price-info">
                <strong>{course.price} ETB</strong>
              </div>
              <button className="primary-btn" onClick={handleNextStep}>Enroll Now</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="modal-step summary-step">
            <h2>Enrollment Summary</h2>
            
            <div className="summary-card">
              <div className="summary-row">
                <span>Course</span>
                <strong>{course.title}</strong>
              </div>
              <div className="summary-row">
                <span>Instructor</span>
                <strong>{course.instructor}</strong>
              </div>
              <div className="summary-row">
                <span>Duration</span>
                <strong>{course.duration} ({course.lessons} Lessons)</strong>
              </div>
              
              <hr />
              
              <div className="summary-row total-row">
                <span>TOTAL</span>
                <strong>{course.price} ETB</strong>
              </div>
            </div>

            <div className="payment-options">
              <h3>Payment Method</h3>
              <label className="payment-option"><input type="radio" name="payment" defaultChecked /> ServiceHub Wallet</label>
              <label className="payment-option"><input type="radio" name="payment" /> Card</label>
              <label className="payment-option"><input type="radio" name="payment" /> Mobile Money</label>
            </div>

            <div className="modal-footer split">
              <button className="secondary-btn" onClick={handleBackStep}>Back</button>
              <button className="primary-btn checkout-btn" onClick={handleEnroll}>Pay {course.price} ETB</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="modal-step confirmation-step">
            <div className="success-icon">✓</div>
            <h2>COURSE ENROLLED</h2>
            <p className="booking-ref">Enrollment #SH-CRS-{Math.floor(Math.random() * 100000)}</p>
            
            <div className="confirmation-details">
              <p><strong>{course.title}</strong></p>
              <p>By {course.instructor}</p>
              <p>{course.lessons} Lessons - {course.mode}</p>
              <p>Total Paid: {course.price} ETB</p>
            </div>

            <div className="modal-footer vertical">
              <button className="primary-btn" onClick={onClose}>Go to My Learning</button>
              <button className="secondary-btn" onClick={onClose}>Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CourseModal;
