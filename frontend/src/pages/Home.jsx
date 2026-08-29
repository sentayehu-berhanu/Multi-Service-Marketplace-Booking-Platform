import React from 'react';

const Home = () => {
  return (
    <div className="home">
      <section className="hero">
        <h1>Find and Book Local Services</h1>
        <p>Your all-in-one platform for salons, clinics, repair, and more.</p>
        <div className="search-bar">
          <input type="text" placeholder="Search businesses, services..." />
          <button>Search</button>
        </div>
      </section>
      
      <section className="categories">
        <h2>What are you looking for?</h2>
        <div className="category-grid">
          <div className="category-card">💈 Barber</div>
          <div className="category-card">💇‍♀️ Salon</div>
          <div className="category-card">💄 Cosmetics</div>
          <div className="category-card">🅿️ Parking</div>
        </div>
      </section>
    </div>
  );
};

export default Home;
