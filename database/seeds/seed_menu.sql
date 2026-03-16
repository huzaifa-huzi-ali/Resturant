-- =============================================================
-- restaurant_seed_rls.sql  –  PostgreSQL (Supabase-compatible)
-- Corrections applied:
--   1. is_app_admin() marked SECURITY DEFINER so RLS on users
--      table does not block admin policy evaluation on other tables
--   2. FREESHIP25 coupon: discount_percentage corrected to 0 with
--      is_free_shipping = TRUE (new column in schema)
--   3. Added payments INSERT policy for service_role / admin
--      so Stripe webhook handler can write payment records
-- =============================================================

BEGIN;

-- ----------------------------------------------------------------
-- Seed: categories
-- ----------------------------------------------------------------
INSERT INTO categories (id, name, description)
VALUES
    (1, 'American Classics', 'Steaks, fried chicken, and backyard favorites'),
    (2, 'Italian Favorites', 'Wood-fired pizza and fresh pastas'),
    (3, 'Tex-Mex',           'Smoky brisket, tacos, and southwest flavors'),
    (4, 'Desserts',          'Southern-inspired sweets'),
    (5, 'Beverages',         'Coffee, tea, and soft drinks')
ON CONFLICT (id) DO NOTHING;
SELECT setval('categories_id_seq', (SELECT MAX(id) FROM categories));

