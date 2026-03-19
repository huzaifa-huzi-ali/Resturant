const toOrder = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    user_id: row.user_id,
    address_id: row.address_id,
    total_price: parseFloat(row.total_price),
    order_status: row.order_status,
    payment_status: row.payment_status,
    customer_note: row.customer_note,
    customer_name: row.customer_name || undefined,
    customer_email: row.customer_email || undefined,
    items: row.items || [],
    created_at: row.created_at,
  };
};

const toOrderList = (rows) => rows.map(toOrder);

module.exports = { toOrder, toOrderList };
