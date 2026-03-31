import axios from 'axios';
import { STORAGE_KEYS } from '../config';

// Determine API base URL based on environment
const API_BASE_URL = import.meta.env.PROD 
  ? 'https://celia-lfzn.onrender.com/api'  // Production Render backend
  : (import.meta.env.VITE_API_URL || 'http://localhost:5000/api');  // Local development

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Add interceptor for auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_KEYS.USER_TOKEN);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(STORAGE_KEYS.USER_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    }
    return Promise.reject(error);
  }
);

export default api;
