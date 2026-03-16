const menuRepo = require('./menu.repository');
const { toMenuItem, toMenuItemList } = require('./menu.model');
const { v7: uuidv7 } = require('uuid');

const getAll = async (filters) => {
  const rows = await menuRepo.findAll(filters);
  return toMenuItemList(rows);
};

const getById = async (id) => {
  const row = await menuRepo.findById(id);
  if (!row) {
    const err = new Error('Menu item not found');
    err.status = 404;
    throw err;
  }
  return toMenuItem(row);
};

const create = async (data) => {
  const row = await menuRepo.create({ id: uuidv7(), ...data });
  return toMenuItem(row);
};

const update = async (id, data) => {
  const row = await menuRepo.update(id, data);
  if (!row) {
    const err = new Error('Menu item not found');
    err.status = 404;
    throw err;
  }
  return toMenuItem(row);
};

const remove = async (id) => {
  const deleted = await menuRepo.remove(id);
  if (!deleted) {
    const err = new Error('Menu item not found');
    err.status = 404;
    throw err;
  }
};

module.exports = { getAll, getById, create, update, remove };
