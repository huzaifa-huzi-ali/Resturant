const toReview = (row) => {
  if (!row) return null;
  return {
    id: row.id, user_id: row.user_id, user_name: row.user_name || undefined,
    menu_item_id: row.menu_item_id, rating: row.rating,
    comment: row.comment, created_at: row.created_at,
  };
};
const toReviewList = (rows) => rows.map(toReview);
module.exports = { toReview, toReviewList };