-- ----------------------------------------------------------------
-- Seed: users
-- ----------------------------------------------------------------
INSERT INTO users (id, name, email, password_hash, phone, role)
VALUES
    ('7d1f8b6a-7ad5-4f5e-9b5a-0e5b2f5f9a10', 'Emma Johnson',   'emma.johnson@example.com',   '$2a$10$EixZaYVK1fsbw1ZfbX3OXe.PJ1pW8nYq1Q.Yh0Z2ZSoEc/SS6Fdae', '+1-206-555-0148', 'customer'),
    ('1fb6c9f8-5c2b-4c9d-bf6d-6b1f9c6e8b21', 'Noah Smith',     'noah.smith@example.com',     '$2a$10$EixZaYVK1fsbw1ZfbX3OXe.PJ1pW8nYq1Q.Yh0Z2ZSoEc/SS6Fdae', '+1-312-555-0192', 'customer'),
    ('9c3c5f01-2a41-4bd2-9f14-3a7a5e2eac32', 'Olivia Davis',   'olivia.davis@example.com',   '$2a$10$EixZaYVK1fsbw1ZfbX3OXe.PJ1pW8nYq1Q.Yh0Z2ZSoEc/SS6Fdae', '+1-404-555-0113', 'customer'),
    ('2e9a7c1d-1fb0-4a52-8a9d-71f4c8bd0f43', 'Liam Martinez',  'liam.martinez@example.com',  '$2a$10$EixZaYVK1fsbw1ZfbX3OXe.PJ1pW8nYq1Q.Yh0Z2ZSoEc/SS6Fdae', '+1-415-555-0176', 'admin'),
    ('0a6d8f7b-4c2e-4d1c-9f7e-5b2f7e6a8c54', 'Sophia Brown',   'sophia.brown@example.com',   '$2a$10$EixZaYVK1fsbw1ZfbX3OXe.PJ1pW8nYq1Q.Yh0Z2ZSoEc/SS6Fdae', '+1-617-555-0169', 'customer')
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------
-- Seed: addresses
-- ----------------------------------------------------------------
INSERT INTO addresses (id, user_id, street, city, state, postal_code, country)
VALUES
    ('d6c3a511-2b2e-4f6d-9d4b-5a7c8e9f0a11', '7d1f8b6a-7ad5-4f5e-9b5a-0e5b2f5f9a10', '1432 Pine St',            'Seattle',       'Washington',   '98101', 'United States'),
    ('e7d4b622-3c3f-507e-ae5c-6b8d9f0a1b22', '1fb6c9f8-5c2b-4c9d-bf6d-6b1f9c6e8b21', '845 W Randolph St Apt 7C','Chicago',       'Illinois',     '60607', 'United States'),
    ('f8e5c733-4d40-618f-bf6d-7c9e0a1b2c33', '9c3c5f01-2a41-4bd2-9f14-3a7a5e2eac32', '256 Peachtree Pl NE',     'Atlanta',       'Georgia',      '30318', 'United States'),
    ('09f6d844-5e51-7290-c07e-8d0f1b2c3d44', '2e9a7c1d-1fb0-4a52-8a9d-71f4c8bd0f43', '1285 Mission St',         'San Francisco', 'California',   '94103', 'United States'),
    ('1a07e955-6f62-83a1-d18f-9e1f2c3d4e55', '0a6d8f7b-4c2e-4d1c-9f7e-5b2f7e6a8c54', '77 Summer St Apt 502',    'Boston',        'Massachusetts','02110', 'United States')
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------
-- Seed: menu_items
-- ----------------------------------------------------------------
INSERT INTO menu_items (id, category_id, name, description, price, image_url)
VALUES
    ('3d6f5e3b-1a2b-4c3d-8e4f-5a6b7c8d9e01', 1, 'New York Strip Steak',      '12oz USDA Prime, garlic herb butter, served with roasted fingerlings',        32.00, 'https://images.example.com/menu/ny-strip.jpg'),
    ('4e7f6d4c-2b3c-5d4e-9f5a-6b7c8d9e0f12', 1, 'Buttermilk Fried Chicken',  'Free-range chicken with Alabama white sauce and dill pickles',                 18.50, 'https://images.example.com/menu/fried-chicken.jpg'),
    ('5f806e5d-3c4d-6e5f-af6b-7c8d9e0f1a23', 1, 'BBQ Brisket Sandwich',      'Central Texas smoked brisket on brioche, house pickles',                       15.75, 'https://images.example.com/menu/brisket-sandwich.jpg'),
    ('6a917f6e-4d5e-7f60-b07c-8d9e0f1a2b34', 2, 'Margherita Pizza',          'Hand-stretched dough, Bianco DiNapoli tomatoes, fresh mozzarella, basil',      14.00, 'https://images.example.com/menu/margherita-pizza.jpg'),
    ('7ba2807f-5e6f-8011-c18d-9e0f1a2b3c45', 2, 'Shrimp Scampi',             'Gulf shrimp, white wine, lemon, parsley over linguine',                        22.00, 'https://images.example.com/menu/shrimp-scampi.jpg'),
    ('8cb39180-6f70-9122-d29e-0f1a2b3c4d56', 2, 'Chicken Alfredo',           'House-made fettuccine, roasted chicken, parmesan cream',                       19.25, 'https://images.example.com/menu/chicken-alfredo.jpg'),
    ('9dc4a291-7081-a233-e3af-1a2b3c4d5e67', 3, 'Grilled Fish Tacos',        'Mahi mahi, lime crema, charred corn salsa on flour tortillas',                 12.00, 'https://images.example.com/menu/fish-tacos.jpg'),
    ('ad05b302-8192-b344-f4b0-2b3c4d5e6f78', 3, 'Smoked Brisket Quesadilla', 'Smoked brisket, Oaxaca cheese, poblano relish',                                13.50, 'https://images.example.com/menu/brisket-quesadilla.jpg'),
    ('be16c413-92a3-c455-05c1-3c4d5e6f7a89', 4, 'Brown Butter Pecan Pie',    'Toasted Georgia pecans, whipped vanilla cream',                                 6.50, 'https://images.example.com/menu/pecan-pie.jpg'),
    ('cf27d524-a3b4-d566-16d2-4d5e6f7a8b90', 5, 'Cold Brew Coffee',          'Single-origin Colombian, 18-hour steep, served over ice',                       4.50, 'https://images.example.com/menu/cold-brew.jpg')
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------
-- Seed: carts
-- ----------------------------------------------------------------
INSERT INTO carts (id, user_id)
VALUES
    ('a1b2c3d4-e5f6-47a8-9b0c-d1e2f3a4b5c6', '7d1f8b6a-7ad5-4f5e-9b5a-0e5b2f5f9a10'),
    ('b2c3d4e5-f6a7-58b9-0c1d-e2f3a4b5c6d7', '1fb6c9f8-5c2b-4c9d-bf6d-6b1f9c6e8b21'),
    ('c3d4e5f6-a7b8-69c0-1d2e-f3a4b5c6d7e8', '9c3c5f01-2a41-4bd2-9f14-3a7a5e2eac32')
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------
-- Seed: cart_items
-- ----------------------------------------------------------------
INSERT INTO cart_items (id, cart_id, menu_item_id, quantity)
VALUES
    ('d4e5f6a7-b8c9-7ad0-2e3f-4a5b6c7d8e90', 'a1b2c3d4-e5f6-47a8-9b0c-d1e2f3a4b5c6', '4e7f6d4c-2b3c-5d4e-9f5a-6b7c8d9e0f12', 1),
    ('e5f6a7b8-c9d0-8be1-3f40-5b6c7d8e9f01', 'b2c3d4e5-f6a7-58b9-0c1d-e2f3a4b5c6d7', '6a917f6e-4d5e-7f60-b07c-8d9e0f1a2b34', 2),
    ('f6a7b8c9-d0e1-9cf2-4051-6c7d8e9f0012', 'c3d4e5f6-a7b8-69c0-1d2e-f3a4b5c6d7e8', '9dc4a291-7081-a233-e3af-1a2b3c4d5e67', 3)
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------
-- Seed: orders
-- ----------------------------------------------------------------
INSERT INTO orders (id, user_id, address_id, total_price, order_status, payment_status, customer_note)
VALUES
    ('10111213-1415-4617-9819-1a1b1c1d1e1f', '7d1f8b6a-7ad5-4f5e-9b5a-0e5b2f5f9a10', 'd6c3a511-2b2e-4f6d-9d4b-5a7c8e9f0a11', 38.50, 'out_for_delivery', 'paid',       'Extra napkins, please'),
    ('20212223-2425-4627-9829-2a2b2c2d2e2f', '1fb6c9f8-5c2b-4c9d-bf6d-6b1f9c6e8b21', 'e7d4b622-3c3f-507e-ae5c-6b8d9f0a1b22', 23.00, 'preparing',        'authorized', 'Light on basil'),
    ('30313233-3435-4637-9839-3a3b3c3d3e3f', '9c3c5f01-2a41-4bd2-9f14-3a7a5e2eac32', 'f8e5c733-4d40-618f-bf6d-7c9e0a1b2c33', 37.50, 'confirmed',        'pending',    NULL)
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------
-- Seed: order_items
-- ----------------------------------------------------------------
INSERT INTO order_items (id, order_id, menu_item_id, quantity, price, special_instructions)
VALUES
    ('41424344-4546-4748-494a-4b4c4d4e4f50', '10111213-1415-4617-9819-1a1b1c1d1e1f', '3d6f5e3b-1a2b-4c3d-8e4f-5a6b7c8d9e01', 1, 32.00, 'Medium rare'),
    ('51525354-5556-5758-595a-5b5c5d5e5f60', '10111213-1415-4617-9819-1a1b1c1d1e1f', 'be16c413-92a3-c455-05c1-3c4d5e6f7a89', 1,  6.50, NULL),
    ('61626364-6566-6768-696a-6b6c6d6e6f70', '20212223-2425-4627-9829-2a2b2c2d2e2f', '6a917f6e-4d5e-7f60-b07c-8d9e0f1a2b34', 1, 14.00, NULL),
    ('71727374-7576-7778-797a-7b7c7d7e7f80', '20212223-2425-4627-9829-2a2b2c2d2e2f', 'cf27d524-a3b4-d566-16d2-4d5e6f7a8b90', 2,  4.50, 'Add oat milk'),
    ('81828384-8586-8788-898a-8b8c8d8e8f90', '30313233-3435-4637-9839-3a3b3c3d3e3f', '9dc4a291-7081-a233-e3af-1a2b3c4d5e67', 2, 12.00, 'Extra lime'),
    ('91929394-9596-9798-999a-9b9c9d9e9fa0', '30313233-3435-4637-9839-3a3b3c3d3e3f', 'ad05b302-8192-b344-f4b0-2b3c4d5e6f78', 1, 13.50, NULL)
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------
-- Seed: payments
-- ----------------------------------------------------------------
INSERT INTO payments (id, order_id, stripe_payment_intent_id, amount, currency, payment_method, payment_status)
VALUES
    ('a0b1c2d3-e4f5-46a7-98b9-c0d1e2f3a4b5', '10111213-1415-4617-9819-1a1b1c1d1e1f', 'pi_3NexampleSeattle', 38.50, 'USD', 'card', 'paid'),
    ('b1c2d3e4-f5a6-47b8-09c1-d2e3f4a5b6c7', '20212223-2425-4627-9829-2a2b2c2d2e2f', 'pi_3NexampleChicago', 23.00, 'USD', 'card', 'authorized'),
    ('c2d3e4f5-a6b7-48c9-10d2-e3f4a5b6c7d8', '30313233-3435-4637-9839-3a3b3c3d3e3f', 'pi_3NexampleAtlanta', 37.50, 'USD', 'card', 'pending')
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------
-- Seed: reviews
-- ----------------------------------------------------------------
INSERT INTO reviews (id, user_id, menu_item_id, rating, comment)
VALUES
    ('d3e4f5a6-b7c8-49d0-11e3-f4a5b6c7d8e9', '7d1f8b6a-7ad5-4f5e-9b5a-0e5b2f5f9a10', '3d6f5e3b-1a2b-4c3d-8e4f-5a6b7c8d9e01', 5, 'Steak was perfectly seasoned and cooked.'),
    ('e4f5a6b7-c8d9-4ae1-22f4-a5b6c7d8e9f0', '1fb6c9f8-5c2b-4c9d-bf6d-6b1f9c6e8b21', '6a917f6e-4d5e-7f60-b07c-8d9e0f1a2b34', 4, 'Good crust, could use a touch more basil.'),
    ('f5a6b7c8-d9e0-4bf2-33f5-b6c7d8e9f0a1', '9c3c5f01-2a41-4bd2-9f14-3a7a5e2eac32', '9dc4a291-7081-a233-e3af-1a2b3c4d5e67', 4, 'Tacos were fresh and generous on portion.')
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------
-- Seed: contact_messages
-- ----------------------------------------------------------------
INSERT INTO contact_messages (id, name, email, message)
VALUES
    ('0d1e2f3a-4b5c-46d7-98e9-f0a1b2c3d4e5', 'Grace Lee',      'grace.lee@outlook.com', 'Checking if you cater for a 20-person office lunch in Pioneer Square.'),
    ('1e2f3a4b-5c6d-47e8-09f1-a2b3c4d5e6f7', 'Michael Carter', 'mcarter@gmail.com',     'Do you offer gluten-free pizza crusts?')
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------
-- Seed: order_status_history
-- ----------------------------------------------------------------
INSERT INTO order_status_history (id, order_id, status)
VALUES
    ('2f3a4b5c-6d7e-48f9-10a2-b3c4d5e6f7a8', '10111213-1415-4617-9819-1a1b1c1d1e1f', 'confirmed'),
    ('3a4b5c6d-7e8f-4901-12b3-c4d5e6f7a8b9', '10111213-1415-4617-9819-1a1b1c1d1e1f', 'out_for_delivery'),
    ('4b5c6d7e-8f90-4a12-23c4-d5e6f7a8b9c0', '20212223-2425-4627-9829-2a2b2c2d2e2f', 'confirmed'),
    ('5c6d7e8f-9012-4b23-34d5-e6f7a8b9c0d1', '30313233-3435-4637-9839-3a3b3c3d3e3f', 'confirmed')
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------
-- Seed: coupons
-- FIX 1: WELCOME10 — discount_percentage = 10, is_free_shipping = FALSE  (unchanged, was correct)
-- FIX 2: FREESHIP25 — was discount_percentage = 0 (wrong).
--         Corrected to is_free_shipping = TRUE, discount_percentage = 0
--         because the schema now has an is_free_shipping column.
-- ----------------------------------------------------------------
INSERT INTO coupons (id, code, discount_percentage, is_free_shipping, expiry_date)
VALUES
    ('6d7e8f90-1234-4c35-45e6-f7a8b9c0d1e2', 'WELCOME10',  10, FALSE, CURRENT_DATE + INTERVAL '60 days'),
    ('7e8f9012-2345-4d46-56f7-a8b9c0d1e2f3', 'FREESHIP25',  0, TRUE,  CURRENT_DATE + INTERVAL '30 days')
