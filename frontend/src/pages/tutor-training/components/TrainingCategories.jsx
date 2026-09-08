import React from 'react';
import { categories } from '../data/categories';

function TrainingCategories({ selected, onSelect }) {
  return (
    <section className="training-categories">
      <div className="categories-container">
        <button
          className={`category-pill ${selected === 'all' ? 'active' : ''}`}
          onClick={() => onSelect('all')}
        >
          All Categories
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            className={`category-pill ${selected === category.id ? 'active' : ''}`}
            onClick={() => onSelect(category.id)}
          >
            <span className="category-icon">{category.icon}</span>
            {category.name}
          </button>
        ))}
      </div>
    </section>
  );
}

export default TrainingCategories;
