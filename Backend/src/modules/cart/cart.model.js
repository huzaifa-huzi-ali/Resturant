const toCartItem = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    menu_item_id: row.menu_item_id,
    quantity: row.quantity,
    name: row.name || null,
    price: row.price ? parseFloat(row.price) : null,
    image_url: row.image_url || null,
    description: row.description || null,
    created_at: row.created_at,
  };
};

const toCart = (cartId, rows) => ({
  cart_id: cartId,
  items: rows.map(toCartItem),
});

module.exports = { toCartItem, toCart };
