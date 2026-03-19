// Configuration file
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  TIMEOUT: 10000,
};

export const APP_CONFIG = {
  APP_NAME: 'Restaurant',
  VERSION: '1.0.0',
  ENVIRONMENT: import.meta.env.MODE || 'development',
};

export const STORAGE_KEYS = {
  USER_TOKEN: 'user_token',
  USER_DATA: 'user_data',
  CART_ITEMS: 'cart_items',
};
