# Database Setup Guide

This guide explains how to set up the PostgreSQL database for the Restaurant application.

## Prerequisites

- **PostgreSQL** 12 or higher installed
- **psql** command-line tool available
- `.env` file configured with `DATABASE_URL`

## Option 1: Using PostgreSQL Command Line (Recommended)

### Step 1: Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# In psql terminal, create the database
CREATE DATABASE restaurant;

# Exit psql
\q
```

### Step 2: Run Schema

```bash
# From project root directory
psql -U postgres -d restaurant -f database/schema.sql
```

### Step 3: Seed Initial Data

```bash
# From project root directory
psql -U postgres -d restaurant -f database/seeds/seed_menu.sql
```

### Step 4: Verify Setup

```bash
# Connect to the database
psql -U postgres -d restaurant

# Check tables were created
\dt

# Count records in a few tables
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM menu_items;
SELECT COUNT(*) FROM categories;

# Exit
\q
```

## Option 2: Using Node.js Setup Script (Skip if using Option 1)

If you have Node.js installed, you can use an automated setup:

```bash
cd Backend
npm install
node scripts/setup-db.js
```

## Verifying the Installation

Test your database connection with the health check endpoint:

```bash
# Start Backend server
cd Backend
npm run dev

# In another terminal, test the health endpoint
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "ok": true,
  "server_time": "2024-01-20T10:30:45.123Z"
}
```

## Sample Data

The seed file (`database/seeds/seed_menu.sql`) includes:

- **Categories**: 5 categories (American, Italian, Tex-Mex, Desserts, Beverages)
- **Users**: 5 test users (4 customers + 1 admin)
- **Menu Items**: 10 menu items with prices and images
- **Orders**: 3 sample orders with items
- **Payments**: Sample payment records
- **Reviews**: Test reviews and ratings
- **Coupons**: 2 test coupons (WELCOME10, FREESHIP25)

### Test User Credentials

```
Email: emma.johnson@example.com
Password: password (bcrypt hashed)
Role: customer

Email: liam.martinez@example.com
Password: password (bcrypt hashed)
Role: admin
```

## Environment Variables

Make sure your `.env` file has:

```
DATABASE_URL=postgresql://postgres:password@localhost:5432/restaurant
NODE_ENV=development
```

## Schema Overview

| Table | Purpose |
|-------|---------|
| `users` | User accounts (customers & admins) |
| `addresses` | Delivery addresses |
| `categories` | Menu categories |
| `menu_items` | Food items available |
| `carts` | Shopping carts |
| `cart_items` | Items in carts |
| `orders` | Customer orders |
| `order_items` | Items in orders |
| `reviews` | Menu item reviews |
| `payments` | Payment records (Stripe integration) |
| `contact_messages` | Contact form submissions |
| `order_status_history` | Order status tracking |
| `coupons` | Discount codes |

## Database Relationships

- Users → Addresses (one-to-many)
- Users → Carts (one-to-one)
- Users → Orders (one-to-many)
- Users → Reviews (one-to-many)
- Categories → Menu Items (one-to-many)
- Menu Items → Cart Items (one-to-many)
- Menu Items → Order Items (one-to-many)
- Menu Items → Reviews (one-to-many)
- Orders → Order Items (one-to-many)
- Orders → Payments (one-to-one)
- Orders → Order Status History (one-to-many)

## Common Issues

### Issue: "FATAL: database 'restaurant' does not exist"

**Solution**: Create the database first:
```bash
psql -U postgres
CREATE DATABASE restaurant;
\q
```

### Issue: "FATAL: role 'postgres' does not exist"

**Solution**: Check your PostgreSQL installation and verify the superuser name:
```bash
psql -U [your-username] -d postgres
```

### Issue: "ERROR: UNIQUE violation on email"

**Solution**: This happens when seeding multiple times. Use the `ON CONFLICT` clauses which are already in the seed file, or delete and recreate the database:
```bash
psql -U postgres
DROP DATABASE IF EXISTS restaurant;
CREATE DATABASE restaurant;
\q
psql -U postgres -d restaurant -f database/schema.sql
psql -U postgres -d restaurant -f database/seeds/seed_menu.sql
```

### Issue: "permission denied for schema public"

**Solution**: Make sure you're connected as the database owner. Re-run the schema with the correct user.

## Resetting the Database

To completely reset and start fresh:

```bash
# Connect to postgres (not restaurant db)
psql -U postgres

# Drop and recreate
DROP DATABASE IF EXISTS restaurant;
CREATE DATABASE restaurant;

\q

# Re-run setup
psql -U postgres -d restaurant -f database/schema.sql
psql -U postgres -d restaurant -f database/seeds/seed_menu.sql
```

## Next Steps

1. Install Backend dependencies: `cd Backend && npm install`
2. Start the Backend server: `npm run dev`
3. Verify health check: `curl http://localhost:5000/api/health`
4. Install Frontend dependencies: `cd Frontend && npm install`
5. Start Frontend dev server: `npm run dev`

## Backup

To backup your database:

```bash
pg_dump -U postgres -d restaurant > backup_restaurant_$(date +%Y%m%d_%H%M%S).sql
```

To restore from backup:

```bash
psql -U postgres -d restaurant < backup_restaurant_20240120_101530.sql
```

## Additional Resources

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Supabase Docs](https://supabase.com/docs) (if using managed hosting)
- [Schema Design](database/schema.sql)
- [Seed Data](database/seeds/seed_menu.sql)
