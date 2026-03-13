import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCartContext } from '../../context/CartContext';
import './Checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, getTotalPrice, clearCart } = useCartContext();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    instructions: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Email regex validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Phone regex - at least 10 digits
  const phoneRegex = /^\d{10,}$/;

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email';
    }

    // Phone validation
    if (!formData.phone) {
      newErrors.phone = 'Phone is required';
    }
    const phoneDigitsOnly = formData.phone.replace(/\D/g, '');
    if (phoneDigitsOnly.length < 10) {
      newErrors.phone = 'Phone must be at least 10 digits';
    }

    // Address validation
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    } else if (formData.address.trim().length < 10) {
      newErrors.address = 'Address must be at least 10 characters';
    }

    // Instructions is optional, no validation needed

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Log order data
    console.log('Order submitted:', {
      ...formData,
      cartItems: cart,
      total: getTotalPrice(),
    });

    // Simulate processing
    setTimeout(() => {
      setIsSubmitting(false);
      clearCart();
      alert('Order placed successfully! The kitchen is preparing your meal.');
      navigate('/');
    }, 1500);
  };

  // If cart is empty, show fallback UI
  if (cart.length === 0) {
    return (
      <div className="checkout-page">
        <motion.div
          className="empty-cart-message"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2>Your cart is empty</h2>
          <p>Please add items from the menu before checking out.</p>
          <Link to="/menu" className="primary-btn">
            Continue Shopping
          </Link>
        </motion.div>
      </div>
    );
  }

  const subtotal = getTotalPrice();
  const taxesAndFees = subtotal * 0.1; // 10% taxes and fees
  const total = subtotal + taxesAndFees;

  return (
    <motion.div
      className="checkout-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="checkout-container">
        <h1 className="checkout-title">Complete Your Order</h1>

        <div className="checkout-grid">
          {/* Left Column - Form */}
          <div className="checkout-form-container">
            <form onSubmit={handleSubmit} className="checkout-form">
              <div className="form-section">
                <h3 className="form-section-title">Delivery Information</h3>

                {/* Name Input */}
                <div className="form-group">
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`checkout-input ${errors.name ? 'input-error' : ''}`}
                  />
                  {errors.name && <span className="error-text">{errors.name}</span>}
                </div>

                {/* Email Input */}
                <div className="form-group">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    className={`checkout-input ${errors.email ? 'input-error' : ''}`}
                  />
                  {errors.email && <span className="error-text">{errors.email}</span>}
                </div>

                {/* Phone Input */}
                <div className="form-group">
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`checkout-input ${errors.phone ? 'input-error' : ''}`}
                  />
                  {errors.phone && <span className="error-text">{errors.phone}</span>}
                </div>

                {/* Address Input */}
                <div className="form-group">
                  <input
                    type="text"
                    name="address"
                    placeholder="Delivery Address"
                    value={formData.address}
                    onChange={handleChange}
                    className={`checkout-input ${errors.address ? 'input-error' : ''}`}
                  />
                  {errors.address && <span className="error-text">{errors.address}</span>}
                </div>
              </div>

              <div className="form-section">
                <h3 className="form-section-title">Special Instructions</h3>

                {/* Instructions Input */}
                <div className="form-group">
                  <textarea
                    name="instructions"
                    placeholder="Dietary restrictions, allergies, or special requests..."
                    value={formData.instructions}
                    onChange={handleChange}
                    className="checkout-input checkout-textarea"
                    rows="4"
                  ></textarea>
                </div>
              </div>
            </form>
          </div>

          {/* Right Column - Order Summary (Sticky) */}
          <div className="order-summary-container">
            <div className="order-summary">
              <h3 className="summary-title">Order Summary</h3>

              {/* Cart Items */}
              <div className="cart-items-list">
                {cart.map((item) => {
                  // Force the price to a string, strip any $ or letters, and convert to a number
                  const numericPrice = parseFloat(String(item.price).replace(/[^0-9.]/g, '')) || 0;
                  const itemTotal = numericPrice * item.quantity;
                  return (
                    <div key={item.id} className="summary-item">
                      <span className="item-quantity">{item.quantity}x</span>
                      <span className="item-name">{item.title}</span>
                      <span className="item-unit-price">@ ${numericPrice.toFixed(2)}</span>
                      <span className="item-dots">...</span>
                      <span className="item-price">${itemTotal.toFixed(2)}</span>
                    </div>
                  );
                })}
              </div>

              <div className="summary-divider"></div>

              {/* Subtotal */}
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              {/* Taxes & Fees */}
              <div className="summary-row">
                <span>Taxes & Fees</span>
                <span>${taxesAndFees.toFixed(2)}</span>
              </div>

              <div className="summary-divider"></div>

              {/* Total */}
              <div className="summary-total">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="primary-btn checkout-btn"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing...' : 'Proceed to Payment'}
              </button>

              {/* Back to Menu Link */}
              <Link to="/menu" className="back-link">
                ← Back to Menu
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Checkout;
