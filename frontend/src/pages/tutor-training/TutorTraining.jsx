import React, { useState } from "react";

import TrainingHero from "./components/TrainingHero";
import TrainingCategories from "./components/TrainingCategories";
import TutorSearch from "./components/TutorSearch";
import TutorGrid from "./components/TutorGrid";
import CourseCard from "./components/CourseCard";
import BookingModal from "./components/BookingModal";
import CourseModal from "./components/CourseModal";

import { tutors } from "./data/tutors";
import { courses } from "./data/courses";

import "./TutorTraining.css";

function TutorTraining() {
  const [category, setCategory] = useState("all");
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [search, setSearch] = useState("");

  const filteredTutors = tutors.filter((tutor) => {
    const matchesCategory =
      category === "all" || tutor.category === category;

    const matchesSearch =
      tutor.name.toLowerCase().includes(search.toLowerCase()) ||
      tutor.subject.toLowerCase().includes(search.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <main className="training-page">
      <TrainingHero />

      <TrainingCategories
        selected={category}
        onSelect={setCategory}
      />

      <div className="container">
        <TutorSearch
          value={search}
          onChange={setSearch}
        />

        <section className="training-section">
          <div className="section-heading">
            <div className="heading-content">
              <span className="section-subtitle">TOP EDUCATORS</span>
              <h2>Find Your Perfect Tutor</h2>
            </div>
            <button className="view-all-btn" onClick={() => alert("Filtering to show all tutors...")}>View All Tutors</button>
          </div>

          <TutorGrid
            tutors={filteredTutors}
            onSelect={setSelectedTutor}
          />
        </section>

        <section className="training-section">
          <div className="section-heading">
            <div className="heading-content">
              <span className="section-subtitle">LEARN SOMETHING NEW</span>
              <h2>Popular Training Courses</h2>
            </div>
            <button className="view-all-btn" onClick={() => alert("Filtering to show all courses...")}>View All Courses</button>
          </div>

          <div className="course-grid">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} onSelect={setSelectedCourse} />
            ))}
          </div>
        </section>
      </div>

      {selectedTutor && (
        <BookingModal
          tutor={selectedTutor}
          onClose={() => setSelectedTutor(null)}
        />
      )}

      {selectedCourse && (
        <CourseModal
          course={selectedCourse}
          onClose={() => setSelectedCourse(null)}
        />
      )}
    </main>
  );
}

export default TutorTraining;
