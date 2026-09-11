import React from "react";
import { eventCategories } from "../data/events";

function EventCategories({ selected, onSelect }) {
  return (
    <section className="event-categories">
      {eventCategories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelect(category.id)}
          className={`event-category ${selected === category.id ? "active" : ""}`}
        >
          <span className="category-icon">{category.icon}</span>
          <strong>{category.name}</strong>
        </button>
      ))}
    </section>
  );
}

export default EventCategories;
