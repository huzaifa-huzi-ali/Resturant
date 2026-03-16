const toContactMessage = (row) => {
  if (!row) return null;
  return { id: row.id, name: row.name, email: row.email, message: row.message, created_at: row.created_at };
};
const toContactList = (rows) => rows.map(toContactMessage);
module.exports = { toContactMessage, toContactList };
