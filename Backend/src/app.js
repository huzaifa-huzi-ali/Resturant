const express = require('express');
const cors = require('cors');

// Route imports
const authRoutes     = require('./modules/auth/auth.route');
const menuRoutes     = require('./modules/menu/menu.route');
const categoryRoutes = require('./modules/category/category.route');
const cartRoutes     = require('./modules/cart/cart.route');
const orderRoutes    = require('./modules/order/order.route');
const paymentRoutes  = require('./modules/payment/payment.route');
const contactRoutes  = require('./modules/contact/contact.route');
const reviewRoutes   = require('./modules/review/review.route');
const userRoutes     = require('./modules/user/user.route');

// Middleware imports
const { errorHandler } = require('./modules/shared/middleware/error.middleware');

const app = express();

// ── CORS Configuration for Render + Vercel ────────────────────
const allowedOrigins = [
  'http://localhost:3000',                    // Local frontend testing on port 3000
  'http://localhost:5173',                    // Vite default dev port
  'https://project-celia.vercel.app',          // Your Vercel frontend
  'https://project-celia.vercel.app/'          // With trailing slash (just in case)
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));
app.use(express.json());

// ── Health check ───────────────────────────────────────────────
const pool = require('./modules/shared/config/db');

app.get('/api/health', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT NOW() AS server_time');
    res.json({ ok: true, server_time: rows[0].server_time });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// ── API Routes ─────────────────────────────────────────────────
app.use('/api/auth',       authRoutes);
app.use('/api/menu',       menuRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart',       cartRoutes);
app.use('/api/orders',     orderRoutes);
app.use('/api/payments',   paymentRoutes);
app.use('/api/contact',    contactRoutes);
app.use('/api/reviews',    reviewRoutes);
app.use('/api/users',      userRoutes);

// ── 404 handler ────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
});

// ── Global error handler ──────────────────────────────────────
app.use(errorHandler);

module.exports = app;
