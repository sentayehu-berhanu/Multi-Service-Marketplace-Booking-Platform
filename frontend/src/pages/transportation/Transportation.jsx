import React, { useState } from "react";
import TransportationHero from "./components/TransportationHero";
import TransportTypes from "./components/TransportTypes";
import RideSearch from "./components/RideSearch";
import PopularServices from "./components/PopularServices";
import VehicleList from "./components/VehicleList";
import BookingPanel from "./components/BookingPanel";
import "./Transportation.css";

function Transportation() {
  const [transportType, setTransportType] = useState("ride");
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [booking, setBooking] = useState(null);

  return (
    <div className="transportation-page">
      <TransportationHero />

      <div className="transportation-container">
        <TransportTypes
          selectedType={transportType}
          onSelect={(typeId) => {
            setTransportType(typeId);
            const el = document.getElementById("vehicle-list-target");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }}
        />

        <RideSearch
          transportType={transportType}
          onSearch={(data) => {
            console.log("Search:", data);
            const el = document.getElementById("vehicle-list-target");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }}
        />

        <PopularServices
          transportType={transportType}
        />

        <VehicleList
          transportType={transportType}
          onSelectVehicle={setSelectedVehicle}
        />

        {selectedVehicle && (
          <BookingPanel
            vehicle={selectedVehicle}
            onClose={() => setSelectedVehicle(null)}
            onConfirm={(data) => {
              setBooking(data);
              setSelectedVehicle(null);
            }}
          />
        )}

        {booking && (
          <div className="booking-success">
            <div className="success-content">
              <h2>✓ Booking Confirmed</h2>
              <p>Booking {booking.bookingNumber}</p>
              <p>{booking.vehicle.name}</p>
              <p>Total: {booking.total} ETB</p>
              <div className="success-actions">
                <button onClick={() => setBooking(null)}>Done</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Transportation;
