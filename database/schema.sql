-- =============================================================
-- restaurant_schema.sql  –  PostgreSQL (Supabase-compatible)
-- Corrections applied:
--   1. CHECK constraints on order_status & payment_status
--   2. updated_at trigger function + triggers for users & menu_items
--   3. Added missing indexes (reviews, order_status_history, payments)
-- =============================================================

-- ----------------------------------------------------------------
-- USERS
-- ----------------------------------------------------------------
CREATE TABLE users (
    id            UUID         PRIMARY KEY,
    name          VARCHAR(120) NOT NULL,
    email         VARCHAR(150) UNIQUE NOT NULL,
    password_hash TEXT         NOT NULL,
    phone         VARCHAR(20),
    role          VARCHAR(20)  DEFAULT 'customer'
                               CHECK (role IN ('customer', 'admin')),
    created_at    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------
-- ADDRESSES
-- ----------------------------------------------------------------
CREATE TABLE addresses (
    id            UUID         PRIMARY KEY,
    user_id     UUID         REFERENCES users(id) ON DELETE CASCADE,
    street      TEXT         NOT NULL,
    city        VARCHAR(100),
    state       VARCHAR(100),
    postal_code VARCHAR(20),
    country     VARCHAR(100),
    created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------
-- CATEGORIES
-- ----------------------------------------------------------------
CREATE TABLE categories (
    id          SERIAL       PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    description TEXT,
    created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------
-- MENU ITEMS
-- ----------------------------------------------------------------
CREATE TABLE menu_items (
    id            UUID         PRIMARY KEY,
    category_id  INTEGER        REFERENCES categories(id) ON DELETE SET NULL,
    name         VARCHAR(150)   NOT NULL,
    description  TEXT,
    price        NUMERIC(10,2)  NOT NULL CHECK (price >= 0),
    image_url    TEXT,
    is_available BOOLEAN        DEFAULT TRUE,
    created_at   TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
    updated_at   TIMESTAMP      DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------
-- CARTS
-- ----------------------------------------------------------------
CREATE TABLE carts (
    id            UUID         PRIMARY KEY,
    user_id    UUID      REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------
-- CART ITEMS
-- ----------------------------------------------------------------
CREATE TABLE cart_items (
    id            UUID         PRIMARY KEY,
    cart_id      UUID      REFERENCES carts(id)      ON DELETE CASCADE,
    menu_item_id UUID      REFERENCES menu_items(id) ON DELETE CASCADE,
    quantity     INTEGER   NOT NULL CHECK (quantity > 0),
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------
-- ORDERS
-- FIX: Added CHECK constraints on order_status and payment_status
-- ----------------------------------------------------------------
CREATE TABLE orders (
    id            UUID         PRIMARY KEY,
    user_id        UUID          REFERENCES users(id),
    address_id     UUID          REFERENCES addresses(id),
    total_price    NUMERIC(10,2) NOT NULL CHECK (total_price >= 0),
    order_status   VARCHAR(30)   DEFAULT 'pending'
                                 CHECK (order_status IN (
                                     'pending', 'confirmed', 'preparing',
                                     'out_for_delivery', 'delivered', 'cancelled'
                                 )),
    payment_status VARCHAR(30)   DEFAULT 'pending'
                                 CHECK (payment_status IN (
                                     'pending', 'authorized', 'paid',
                                     'failed', 'refunded'
                                 )),
    customer_note  TEXT,
    created_at     TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------
-- ORDER ITEMS
-- ----------------------------------------------------------------
CREATE TABLE order_items (
    id            UUID         PRIMARY KEY,
    order_id             UUID          REFERENCES orders(id) ON DELETE CASCADE,
    menu_item_id         UUID          REFERENCES menu_items(id),
    quantity             INTEGER       NOT NULL CHECK (quantity > 0),
    price                NUMERIC(10,2) NOT NULL CHECK (price >= 0),
    special_instructions TEXT,
    created_at           TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------
-- REVIEWS
-- ----------------------------------------------------------------
CREATE TABLE reviews (
    id            UUID         PRIMARY KEY,
    user_id      UUID      REFERENCES users(id)      ON DELETE CASCADE,
    menu_item_id UUID      REFERENCES menu_items(id) ON DELETE CASCADE,
    rating       INTEGER   CHECK (rating BETWEEN 1 AND 5),
    comment      TEXT,
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------
-- PAYMENTS
-- FIX: Added CHECK constraint on payment_status
-- ----------------------------------------------------------------
CREATE TABLE payments (
    id            UUID         PRIMARY KEY,
    order_id                 UUID          REFERENCES orders(id) ON DELETE CASCADE,
    stripe_payment_intent_id VARCHAR(255),
    amount                   NUMERIC(10,2) CHECK (amount >= 0),
    currency                 VARCHAR(10)   DEFAULT 'USD',
    payment_method           VARCHAR(50),
    payment_status           VARCHAR(30)   DEFAULT 'pending'
                                           CHECK (payment_status IN (
                                               'pending', 'authorized', 'paid',
                                               'failed', 'refunded'
                                           )),
    created_at               TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------
-- CONTACT MESSAGES
-- ----------------------------------------------------------------
CREATE TABLE contact_messages (
    id            UUID         PRIMARY KEY,
    name       VARCHAR(120),
    email      VARCHAR(150),
    message    TEXT,
    created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------
-- ORDER STATUS HISTORY
-- ----------------------------------------------------------------
CREATE TABLE order_status_history (
    id            UUID         PRIMARY KEY,
    order_id   UUID        REFERENCES orders(id) ON DELETE CASCADE,
    status     VARCHAR(50) CHECK (status IN (
                   'pending', 'confirmed', 'preparing',
                   'out_for_delivery', 'delivered', 'cancelled'
               )),
    changed_at TIMESTAMP   DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------
-- COUPONS
-- FIX: Added is_free_shipping column to properly model FREESHIP-style codes;
--      added CHECK so discount_percentage stays in a valid range.
-- ----------------------------------------------------------------
CREATE TABLE coupons (
    id            UUID         PRIMARY KEY,
    code                VARCHAR(50) UNIQUE,
    discount_percentage INTEGER     DEFAULT 0
                                    CHECK (discount_percentage BETWEEN 0 AND 100),
    is_free_shipping    BOOLEAN     DEFAULT FALSE,
    expiry_date         TIMESTAMP,
    created_at          TIMESTAMP   DEFAULT CURRENT_TIMESTAMP
);

-- ================================================================
-- TRIGGER: auto-update updated_at on users and menu_items
-- FIX: columns existed but were never maintained without a trigger
-- ================================================================
CREATE OR REPLACE FUNCTION touch_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

-- Make trigger creation idempotent so reruns don't error if triggers exist
DROP TRIGGER IF EXISTS trg_users_updated_at ON users;
CREATE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

DROP TRIGGER IF EXISTS trg_menu_items_updated_at ON menu_items;
CREATE TRIGGER trg_menu_items_updated_at
    BEFORE UPDATE ON menu_items
    FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

-- ================================================================
-- INDEXES
-- Original indexes (unchanged)
-- ================================================================
CREATE INDEX idx_cart_items_cart   ON cart_items(cart_id);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_orders_user       ON orders(user_id);
CREATE INDEX idx_orders_status     ON orders(order_status);
CREATE INDEX idx_menu_available    ON menu_items(is_available);
CREATE INDEX idx_menu_category     ON menu_items(category_id);
CREATE INDEX idx_users_email       ON users(email);

-- FIX: Added missing indexes for high-traffic lookup patterns
CREATE INDEX idx_reviews_menu_item        ON reviews(menu_item_id);
CREATE INDEX idx_reviews_user             ON reviews(user_id);
CREATE INDEX idx_order_status_history_order ON order_status_history(order_id);
CREATE INDEX idx_payments_order           ON payments(order_id);
CREATE INDEX idx_cart_items_menu_item     ON cart_items(menu_item_id);

-- Required new indexes based on production guidelines
CREATE INDEX idx_orders_user_status ON orders(user_id, order_status);
CREATE INDEX idx_available_menu_idx ON menu_items(id) WHERE is_available = true;
