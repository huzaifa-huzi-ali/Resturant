import api from './api';

const contactService = {
  sendContactMessage: async (contactData) => {
    try {
      const response = await api.post('/contact', contactData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getContactMessages: async () => {
    try {
      const response = await api.get('/contact');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteContactMessage: async (id) => {
    try {
      const response = await api.delete(`/contact/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default contactService;
