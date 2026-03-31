# 🍽️ Restaurant App - Complete Setup Guide

A full-stack restaurant ordering system with React frontend, Express backend, and PostgreSQL database.

## 📋 Project Structure

```
Restaurant/
├── Backend/              # Node.js Express API
│   ├── src/
│   │   ├── modules/     # Feature modules (auth, menu, orders, etc.)
│   │   ├── server.js    # Server entry point
│   │   └── app.js       # Express app setup
│   ├── tests/           # Jest test files
│   ├── package.json     # Dependencies (NEWLY CREATED)
│   └── jest.config.js
├── Frontend/            # React + Vite SPA
│   ├── src/
│   ├── public/
│   ├── package.json     # React dependencies
│   └── vite.config.js
├── database/            # PostgreSQL schema & seeds
│   ├── schema.sql       # Table definitions
│   ├── seeds/           # Initial data
│   └── SETUP.md         # Database setup guide (NEWLY CREATED)
└── .env                 # Environment variables (NEWLY CREATED)
```

## ⚡ Quick Start

### Prerequisites

- **Node.js** v16+ and **npm** v8+
- **PostgreSQL** 12+ (or Supabase account)
- **Redis** 6+ (optional, for caching)
- **Git**

### 1️⃣ Setup Environment

```bash
# Navigate to project root
cd Restaurant

# Copy environment template
cp .env.example .env

# Edit .env with your values
# - DATABASE_URL: Your PostgreSQL connection string
# - JWT_SECRET: Random secret for tokens
# - VITE_GEMINI_API_KEY: Your Gemini AI API key
```

### 2️⃣ Setup Database

```bash
# Follow the database setup guide
cd database
cat SETUP.md
# Then run: psql -U postgres -d restaurant -f schema.sql
# And:     psql -U postgres -d restaurant -f seeds/seed_menu.sql
```

### 3️⃣ Setup Backend

```bash
cd Backend

# Install dependencies
npm install

# Start development server
npm run dev
# Runs on http://localhost:5000

# Health check
curl http://localhost:5000/api/health
```

### 4️⃣ Setup Frontend

```bash
cd Frontend

# Install dependencies
npm install

# Start development server
npm run dev
# Opens at http://localhost:5173
```

## 📁 Recent Changes & Fixes

### ✅ Completed Tasks

1. **Backend/package.json** - Created with all dependencies
   ```json
   {
     "name": "restaurant-backend",
     "version": "1.0.0",
     "dependencies": {
       "express": "^4.18.2",
       "pg": "^8.11.3",
       "redis": "^4.6.12",
       "bcryptjs": "^2.4.3",
       "jsonwebtoken": "^9.1.2",
       // ... more
     }
   }
   ```

2. **Removed Duplicate Config** - Backend/src/modules/config/ removed
   - Kept only: Backend/src/modules/shared/config/
   - All imports already use correct path

3. **Environment Variables**
   - ✅ Created root `.env` file  
   - ✅ Created `.env.example` templates for Frontend, Backend, and root
   - ✅ Added `.env` to `.gitignore`
   - ✅ Fixed Frontend to use `VITE_` prefix (removed `REACT_APP_`)
   - ✅ Gemini API key is protected (not in Git history)

4. **Redis Configuration Enhanced**
   - ✅ Graceful degradation if Redis unavailable
   - ✅ Mock Redis client for fallback
   - ✅ Proper error handling and reconnection logic
   - ✅ Added health checks and monitoring headers
   - ✅ Updated all controllers to use new module structure

5. **Documentation Created**
   - ✅ `database/SETUP.md` - Database setup instructions
   - ✅ `Backend/src/modules/shared/config/REDIS.md` - Redis guide
   - ✅ Root-level environment templates

## 🔧 Configuration Files

### Root `.env` Example

```bash
# Backend
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://postgres:password@localhost:5432/restaurant
JWT_SECRET=your-super-secret-key-here
REDIS_URL=redis://localhost:6379

# Frontend
VITE_API_URL=http://localhost:5000/api
VITE_GEMINI_API_KEY=your-gemini-key-here
```

### .env.example Files

Each folder has a template:
- `Frontend/.env.example` - Frontend variables
- `Backend/.env.example` - Backend variables  
- `.env.example` - Root example

## 📦 Dependencies

### Backend (newly defined in package.json)

**Core**:
- `express` - Web framework
- `cors` - Cross-origin requests
- `dotenv` - Environment variables

**Database**:
- `pg` - PostgreSQL client
- `redis` - Redis client

**Security**:
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT tokens
- `express-rate-limit` - Rate limiting

**Utilities**:
- `uuidv7` - UUID generation
- `nodemailer` - Email sending

