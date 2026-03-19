const toPayment = (row) => {
  if (!row) return null;
  const p = { ...row };
  if (p.amount) p.amount = parseFloat(p.amount);
  delete p.user_id; // don't leak join fields
  return p;
};

module.exports = { toPayment };
