const categoryRepo = require('./category.repository');
const { toCategory, toCategoryList } = require('./category.model');

const getAll = async () => {
  const rows = await categoryRepo.findAll();
  return toCategoryList(rows);
};

const getById = async (id) => {
  const row = await categoryRepo.findById(id);
  if (!row) {
    const err = new Error('Category not found');
    err.status = 404;
    throw err;
  }
  return toCategory(row);
};

const create = async (data) => {
  const row = await categoryRepo.create(data);
  return toCategory(row);
};

const update = async (id, data) => {
  const row = await categoryRepo.update(id, data);
  if (!row) {
    const err = new Error('Category not found');
    err.status = 404;
    throw err;
  }
  return toCategory(row);
};

const remove = async (id) => {
  const deleted = await categoryRepo.remove(id);
  if (!deleted) {
    const err = new Error('Category not found');
    err.status = 404;
    throw err;
  }
};

module.exports = { getAll, getById, create, update, remove };
