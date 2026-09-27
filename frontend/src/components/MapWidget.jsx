import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Link } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in react-leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
});

L.Marker.prototype.options.icon = DefaultIcon;

const MapWidget = ({ businesses = [], height = '400px' }) => {
  // Filter out businesses without valid coordinates
  const validBusinesses = businesses.filter(b => b.location_lat != null && b.location_lng != null);

  // Default to Addis Ababa if no valid businesses
  const defaultCenter = [9.0054, 38.7636]; 
  const center = validBusinesses.length > 0 
    ? [validBusinesses[0].location_lat, validBusinesses[0].location_lng] 
    : defaultCenter;

  return (
    <div style={{ height: height, width: '100%', borderRadius: '15px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)' }}>
      <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
        {/* Using standard OpenStreetMap tiles with CSS inversion for dark mode */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="dark-map-tiles"
        />
        {validBusinesses.map(biz => (
          <Marker key={biz.id} position={[biz.location_lat, biz.location_lng]}>
            <Popup>
              <div style={{ textAlign: 'center', color: '#333', minWidth: '160px' }}>
                <div style={{
                  width: '100%',
                  height: '120px',
                  backgroundImage: `url(${biz.cover_image || biz.image || biz.logo || 'https://images.unsplash.com/photo-1556761175-5973dc0f32d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  borderRadius: '8px',
                  marginBottom: '10px',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                }}></div>
                <h4 style={{ margin: '0 0 5px 0', fontSize: '1rem' }}>{biz.name}</h4>
                <p style={{ margin: '0 0 10px 0', fontSize: '0.85rem', color: '#666' }}>{biz.address || 'Address not available'}</p>
                <Link to={`/business/${biz.id}`} style={{ display: 'inline-block', width: '100%', padding: '6px 0', background: '#2563eb', color: 'white', textDecoration: 'none', borderRadius: '5px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                  View Business
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapWidget;
