import React, { useState } from "react";

function RideSearch({ transportType, onSearch }) {
  const [form, setForm] = useState({
    from: "",
    to: "",
    date: "",
    time: "",
    passengers: 1
  });

  const updateField = (field, value) => {
    setForm({
      ...form,
      [field]: value
    });
  };

  const submitSearch = (e) => {
    e.preventDefault();
    onSearch({
      transportType,
      ...form
    });
  };

  return (
    <form className="ride-search" onSubmit={submitSearch}>
      <div className="input-group">
        <label>From</label>
        <input
          type="text"
          placeholder={transportType === 'airport' ? "Airport Code" : "Pickup location"}
          value={form.from}
          onChange={(e) => updateField("from", e.target.value)}
          required
        />
      </div>

      <div className="input-group">
        <label>To</label>
        <input
          type="text"
          placeholder={transportType === 'rental' ? "Return location" : "Destination"}
          value={form.to}
          onChange={(e) => updateField("to", e.target.value)}
          required
        />
      </div>

      <div className="input-group">
        <label>Date</label>
        <input
          type="date"
          value={form.date}
          onChange={(e) => updateField("date", e.target.value)}
          required
        />
      </div>

      <div className="input-group">
        <label>Time</label>
        <input
          type="time"
          value={form.time}
          onChange={(e) => updateField("time", e.target.value)}
          required
        />
      </div>

      <button type="submit" className="search-button">
        Search
      </button>
    </form>
  );
}

export default RideSearch;
