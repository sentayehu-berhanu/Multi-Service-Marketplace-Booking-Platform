import React from "react";

function ProductCard({ product, onAdd }) {
  return (
    <article className="product-card">
      <img src={product.image} alt={product.name} />
      <div className="product-content">
        <h3>{product.name}</h3>
        <p className="product-store">{product.store}</p>
        <div className="product-footer">
          <strong>{product.price} ETB</strong>
          <div className="product-rating">⭐ {product.rating}</div>
        </div>
        <button onClick={() => onAdd(product)} className="add-to-cart-btn">
          Add to Cart
        </button>
      </div>
    </article>
  );
}

export default ProductCard;
