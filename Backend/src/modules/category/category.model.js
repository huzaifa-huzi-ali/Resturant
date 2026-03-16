const toCategory = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    created_at: row.created_at,
  };
};

const toCategoryList = (rows) => rows.map(toCategory);

module.exports = { toCategory, toCategoryList };
