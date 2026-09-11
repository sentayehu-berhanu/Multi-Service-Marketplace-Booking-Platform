import React, { useState, useEffect } from "react";
import axios from 'axios';
import EventsHero from "./components/EventsHero";
import EventCategories from "./components/EventCategories";
import EventCard from "./components/EventCard";
import { events as mockEvents } from "./data/events";

import "./Events.css";

function Events() {
  const [category, setCategory] = useState("concert");
  const [events, setEvents] = useState(mockEvents);

  useEffect(() => {
    fetchRealEvents();
  }, []);

  const fetchRealEvents = async () => {
    try {
      // Find all events-tickets businesses
      const bizRes = await axios.get('http://localhost:5000/api/businesses?category=events-tickets');
      if (bizRes.data && bizRes.data.length > 0) {
        const allEvents = [];
        
        // Use Promise.all to fetch events for all event businesses concurrently
        await Promise.all(bizRes.data.map(async (biz) => {
          try {
            const eventRes = await axios.get(`http://localhost:5000/api/events?businessId=${biz.id}`);
            if (eventRes.data && eventRes.data.length > 0) {
              const formattedEvents = eventRes.data.map(evt => ({
                ...evt,
                image: evt.image?.startsWith('/uploads') ? `http://localhost:5000${evt.image}` : evt.image
              }));
              allEvents.push(...formattedEvents);
            }
          } catch (e) {
            console.error(`Failed to fetch events for business ${biz.id}`, e);
          }
        }));

        if (allEvents.length > 0) {
          setEvents([...mockEvents, ...allEvents]);
        }
      }
    } catch (err) {
      console.error('Failed to fetch events:', err);
    }
  };

  const filteredEvents = events.filter(event => {
    const eventCat = event.category.toLowerCase();
    const selectedCat = category.toLowerCase();
    
    // Map event categories to UI categories
    if (selectedCat === 'concert' && eventCat === 'music') return true;
    if (selectedCat === 'other') {
      return !['music', 'concert', 'festival', 'sports', 'theater', 'comedy', 'business'].includes(eventCat);
    }
    return eventCat === selectedCat || eventCat.includes(selectedCat) || selectedCat.includes(eventCat);
  });

  return (
    <div className="events-page">
      <EventsHero />

      <div className="events-content-container">
        <EventCategories selected={category} onSelect={setCategory} />

        <section className="events-section">
          <div className="section-header">
            <h2>Upcoming Events</h2>
            <button className="view-all-btn">View All</button>
          </div>
          {filteredEvents.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', background: '#f8fafc', borderRadius: '15px' }}>
              <p style={{ color: '#64748b' }}>No events found for this category.</p>
            </div>
          ) : (
            <div className="event-grid">
              {filteredEvents.map((event) => (
                <EventCard 
                  key={event.id} 
                  event={event} 
                  onSelect={(evt) => console.log("Selected event:", evt)} 
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default Events;
