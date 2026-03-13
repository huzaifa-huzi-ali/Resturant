import React from 'react';

const Cart = () => {
  return (
    <div className="page-container">
      <h1>🛒 Shopping Cart</h1>
      <div className="empty-state">
        <p>Your cart is empty</p>
        <p>Add items from the menu to get started</p>
      </div>
    </div>
  );
};

export default Cart;