ON CONFLICT (id) DO NOTHING;

-- ================================================================
-- HELPER FUNCTION
-- FIX: Added SECURITY DEFINER so this function bypasses RLS on the
--      users table when called from policies on other tables.
--      Without SECURITY DEFINER, the function runs as the calling
--      user and may be blocked by the users_self_select policy,
--      causing is_app_admin() to silently return false for admins.
-- ================================================================
DROP FUNCTION IF EXISTS is_app_admin();
CREATE OR REPLACE FUNCTION is_app_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER                   -- <-- THE FIX
SET search_path = public AS $$
    SELECT EXISTS (
        SELECT 1
        FROM   users u
        WHERE  u.id   = auth.uid()
        AND    u.role = 'admin'
    );
$$;

-- ================================================================
-- ROW-LEVEL SECURITY POLICIES
-- ================================================================

-- ---- Categories ------------------------------------------------
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS category_read_all    ON categories;
DROP POLICY IF EXISTS category_admin_write ON categories;

CREATE POLICY category_read_all ON categories
    FOR SELECT USING (true);

CREATE POLICY category_admin_write ON categories
    FOR ALL
    USING      (auth.role() = 'service_role' OR is_app_admin())
    WITH CHECK (auth.role() = 'service_role' OR is_app_admin());

