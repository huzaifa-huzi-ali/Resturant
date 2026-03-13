import React from 'react';

const PaymentSuccess = () => {
  return (
    <div className="page-container">
      <h1>✅ Payment Successful</h1>
      <p>Thank you for your order!</p>
      <div className="section">
        <p>Your order has been confirmed and is being prepared.</p>
        <p>You will receive an email confirmation shortly.</p>
      </div>
    </div>
  );
};

export default PaymentSuccess;
