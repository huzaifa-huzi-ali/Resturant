const toUserProfile = (user, addresses = []) => {
  if (!user) return null;
  return {
    id: user.id, name: user.name, email: user.email,
    phone: user.phone, role: user.role,
    created_at: user.created_at, updated_at: user.updated_at,
    addresses,
  };
};

module.exports = { toUserProfile };