-- ---- Menu items ------------------------------------------------
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS menu_read_all    ON menu_items;
DROP POLICY IF EXISTS menu_admin_write ON menu_items;

CREATE POLICY menu_read_all ON menu_items
    FOR SELECT USING (true);

CREATE POLICY menu_admin_write ON menu_items
    FOR ALL
    USING      (auth.role() = 'service_role' OR is_app_admin())
    WITH CHECK (auth.role() = 'service_role' OR is_app_admin());

-- ---- Users -----------------------------------------------------
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS users_self_select ON users;
DROP POLICY IF EXISTS users_self_update ON users;
DROP POLICY IF EXISTS users_self_insert ON users;
DROP POLICY IF EXISTS users_admin_all   ON users;

CREATE POLICY users_self_select ON users
    FOR SELECT USING (id = auth.uid());

CREATE POLICY users_self_update ON users
    FOR UPDATE USING (id = auth.uid());

CREATE POLICY users_self_insert ON users
    FOR INSERT WITH CHECK (id = auth.uid());

CREATE POLICY users_admin_all ON users
    FOR ALL
    USING      (auth.role() = 'service_role' OR is_app_admin())
    WITH CHECK (auth.role() = 'service_role' OR is_app_admin());

-- ---- Addresses -------------------------------------------------
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS addresses_owner_all ON addresses;
DROP POLICY IF EXISTS addresses_admin_all ON addresses;

