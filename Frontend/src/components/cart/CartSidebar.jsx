import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCartContext } from '../../context/CartContext';
import './Cart.css';

const CartSidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, getTotalPrice } = useCartContext();

  const subtotal = getTotalPrice();

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="cart-overlay"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="cart-sidebar"
          >
            {/* Header */}
            <div className="cart-header">
              <h2>Your Order</h2>
              <button onClick={onClose} className="close-btn" aria-label="Close cart">
                ✕
              </button>
            </div>

            {/* Body - Scrollable Items */}
            <div className="cart-body">
              {cart.length === 0 ? (
                <div className="cart-empty">
                  <p>Your table is currently empty.</p>
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {cart.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                      className="cart-item-minimalist"
                    >
                      {/* Top Row: Name and Price */}
                      <div className="item-top-row">
                        <h4 className="item-name-minimal">{item.title}</h4>
                        <span className="item-price-minimal">{item.price}</span>
                      </div>

                      {/* Bottom Row: Quantity Controls and Remove */}
                      <div className="item-bottom-row">
                        <div className="quantity-stepper">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="stepper-btn"
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <span className="stepper-qty">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="stepper-btn"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="remove-btn-minimal"
                          aria-label="Remove item"
                        >
                          Remove
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer - Sticky */}
            {cart.length > 0 && (
              <div className="cart-footer-minimal">
                <div className="subtotal-row">
                  <span className="subtotal-label">Subtotal</span>
                  <span className="subtotal-price">${subtotal.toFixed(2)}</span>
                </div>
                <button 
                  onClick={handleCheckout}
                  className="checkout-btn-minimal"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartSidebar;
