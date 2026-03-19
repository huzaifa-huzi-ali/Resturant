const userRepo = require('./user.repository');
const { toUserProfile } = require('./user.model');
const { hashPassword } = require('../shared/utils/hashpassword');

const getProfile = async (userId) => {
  const user = await userRepo.findById(userId);
  if (!user) { const e = new Error('User not found'); e.status = 404; throw e; }
  const addresses = await userRepo.findAddresses(userId);
  return toUserProfile(user, addresses);
};

const updateProfile = async (userId, { name, phone, password }) => {
  const fields = {};
  if (name) fields.name = name;
  if (phone) fields.phone = phone;
  if (password) fields.password_hash = await hashPassword(password);

  if (Object.keys(fields).length === 0) {
    const e = new Error('No fields to update'); e.status = 400; throw e;
  }

  const row = await userRepo.update(userId, fields);
  return row;
};

module.exports = { getProfile, updateProfile };
