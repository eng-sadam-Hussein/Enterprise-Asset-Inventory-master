-- ============================================================
-- Nexora AssetOps — Enterprise Asset & Inventory Management
-- PostgreSQL Database Schema
-- Server-side relational reference schema
-- ============================================================

-- Optional: create database first
-- CREATE DATABASE nexora_assetops;

-- ------------------------------------------------------------
-- users
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id              BIGSERIAL PRIMARY KEY,
    username        VARCHAR(255) NOT NULL UNIQUE,
    email           VARCHAR(255) NOT NULL UNIQUE,
    password        VARCHAR(255) NOT NULL,
    full_name       VARCHAR(255) NOT NULL,
    department      VARCHAR(255),
    profile_image    TEXT,
    role            VARCHAR(20)  NOT NULL
                    CHECK (role IN ('ADMIN', 'ASSET_MANAGER', 'INVENTORY_OFFICER', 'TECHNICIAN', 'AUDITOR')),
    created_at      TIMESTAMP
);

-- ------------------------------------------------------------
-- assets
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS assets (
    id               BIGSERIAL PRIMARY KEY,
    asset_code       VARCHAR(255)  NOT NULL UNIQUE,
    name             VARCHAR(255)  NOT NULL,
    serial_number    VARCHAR(255),
    category         VARCHAR(40)   NOT NULL
                     CHECK (category IN (
                         'COMPUTERS',
                         'LAPTOPS',
                         'MONITORS',
                         'PRINTERS',
                         'SERVERS',
                         'NETWORKING_DEVICES',
                         'OFFICE_FURNITURE'
                     )),
    purchase_date    DATE,
    purchase_cost    NUMERIC(19, 2),
    warranty_expiry  DATE,
    location         VARCHAR(255),
    status           VARCHAR(30)   NOT NULL
                     CHECK (status IN (
                         'AVAILABLE',
                         'ASSIGNED',
                         'UNDER_MAINTENANCE',
                         'RETIRED'
                     )),
    image_url        VARCHAR(255),
    qr_code_data     VARCHAR(255),
    barcode_data     VARCHAR(255),
    notes            VARCHAR(2000),
    created_at       TIMESTAMP,
    updated_at       TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_assets_status   ON assets(status);
CREATE INDEX IF NOT EXISTS idx_assets_category ON assets(category);
CREATE INDEX IF NOT EXISTS idx_assets_name     ON assets(name);

-- ------------------------------------------------------------
-- stock_items
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS stock_items (
    id              BIGSERIAL PRIMARY KEY,
    item_name       VARCHAR(255) NOT NULL,
    sku             VARCHAR(255) NOT NULL UNIQUE,
    quantity        INTEGER      NOT NULL DEFAULT 0,
    minimum_stock   INTEGER      NOT NULL DEFAULT 0,
    location        VARCHAR(255),
    description     VARCHAR(2000),
    created_at      TIMESTAMP,
    updated_at      TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_stock_sku ON stock_items(sku);

-- ------------------------------------------------------------
-- stock_transactions
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS stock_transactions (
    id              BIGSERIAL PRIMARY KEY,
    stock_item_id   BIGINT       NOT NULL
                    REFERENCES stock_items(id) ON DELETE CASCADE,
    type            VARCHAR(10)  NOT NULL
                    CHECK (type IN ('IN', 'OUT')),
    quantity        INTEGER      NOT NULL,
    reason          VARCHAR(255) NOT NULL,
    performed_by    VARCHAR(255) NOT NULL,
    created_at      TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_stock_txn_item ON stock_transactions(stock_item_id);

-- ------------------------------------------------------------
-- assignments
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS assignments (
    id               BIGSERIAL PRIMARY KEY,
    asset_id         BIGINT       NOT NULL
                     REFERENCES assets(id) ON DELETE RESTRICT,
    employee_name    VARCHAR(255) NOT NULL,
    department       VARCHAR(255),
    assignment_date  DATE         NOT NULL,
    return_date      DATE,
    status           VARCHAR(20)  NOT NULL
                     CHECK (status IN ('ACTIVE', 'RETURNED')),
    notes            VARCHAR(2000),
    assigned_by      VARCHAR(255),
    created_at       TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_assignment_asset  ON assignments(asset_id);
CREATE INDEX IF NOT EXISTS idx_assignment_status ON assignments(status);

-- ------------------------------------------------------------
-- maintenance_records
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS maintenance_records (
    id               BIGSERIAL PRIMARY KEY,
    asset_id         BIGINT       NOT NULL
                     REFERENCES assets(id) ON DELETE RESTRICT,
    title            VARCHAR(255) NOT NULL,
    description      VARCHAR(2000),
    schedule_date    DATE,
    technician       VARCHAR(255),
    cost             NUMERIC(19, 2),
    status           VARCHAR(20)  NOT NULL
                     CHECK (status IN (
                         'SCHEDULED',
                         'IN_PROGRESS',
                         'COMPLETED',
                         'CANCELLED'
                     )),
    completed_date   DATE,
    created_by       VARCHAR(255),
    created_at       TIMESTAMP,
    updated_at       TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_maint_asset  ON maintenance_records(asset_id);
CREATE INDEX IF NOT EXISTS idx_maint_status ON maintenance_records(status);

-- ------------------------------------------------------------
-- activity_logs
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS activity_logs (
    id              BIGSERIAL PRIMARY KEY,
    action          VARCHAR(255) NOT NULL,
    entity_type     VARCHAR(255) NOT NULL,
    entity_id       BIGINT,
    description     VARCHAR(2000),
    username        VARCHAR(255),
    created_at      TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_activity_created ON activity_logs(created_at DESC);

-- ------------------------------------------------------------
-- Relationship summary
-- ------------------------------------------------------------
-- users                1 --- * activity_logs   (logical, by username)
-- assets               1 --- * assignments
-- assets               1 --- * maintenance_records
-- stock_items          1 --- * stock_transactions
