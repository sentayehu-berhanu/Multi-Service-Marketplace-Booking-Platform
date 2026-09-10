import React, { useState, useEffect } from 'react';
import axios from 'axios';
// Removed mocked vehicles import

const categories = ["All", "Economy", "SUV", "Luxury", "Van", "Bus"];

function VehicleFilters({ selected, onChange }) {
  return (
    <div className="vehicle-filters">
      {categories.map(category => (
        <button
          key={category}
          className={selected === category ? "filter active" : "filter"}
          onClick={() => onChange(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
}

function VehicleList({ transportType, onSelectVehicle }) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        const res = await axios.get('http://localhost:5000/api/businesses?category=transportation');
        
        let allVehicles = [];
        res.data.forEach(biz => {
          if (biz.services && biz.services.length > 0) {
            // Parse description for each service to extract metadata
            const parsedServices = biz.services.map(service => {
              let meta = { category: 'Economy', transmission: 'Automatic', seats: 4, transportType: 'ride', desc: '' };
              if (service.description) {
                try {
                  meta = JSON.parse(service.description);
                } catch (e) {
                  meta.desc = service.description;
                }
              }
              return {
                ...service,
                category: meta.category || 'Economy',
                transmission: meta.transmission || 'Automatic',
                seats: meta.seats || 4,
                type: [meta.transportType || 'ride'],
                desc: meta.desc || '',
                businessName: biz.name
              };
            });
            allVehicles = [...allVehicles, ...parsedServices];
          }
        });
        
        // Filter out archived
        setVehicles(allVehicles.filter(v => v.status !== 'ARCHIVED'));
      } catch (err) {
        console.error('Failed to fetch vehicles:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  const filteredVehicles = vehicles.filter(v => {
    const categoryMatch = selectedCategory === "All" || v.category === selectedCategory;
    const typeMatch = v.type && v.type.includes(transportType);
    return categoryMatch && typeMatch;
  });

  return (
    <section className="vehicle-list-section" id="vehicle-list-target">
      <h2>Available Vehicles</h2>
      <VehicleFilters selected={selectedCategory} onChange={setSelectedCategory} />
      
      {loading ? (
        <p style={{ textAlign: 'center', padding: '2rem' }}>Loading vehicles...</p>
      ) : filteredVehicles.length === 0 ? (
        <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
          No vehicles available for this category right now.
        </p>
      ) : (
        <div className="vehicles-grid">
          {filteredVehicles.map(vehicle => (
            <article key={vehicle.id} className="vehicle-card">
              <img 
                src={vehicle.image || "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=500&auto=format&fit=crop&q=60"} 
                alt={vehicle.name} 
              />
              <div className="vehicle-details">
                <div className="v-header">
                  <h3>{vehicle.name}</h3>
                  <span className="v-category">{vehicle.category}</span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '5px 0 10px' }}>
                  by {vehicle.businessName}
                </p>
                <ul className="v-specs">
                  <li>{vehicle.transmission}</li>
                  <li>{vehicle.seats} Seats</li>
                  <li>{vehicle.desc || 'Air Conditioning'}</li>
                </ul>
                <div className="v-footer">
                  <span className="price">{vehicle.price} ETB / day</span>
                  <button className="book-btn" onClick={() => onSelectVehicle(vehicle)}>
                    Book
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default VehicleList;
