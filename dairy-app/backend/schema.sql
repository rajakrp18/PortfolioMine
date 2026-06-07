-- ============================================================
-- DAIRY MANAGEMENT SYSTEM — DATABASE SCHEMA
-- Stack: PostgreSQL
-- Author: Raj Poddar
-- ============================================================

-- Enable UUID extension for primary keys
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- USERS TABLE — central auth for all roles
-- Roles: admin | farmer | wholesaler | retailer | consumer | delivery_agent
-- ============================================================
CREATE TABLE users (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        VARCHAR(100) NOT NULL,
    email       VARCHAR(150) UNIQUE NOT NULL,
    password    VARCHAR(255) NOT NULL,           -- bcrypt hashed
    phone       VARCHAR(15),
    role        VARCHAR(20) NOT NULL CHECK (role IN (
                    'admin','farmer','wholesaler',
                    'retailer','consumer','delivery_agent'
                )),
    address     TEXT,
    city        VARCHAR(80),
    state       VARCHAR(80),
    pincode     VARCHAR(10),
    is_active   BOOLEAN DEFAULT TRUE,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- FARMER PROFILES — extra info for farmer role
-- ============================================================
CREATE TABLE farmer_profiles (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
    farm_name       VARCHAR(150),
    farm_location   TEXT,
    land_acres      NUMERIC(8,2),
    cattle_count    INTEGER DEFAULT 0,
    bank_account    VARCHAR(30),
    ifsc_code       VARCHAR(15),
    aadhaar         VARCHAR(12),                 -- masked at API level
    verified        BOOLEAN DEFAULT FALSE,
    joined_date     DATE DEFAULT CURRENT_DATE
);

-- ============================================================
-- MILK COLLECTIONS — daily sourcing from farmers (AM + PM)
-- ============================================================
CREATE TABLE milk_collections (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farmer_id       UUID REFERENCES users(id),
    collection_date DATE NOT NULL DEFAULT CURRENT_DATE,
    shift           VARCHAR(5) CHECK (shift IN ('AM','PM')) NOT NULL,
    quantity_liters NUMERIC(8,2) NOT NULL,       -- litres collected
    fat_percentage  NUMERIC(5,2),                -- fat %
    snf_percentage  NUMERIC(5,2),                -- solid-not-fat %
    rate_per_liter  NUMERIC(8,2) NOT NULL,       -- ₹ per litre
    amount          NUMERIC(10,2) GENERATED ALWAYS AS
                    (quantity_liters * rate_per_liter) STORED,
    quality_grade   CHAR(1) CHECK (quality_grade IN ('A','B','C')),
    collected_by    UUID REFERENCES users(id),   -- admin/agent who recorded
    payment_status  VARCHAR(15) DEFAULT 'pending' CHECK (
                    payment_status IN ('pending','processed','paid')),
    notes           TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PRODUCT CATEGORIES
-- ============================================================
CREATE TABLE categories (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(80) UNIQUE NOT NULL,     -- Milk, Ghee, Paneer, etc.
    description TEXT,
    icon        VARCHAR(50)                      -- emoji or icon class
);

-- ============================================================
-- PRODUCTS — dairy SKUs sold to wholesalers / retailers / consumers
-- ============================================================
CREATE TABLE products (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id     INTEGER REFERENCES categories(id),
    name            VARCHAR(150) NOT NULL,
    sku             VARCHAR(50) UNIQUE,
    description     TEXT,
    unit            VARCHAR(20) NOT NULL,         -- litre, kg, gm, pcs
    consumer_price  NUMERIC(10,2) NOT NULL,       -- MRP
    retailer_price  NUMERIC(10,2) NOT NULL,
    wholesaler_price NUMERIC(10,2) NOT NULL,
    image_url       TEXT,
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INVENTORY — warehouse stock levels
-- ============================================================
CREATE TABLE inventory (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id      UUID REFERENCES products(id),
    batch_no        VARCHAR(50),
    quantity        NUMERIC(10,2) NOT NULL DEFAULT 0,
    manufacture_date DATE,
    expiry_date      DATE,
    location         VARCHAR(100),               -- warehouse shelf/bin
    updated_at       TIMESTAMPTZ DEFAULT NOW(),
    updated_by       UUID REFERENCES users(id)
);

-- ============================================================
-- ORDERS — unified order table for wholesaler / retailer / consumer
-- ============================================================
CREATE TABLE orders (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    buyer_id        UUID REFERENCES users(id),   -- who placed the order
    buyer_role      VARCHAR(20) NOT NULL,         -- wholesaler | retailer | consumer
    status          VARCHAR(20) DEFAULT 'pending' CHECK (status IN (
                    'pending','confirmed','processing',
                    'dispatched','delivered','cancelled')),
    delivery_address TEXT NOT NULL,
    delivery_date   DATE,
    total_amount    NUMERIC(12,2),
    discount        NUMERIC(8,2) DEFAULT 0,
    tax             NUMERIC(8,2) DEFAULT 0,
    final_amount    NUMERIC(12,2),
    payment_method  VARCHAR(20) CHECK (payment_method IN (
                    'cod','upi','netbanking','credit','credit_line')),
    payment_status  VARCHAR(15) DEFAULT 'pending' CHECK (payment_status IN (
                    'pending','paid','failed','refunded')),
    notes           TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ORDER ITEMS — line items for each order
-- ============================================================
CREATE TABLE order_items (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id    UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id  UUID REFERENCES products(id),
    quantity    NUMERIC(10,2) NOT NULL,
    unit_price  NUMERIC(10,2) NOT NULL,
    subtotal    NUMERIC(12,2) GENERATED ALWAYS AS (quantity * unit_price) STORED
);

-- ============================================================
-- DELIVERY ASSIGNMENTS — links orders to delivery agents
-- ============================================================
CREATE TABLE deliveries (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id        UUID REFERENCES orders(id),
    agent_id        UUID REFERENCES users(id),   -- delivery_agent role
    status          VARCHAR(20) DEFAULT 'assigned' CHECK (status IN (
                    'assigned','picked_up','in_transit',
                    'delivered','failed','returned')),
    assigned_at     TIMESTAMPTZ DEFAULT NOW(),
    picked_up_at    TIMESTAMPTZ,
    delivered_at    TIMESTAMPTZ,
    delivery_proof  TEXT,                        -- image URL / OTP
    failure_reason  TEXT,
    route_notes     TEXT
);

-- ============================================================
-- FARMER PAYMENTS — payouts based on milk collections
-- ============================================================
CREATE TABLE farmer_payments (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farmer_id       UUID REFERENCES users(id),
    period_from     DATE NOT NULL,
    period_to       DATE NOT NULL,
    total_liters    NUMERIC(10,2),
    total_amount    NUMERIC(12,2),
    payment_method  VARCHAR(20),
    transaction_ref VARCHAR(100),
    paid_at         TIMESTAMPTZ,
    status          VARCHAR(15) DEFAULT 'pending',
    created_by      UUID REFERENCES users(id)
);

-- ============================================================
-- PRICE SLABS — bulk pricing for wholesalers
-- ============================================================
CREATE TABLE price_slabs (
    id              SERIAL PRIMARY KEY,
    product_id      UUID REFERENCES products(id),
    buyer_role      VARCHAR(20),
    min_qty         NUMERIC(10,2) NOT NULL,
    max_qty         NUMERIC(10,2),
    price_per_unit  NUMERIC(10,2) NOT NULL,
    valid_from      DATE DEFAULT CURRENT_DATE,
    valid_to        DATE
);

-- ============================================================
-- NOTIFICATIONS — system alerts for all roles
-- ============================================================
CREATE TABLE notifications (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID REFERENCES users(id),
    title       VARCHAR(200),
    message     TEXT,
    type        VARCHAR(30),                     -- order | payment | alert | info
    is_read     BOOLEAN DEFAULT FALSE,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INDEXES for performance
-- ============================================================
CREATE INDEX idx_milk_collections_farmer    ON milk_collections(farmer_id);
CREATE INDEX idx_milk_collections_date      ON milk_collections(collection_date);
CREATE INDEX idx_orders_buyer               ON orders(buyer_id);
CREATE INDEX idx_orders_status              ON orders(status);
CREATE INDEX idx_order_items_order          ON order_items(order_id);
CREATE INDEX idx_deliveries_agent           ON deliveries(agent_id);
CREATE INDEX idx_inventory_product          ON inventory(product_id);
CREATE INDEX idx_notifications_user         ON notifications(user_id, is_read);

-- ============================================================
-- SEED DATA — categories
-- ============================================================
INSERT INTO categories (name, description, icon) VALUES
  ('Milk',        'Fresh and pasteurized milk variants',     '🥛'),
  ('Ghee',        'Pure clarified butter',                   '🫙'),
  ('Paneer',      'Fresh cottage cheese',                    '🧀'),
  ('Yogurt',      'Curd and flavored yogurt',               '🍦'),
  ('Butter',      'Table and cooking butter',                '🧈'),
  ('Cream',       'Fresh and whipping cream',               '🥣'),
  ('Ice Cream',   'Dairy-based frozen desserts',            '🍨'),
  ('Cheese',      'Processed and natural cheese',           '🧀');

-- ============================================================
-- DEFAULT ADMIN USER  (password: Admin@1234 — change in prod!)
-- bcrypt hash of "Admin@1234"
-- ============================================================
INSERT INTO users (name, email, password, role, phone)
VALUES (
  'Dairy Admin',
  'admin@dairyfresh.com',
  '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPVsXScMbr2', 
  'admin',
  '9000000000'
);
