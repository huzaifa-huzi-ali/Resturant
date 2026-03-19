const dotenv = require('dotenv');
const path = require('path');

// Load .env from project root (assuming Resturant/.env)
dotenv.config({ path: path.join(__dirname, '..', '..', '..', '..', '.env') });

const env = {
  PORT: parseInt(process.env.PORT, 10) || 5000,
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET || 'dev-secret-change-me',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  BCRYPT_SALT_ROUNDS: parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 10,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || '',
  NODE_ENV: process.env.NODE_ENV || 'development',
  SMTP_HOST: process.env.SMTP_HOST || 'smtp.gmail.com',
  SMTP_PORT: parseInt(process.env.SMTP_PORT, 10) || 587,
  SMTP_SECURE: process.env.SMTP_SECURE === 'true',
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  EMAIL_FROM: process.env.EMAIL_FROM || '"Restaurant App" <no-reply@restaurant.com>'
};

// Validate required vars
if (!env.DATABASE_URL) {
  console.error('FATAL: DATABASE_URL is not set in .env');
  process.exit(1);
}

module.exports = env;
