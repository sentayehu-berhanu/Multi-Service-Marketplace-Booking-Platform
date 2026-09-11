import React, { useState } from "react";

function DeliverySearch({ value, onChange }) {
  const [localSearch, setLocalSearch] = useState(value || "");
  const [location, setLocation] = useState("Addis Ababa");

  const handleSearch = () => {
    onChange(localSearch);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleChangeLocation = () => {
    const newLocation = window.prompt("Enter your delivery location:", location);
    if (newLocation && newLocation.trim()) {
      setLocation(newLocation.trim());
    }
  };

  return (
    <div className="delivery-search-container">
      <div className="delivery-search">
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search restaurants, stores, or products..."
            className="search-input"
          />
        </div>
        <button className="location-button" onClick={handleChangeLocation}>
          📍 {location}
        </button>
        <button className="search-button" onClick={handleSearch}>
          Search
        </button>
      </div>
    </div>
  );
}

export default DeliverySearch;
