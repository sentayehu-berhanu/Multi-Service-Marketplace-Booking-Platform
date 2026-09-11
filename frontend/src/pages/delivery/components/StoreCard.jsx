import React from "react";

function StoreCard({ store, onClick }) {
  return (
    <article className="store-card" onClick={onClick}>
      <img src={store.image} alt={store.name} />
      <div className="store-content">
        <h3>{store.name}</h3>
        <p>{store.category}</p>
        <div className="store-rating">⭐ {store.rating}</div>
        <small>🚴 Delivery in {store.deliveryTime} min</small>
        <small>Delivery fee from {store.deliveryFee} ETB</small>
        <button className="order-btn">Order Now</button>
      </div>
    </article>
  );
}

export default StoreCard;
