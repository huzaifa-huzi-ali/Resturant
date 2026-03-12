import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

// Pages
import Home from '../pages/Home/Home';
import About from '../pages/About/About';
import Menu from '../pages/Menu/Menu';
import Cart from '../pages/Cart/Cart';
import Checkout from '../pages/Checkout/Checkout';
import Contact from '../pages/Contact/Contact';
import PaymentSuccess from '../pages/Payment/PaymentSuccess';
import PaymentCancel from '../pages/Payment/PaymentCancel';
import AdminLogin from '../pages/Admin/AdminLogin';
import Dashboard from '../pages/Admin/Dashboard';
import Orders from '../pages/Admin/Orders';
import ManageMenu from '../pages/Admin/ManageMenu';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/menu" element={<Menu />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/payment/success" element={<PaymentSuccess />} />
      <Route path="/payment/cancel" element={<PaymentCancel />} />
      
      {/* Admin Routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/admin/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
      <Route path="/admin/menu" element={<ProtectedRoute><ManageMenu /></ProtectedRoute>} />
    </Routes>
  );
};

export default AppRoutes;