**Development**:
- `nodemon` - Auto-reload
- `jest` - Testing framework
- `supertest` - HTTP testing
- `eslint` - Linting

### Frontend

**UI**:
- `react` ^18.2.0
- `react-router-dom` ^6.0.0
- `framer-motion` - Animations

**API**:
- `axios` - HTTP client

**AI**:
- `@google/generative-ai` - Gemini API

**Build**:
- `vite` - Build tool
- `eslint` - Linting

## 🐘 PostgreSQL

Tables created by schema.sql:
- `users` - User accounts
- `addresses` - Delivery addresses
- `categories` - Menu categories
- `menu_items` - Food items
- `carts` - Shopping carts
- `cart_items` - Cart contents
- `orders` - Customer orders
- `order_items` - Order line items
- `reviews` - Item reviews
- `payments` - Payment records
- `contact_messages` - Contact form data
- `order_status_history` - Order tracking
- `coupons` - Discount codes

**Connections**:
- FK constraints with CASCADE delete
- Proper indexes on foreign keys
- CHECK constraints on status columns
- Auto-update triggers for timestamps

## 🚀 Running Tests

```bash
# Backend tests
cd Backend
npm test

# Watch mode
npm run test:watch

# Frontend tests (if configured)
cd Frontend
npm test
```

## 🐛 Troubleshooting

### Backend Won't Start

```bash
# Check if port 5000 is in use
lsof -i :5000  # macOS/Linux

# Kill the process
kill -9 <PID>

# Or use different port
PORT=3001 npm run dev
```

### Database Connection Failed

```bash
# Verify PostgreSQL is running
psql -U postgres -c "SELECT version();"

# Check DATABASE_URL in .env
echo $DATABASE_URL

# Test connection
psql $DATABASE_URL

# Recreate database if corrupted
psql -U postgres
DROP DATABASE IF EXISTS restaurant;
CREATE DATABASE restaurant;
\q
psql -U postgres -d restaurant -f database/schema.sql
```

### Redis Connection Issues

```bash
# Not required for app, but recommended for performance
# App will work without Redis (with graceful fallback)

# Start Redis
redis-server

# Test connection
redis-cli ping
# Should return: PONG
```

### Frontend API Errors

```bash
# Check VITE_API_URL in Frontend/.env
# Should match your backend URL

# Check CORS settings in Backend src/app.js
# Default allows all origins

# Test backend health
curl http://localhost:5000/api/health
```

## 📊 Health Checks

```bash
# Backend health
curl http://localhost:5000/api/health
# Response: { "ok": true, "server_time": "..." }

# Redis status (included in startup logs)
# Check: ✅ Connected to Redis cache
# or:    ⚠️ Using mock Redis client (no-op caching)
```

## 🔐 Security Notes

- ✅ `.env` files are git-ignored (secrets safe)
- ✅ Passwords are bcrypt hashed
- ✅ JWT tokens use secret key
- ✅ CORS properly configured
- ✅ Rate limiting on auth endpoints
- ✅ API key (Gemini) protected in .env

## 📚 API Documentation

### Auth Endpoints
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login

### Menu Endpoints
- `GET /api/menu` - Get all items
- `GET /api/categories` - Get categories

### Order Endpoints
- `POST /api/orders` - Create order
- `GET /api/orders/:id` - Get order details

### Cart Endpoints
- `GET /api/cart` - Get cart
- `POST /api/cart/items` - Add item
- `DELETE /api/cart/items/:id` - Remove item

For more details, check individual module documentation.

## 🎨 Frontend Features

- ✨ Dark theme with gold accents
- 🎬 Smooth animations (Framer Motion)
- 📱 Mobile responsive (480px+)
- 🔐 Secure authentication
- 🛒 Shopping cart with localStorage
- 💳 Payment integration (Stripe)
- 🤖 AI Chatbot (Gemini)
- ⭐ Product reviews and ratings

## 📝 Environment Setup Checklist

- [ ] Node.js v16+ installed
- [ ] PostgreSQL 12+ installed
- [ ] Redis installed (optional)
- [ ] Git repository cloned
- [ ] Root `.env` created from `.env.example`
- [ ] Database created and seeded
- [ ] Backend dependencies installed
- [ ] Frontend dependencies installed
- [ ] Backend running on port 5000
- [ ] Frontend running on port 5173

## 🆘 Getting Help

Check these files for detailed guidance:
- `database/SETUP.md` - Database setup
- `Backend/src/modules/shared/config/REDIS.md` - Redis configuration
- `Frontend/README.md` - Frontend details
- Individual module folders - Feature docs

## 📄 License

MIT

## ✨ Next Steps

1. ✅ Setup complete! Your app is ready to develop
2. Create your first order flow
3. Add payment processing (Stripe)
4. Deploy to production

Happy coding! 🚀
