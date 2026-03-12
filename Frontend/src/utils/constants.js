export const PAYMENT_METHODS = {
  CREDIT_CARD: 'credit_card',
  DEBIT_CARD: 'debit_card',
  PAYPAL: 'paypal',
  STRIPE: 'stripe',
};

export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PREPARING: 'preparing',
  READY: 'ready',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
};

export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
};

export const API_ENDPOINTS = {
  MENU: '/menu',
  ORDERS: '/orders',
  USERS: '/users',
  PAYMENTS: '/payments',
  CONTACT: '/contact',
};
