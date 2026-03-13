import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import ScrollToTop from './components/common/ScrollToTop';
import CartSidebar from './components/cart/CartSidebar';
import AppRoutes from './routes/AppRoutes';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import './assets/styles/global.css';
import './assets/styles/variables.css';
import './App.css';

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  const toggleCart = () => {
    setIsCartOpen((prev) => !prev);
  };

  const closeCart = () => {
    setIsCartOpen(false);
  };

  return (
    <Router>
      <ScrollToTop />
      <AuthProvider>
        <CartProvider>
          <Navbar onCartClick={toggleCart} />
          <CartSidebar isOpen={isCartOpen} onClose={closeCart} />
          <div className="app-container">
            <AppRoutes />
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
