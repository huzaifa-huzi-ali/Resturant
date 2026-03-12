import React from 'react';

const PaymentButton = ({ onClick, processing }) => {
  return (
    <button 
      className="payment-button" 
      onClick={onClick}
      disabled={processing}
    >
      {processing ? 'Processing...' : 'Pay Now'}
    </button>
  );
};

export default PaymentButton;
