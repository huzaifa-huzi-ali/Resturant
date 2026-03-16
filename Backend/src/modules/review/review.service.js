const reviewRepo = require('./review.repository');
const { toReview, toReviewList } = require('./review.model');
const { v7: uuidv7 } = require('uuid');

const createReview = async (userId, { menu_item_id, rating, comment }) => {
  if (!(await reviewRepo.menuItemExists(menu_item_id))) {
    const e = new Error('Menu item not found'); e.status = 404; throw e;
  }
  if (await reviewRepo.findExisting(userId, menu_item_id)) {
    const e = new Error('You have already reviewed this item'); e.status = 409; throw e;
  }
  const row = await reviewRepo.create({ id: uuidv7(), userId, menuItemId: menu_item_id, rating, comment });
  return toReview(row);
};

const getByMenuItem = async (menuItemId) => {
  const rows = await reviewRepo.findByMenuItemId(menuItemId);
  return toReviewList(rows);
};

const deleteReview = async (id, user) => {
  const deleted = await reviewRepo.remove(id, user.id, user.role === 'admin');
  if (!deleted) { const e = new Error('Review not found'); e.status = 404; throw e; }
};

module.exports = { createReview, getByMenuItem, deleteReview };
