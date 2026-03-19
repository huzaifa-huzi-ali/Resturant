/**
 * Menu Item Model — transforms raw DB rows into structured menu item objects.
 */

const toMenuItem = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    category_id: row.category_id,
    category_name: row.category_name || null,
    name: row.name,
    description: row.description,
    price: parseFloat(row.price),
    image_url: row.image_url,
    is_available: row.is_available,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
};

const toMenuItemList = (rows) => rows.map(toMenuItem);

module.exports = { toMenuItem, toMenuItemList };
