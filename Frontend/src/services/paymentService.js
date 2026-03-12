import api from './api';

const paymentService = {
  initiatePayment: async (paymentData) => {
    try {
      const response = await api.post('/payments/initiate', paymentData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  confirmPayment: async (paymentId, confirmData) => {
    try {
      const response = await api.post(`/payments/confirm/${paymentId}`, confirmData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getPaymentStatus: async (paymentId) => {
    try {
      const response = await api.get(`/payments/status/${paymentId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  cancelPayment: async (paymentId) => {
    try {
      const response = await api.post(`/payments/cancel/${paymentId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default paymentService;
