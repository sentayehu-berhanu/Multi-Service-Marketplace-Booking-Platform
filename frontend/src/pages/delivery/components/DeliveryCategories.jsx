import React from "react";
import { deliveryCategories } from "../data/deliveryCategories";

function DeliveryCategories({ selected, onSelect }) {
  return (
    <section className="delivery-categories">
      {deliveryCategories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelect(category.id)}
          className={`delivery-category ${selected === category.id ? "active" : ""}`}
        >
          <span className="category-icon">{category.icon}</span>
          <strong>{category.name}</strong>
        </button>
      ))}
    </section>
  );
}

export default DeliveryCategories;