CREATE POLICY addresses_owner_all ON addresses
    FOR ALL
    USING      (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

CREATE POLICY addresses_admin_all ON addresses
    FOR ALL
    USING      (auth.role() = 'service_role' OR is_app_admin())
    WITH CHECK (auth.role() = 'service_role' OR is_app_admin());

-- ---- Carts -----------------------------------------------------
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS carts_owner_all ON carts;
DROP POLICY IF EXISTS carts_admin_all ON carts;

CREATE POLICY carts_owner_all ON carts
    FOR ALL
    USING      (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

CREATE POLICY carts_admin_all ON carts
    FOR ALL
    USING      (auth.role() = 'service_role' OR is_app_admin())
    WITH CHECK (auth.role() = 'service_role' OR is_app_admin());

-- ---- Cart items ------------------------------------------------
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS cart_items_owner_all ON cart_items;
DROP POLICY IF EXISTS cart_items_admin_all ON cart_items;

CREATE POLICY cart_items_owner_all ON cart_items
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM carts c
            WHERE  c.id      = cart_items.cart_id
            AND    c.user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM carts c
            WHERE  c.id      = cart_items.cart_id
            AND    c.user_id = auth.uid()
        )
    );

CREATE POLICY cart_items_admin_all ON cart_items
    FOR ALL
    USING      (auth.role() = 'service_role' OR is_app_admin())
    WITH CHECK (auth.role() = 'service_role' OR is_app_admin());

