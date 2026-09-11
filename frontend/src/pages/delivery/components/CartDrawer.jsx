import React from "react";

function CartDrawer({ cart }) {
  const calculateCart = (cartItems) => {
    const subtotal = cartItems.reduce(
      (total, item) => total + item.price * (item.quantity || 1),
      0
    );
    const deliveryFee = 50;
    const serviceFee = subtotal * 0.03;

    return {
      subtotal,
      deliveryFee,
      serviceFee,
      total: subtotal + deliveryFee + serviceFee,
    };
  };

  const { subtotal, deliveryFee, serviceFee, total } = calculateCart(cart);

  return (
    <div className="cart-drawer">
      <div className="cart-header">
        <h3>Your Cart</h3>
        <span className="cart-count">{cart.length} items</span>
      </div>

      <div className="cart-items">
        {cart.map((item, index) => (
          <div key={`${item.id}-${index}`} className="cart-item">
            <img src={item.image} alt={item.name} />
            <div className="cart-item-info">
              <h4>{item.name}</h4>
              <p>{item.price} ETB</p>
            </div>
            <div className="cart-item-qty">
              <span>{item.quantity || 1}x</span>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <div className="summary-row">
          <span>Subtotal</span>
          <span>{subtotal.toFixed(2)} ETB</span>
        </div>
        <div className="summary-row">
          <span>Delivery Fee</span>
          <span>{deliveryFee.toFixed(2)} ETB</span>
        </div>
        <div className="summary-row">
          <span>Service Fee</span>
          <span>{serviceFee.toFixed(2)} ETB</span>
        </div>
        <div className="summary-row total">
          <span>Total</span>
          <span>{total.toFixed(2)} ETB</span>
        </div>
      </div>

      <button className="checkout-btn">Proceed to Checkout</button>
    </div>
  );
}

export default CartDrawer;
