const contactRepo = require('./contact.repository');
const { toContactMessage, toContactList } = require('./contact.model');
const { v7: uuidv7 } = require('uuid');

const send = async (data) => {
  const row = await contactRepo.create({ id: uuidv7(), ...data });
  return toContactMessage(row);
};

const getAll = async (limit, offset) => {
  const rows = await contactRepo.findAll(limit, offset);
  return toContactList(rows);
};

const remove = async (id) => {
  const deleted = await contactRepo.remove(id);
  if (!deleted) { const e = new Error('Contact message not found'); e.status = 404; throw e; }
};

module.exports = { send, getAll, remove };
