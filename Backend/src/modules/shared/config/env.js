const dotenv = require('dotenv');
const path = require('path');

// Load .env from Backend root
// Change line 5 to this:
dotenv.config({ path: path.join(__dirname, '..', '..', '..', '..', '..', '.env') });
const env = {
  PORT: parseInt(process.env.PORT, 10) || 5000,
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET || 'dev-secret-change-me',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  BCRYPT_SALT_ROUNDS: parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 10,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || '',
  NODE_ENV: process.env.NODE_ENV || 'development',
};

// Validate required vars
if (!env.DATABASE_URL) {
  console.error('FATAL: DATABASE_URL is not set in .env');
  process.exit(1);
}

module.exports = env;
