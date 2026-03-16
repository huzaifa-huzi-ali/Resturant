const cartRepo = require('./cart.repository');
const { toCart } = require('./cart.model');
const { v7: uuidv7 } = require('uuid');

const getCart = async (userId) => {
  const cart = await cartRepo.findOrCreateCart(uuidv7(), userId);
  const items = await cartRepo.findCartItems(cart.id);
  return toCart(cart.id, items);
};

const addItem = async (userId, { menu_item_id, quantity }) => {
  const available = await cartRepo.isMenuItemAvailable(menu_item_id);
  if (!available) {
    const err = new Error('Menu item not found or unavailable');
    err.status = 404;
    throw err;
  }

  const cart = await cartRepo.findOrCreateCart(uuidv7(), userId);
  const existing = await cartRepo.findCartItemByMenuId(cart.id, menu_item_id);

  if (existing) {
    return cartRepo.incrementCartItem(existing.id, quantity);
  }
  return cartRepo.insertCartItem(uuidv7(), cart.id, menu_item_id, quantity);
};

const updateItem = async (userId, itemId, quantity) => {
  const row = await cartRepo.updateCartItemQuantity(itemId, userId, quantity);
  if (!row) {
    const err = new Error('Cart item not found');
    err.status = 404;
    throw err;
  }
  return row;
};

const removeItem = async (userId, itemId) => {
  const deleted = await cartRepo.removeCartItem(itemId, userId);
  if (!deleted) {
    const err = new Error('Cart item not found');
    err.status = 404;
    throw err;
  }
};

module.exports = { getCart, addItem, updateItem, removeItem };
