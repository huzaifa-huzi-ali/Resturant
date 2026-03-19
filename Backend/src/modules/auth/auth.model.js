/**
 * Auth Model — defines the shape of user data for auth operations.
 * Used for structuring responses and documenting expected fields.
 */

/**
 * Format a raw DB user row into a safe public user object (no password_hash).
 */
const toPublicUser = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone || null,
    role: row.role,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
};

module.exports = { toPublicUser };
