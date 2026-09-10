import React from 'react';
import { transportTypes } from '../data/transportTypes';

function TransportTypes({ selectedType, onSelect }) {
  return (
    <section className="transport-types">
      {transportTypes.map((type) => (
        <button
          key={type.id}
          className={
            selectedType === type.id
              ? "transport-type active"
              : "transport-type"
          }
          onClick={() => onSelect(type.id)}
        >
          <span className="transport-icon">
            {type.icon}
          </span>
          <span>
            {type.name}
          </span>
        </button>
      ))}
    </section>
  );
}

export default TransportTypes;