-- ---- Orders ----------------------------------------------------
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS orders_owner_all ON orders;
DROP POLICY IF EXISTS orders_admin_all ON orders;

CREATE POLICY orders_owner_all ON orders
    FOR ALL
    USING      (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

CREATE POLICY orders_admin_all ON orders
    FOR ALL
    USING      (auth.role() = 'service_role' OR is_app_admin())
    WITH CHECK (auth.role() = 'service_role' OR is_app_admin());

-- ---- Order items -----------------------------------------------
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS order_items_owner_all ON order_items;
DROP POLICY IF EXISTS order_items_admin_all ON order_items;

CREATE POLICY order_items_owner_all ON order_items
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM orders o
            WHERE  o.id      = order_items.order_id
            AND    o.user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM orders o
            WHERE  o.id      = order_items.order_id
            AND    o.user_id = auth.uid()
        )
    );

CREATE POLICY order_items_admin_all ON order_items
    FOR ALL
    USING      (auth.role() = 'service_role' OR is_app_admin())
    WITH CHECK (auth.role() = 'service_role' OR is_app_admin());

-- ---- Payments --------------------------------------------------
-- FIX: Added INSERT policy so the Stripe webhook (service_role) and
--      admins can write payment records. Previously only SELECT existed
--      for owners; any INSERT from a server-side handler would be
--      silently rejected unless it used service_role bypass.
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS payments_owner_select ON payments;
DROP POLICY IF EXISTS payments_admin_all    ON payments;
DROP POLICY IF EXISTS payments_service_insert ON payments;

CREATE POLICY payments_owner_select ON payments
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM orders o
            WHERE  o.id      = payments.order_id
            AND    o.user_id = auth.uid()
        )
    );

-- Explicit INSERT for service_role / admin (Stripe webhook path)
CREATE POLICY payments_service_insert ON payments
    FOR INSERT
    WITH CHECK (auth.role() = 'service_role' OR is_app_admin());

CREATE POLICY payments_admin_all ON payments
    FOR ALL
    USING      (auth.role() = 'service_role' OR is_app_admin())
    WITH CHECK (auth.role() = 'service_role' OR is_app_admin());

-- ---- Reviews ---------------------------------------------------
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS reviews_owner_all ON reviews;
DROP POLICY IF EXISTS reviews_admin_all ON reviews;

CREATE POLICY reviews_owner_all ON reviews
    FOR ALL
    USING      (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

CREATE POLICY reviews_admin_all ON reviews
    FOR ALL
    USING      (auth.role() = 'service_role' OR is_app_admin())
    WITH CHECK (auth.role() = 'service_role' OR is_app_admin());

-- ---- Contact messages ------------------------------------------
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS contact_insert_public ON contact_messages;
DROP POLICY IF EXISTS contact_admin_read    ON contact_messages;

CREATE POLICY contact_insert_public ON contact_messages
    FOR INSERT WITH CHECK (true);

CREATE POLICY contact_admin_read ON contact_messages
    FOR SELECT
    USING (auth.role() = 'service_role' OR is_app_admin());

-- ---- Coupons ---------------------------------------------------
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS coupons_read_all  ON coupons;
DROP POLICY IF EXISTS coupons_admin_all ON coupons;

CREATE POLICY coupons_read_all ON coupons
    FOR SELECT USING (true);

CREATE POLICY coupons_admin_all ON coupons
    FOR ALL
    USING      (auth.role() = 'service_role' OR is_app_admin())
    WITH CHECK (auth.role() = 'service_role' OR is_app_admin());

-- ---- Order status history --------------------------------------
ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS osh_owner_select ON order_status_history;
DROP POLICY IF EXISTS osh_admin_all    ON order_status_history;

CREATE POLICY osh_owner_select ON order_status_history
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM orders o
            WHERE  o.id      = order_status_history.order_id
            AND    o.user_id = auth.uid()
        )
    );

CREATE POLICY osh_admin_all ON order_status_history
    FOR ALL
    USING      (auth.role() = 'service_role' OR is_app_admin())
    WITH CHECK (auth.role() = 'service_role' OR is_app_admin());

COMMIT;