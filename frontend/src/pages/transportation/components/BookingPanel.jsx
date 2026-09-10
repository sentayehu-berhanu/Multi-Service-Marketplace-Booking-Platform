import React, { useState } from 'react';

function calculateRentalPrice(pricePerDay, days, insurance, serviceFee) {
  const vehicleCost = pricePerDay * days;
  return vehicleCost + insurance + serviceFee;
}

function BookingPanel({ vehicle, onClose, onConfirm }) {
  const [days, setDays] = useState(3);
  const insurance = 500;
  const serviceFee = 300;

  const total = calculateRentalPrice(vehicle.pricePerDay, days, insurance, serviceFee);

  const handleConfirm = () => {
    onConfirm({
      vehicle,
      days,
      total,
      bookingNumber: `SH-${Math.floor(100000 + Math.random() * 900000)}`
    });
  };

  return (
    <div className="booking-panel-overlay">
      <div className="booking-panel">
        <button className="close-btn" onClick={onClose}>&times;</button>
        
        <h2>{vehicle.name}</h2>
        <div className="bp-rating">★★★★★ {vehicle.rating}</div>

        <div className="bp-specs">
          <span>{vehicle.transmission}</span>
          <span>{vehicle.seats} Seats</span>
          <span>Air Conditioning</span>
        </div>

        <div className="bp-price-tag">
          {vehicle.pricePerDay} ETB / day
        </div>

        <div className="bp-form">
          <div className="input-group">
            <label>Pickup Location</label>
            <input type="text" defaultValue="Addis Ababa" />
          </div>
          <div className="input-group">
            <label>Return Location</label>
            <input type="text" defaultValue="Addis Ababa" />
          </div>
          <div className="input-group">
            <label>Days</label>
            <input type="number" min="1" value={days} onChange={(e) => setDays(Number(e.target.value))} />
          </div>
        </div>

        <div className="bp-summary">
          <div className="bp-row">
            <span>Vehicle ({days} days):</span>
            <span>{vehicle.pricePerDay * days} ETB</span>
          </div>
          <div className="bp-row">
            <span>Insurance:</span>
            <span>{insurance} ETB</span>
          </div>
          <div className="bp-row">
            <span>Service fee:</span>
            <span>{serviceFee} ETB</span>
          </div>
          <hr />
          <div className="bp-row bp-total">
            <span>Total:</span>
            <span>{total} ETB</span>
          </div>
        </div>

        <button className="confirm-btn" onClick={handleConfirm}>
          Continue to Payment
        </button>
      </div>
    </div>
  );
}

export default BookingPanel;
