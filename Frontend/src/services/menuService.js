import api from './api';

const menuService = {
  getAllMenuItems: async () => {
    try {
      const response = await api.get('/menu');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getMenuItemById: async (id) => {
    try {
      const response = await api.get(`/menu/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createMenuItem: async (menuData) => {
    try {
      const response = await api.post('/menu', menuData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateMenuItem: async (id, menuData) => {
    try {
      const response = await api.put(`/menu/${id}`, menuData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteMenuItem: async (id) => {
    try {
      const response = await api.delete(`/menu/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default menuService;
