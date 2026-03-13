import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCartContext } from '../../context/CartContext';
import './Navbar.css';

const Navbar = ({ onCartClick }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { getTotalItems } = useCartContext();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;
  const totalItems = getTotalItems();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Célia
        </Link>
        
        <div className={`navbar-menu ${isMobileOpen ? 'active' : ''}`}>
          <Link 
            to="/" 
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
            onClick={() => setIsMobileOpen(false)}
          >
            Home
          </Link>
          <Link 
            to="/menu" 
            className={`nav-link ${isActive('/menu') ? 'active' : ''}`}
            onClick={() => setIsMobileOpen(false)}
          >
            Menu
          </Link>
          <Link 
            to="/about" 
            className={`nav-link ${isActive('/about') ? 'active' : ''}`}
            onClick={() => setIsMobileOpen(false)}
          >
            About
          </Link>
          <Link 
            to="/contact" 
            className={`nav-link ${isActive('/contact') ? 'active' : ''}`}
            onClick={() => setIsMobileOpen(false)}
          >
            Contact
          </Link>
          <Link 
            to="/menu" 
            className={`nav-link-btn order-btn ${isActive('/menu') ? 'active' : ''}`}
            onClick={() => setIsMobileOpen(false)}
          >
            Order Now
          </Link>
        </div>

        {/* Cart Icon */}
        <button 
          className="cart-icon-btn" 
          onClick={onCartClick}
          aria-label="Open cart"
        >
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          {totalItems > 0 && (
            <span className="cart-badge">{totalItems}</span>
          )}
        </button>

        <div className="hamburger" onClick={() => setIsMobileOpen(!isMobileOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
