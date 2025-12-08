-- V2__Seed_data.sql
-- Seed data for ERP POS System
-- Creates default users and sample products

-- Insert default users (passwords are BCrypt encoded with cost factor 10)
-- Passwords: admin123, manager123, cashier123

INSERT INTO users (username, password, full_name, email, role, created_at, is_active)
SELECT 'admin', '$2b$10$8vggT77A0QBLZWtcmNr6.OVjeaUfK1H1xDu5x9gHLF.BD2v3zusE.', 'System Administrator', 'admin@erp.com', 'ADMIN', CURRENT_TIMESTAMP, true
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'admin');

INSERT INTO users (username, password, full_name, email, role, created_at, is_active)
SELECT 'manager', '$2b$10$yx5/bYatVK5ULwo9YqQsneQ5xi13MU/6rx/UvqzqWZ4zjoHQ2Avzq', 'Store Manager', 'manager@erp.com', 'MANAGER', CURRENT_TIMESTAMP, true
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'manager');

INSERT INTO users (username, password, full_name, email, role, created_at, is_active)
SELECT 'cashier', '$2b$10$CwgjIcay425uVL5ekRI6eeAb5NghBLgtWwAmi0xpare60MT7iXcNi', 'Store Cashier', 'cashier@erp.com', 'CASHIER', CURRENT_TIMESTAMP, true
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'cashier');

-- Insert sample products
INSERT INTO products (sku, name, description, price, stock_quantity, created_at, is_active)
SELECT 'PRD001', 'Laptop', 'High-performance laptop', 999.99, 50, CURRENT_TIMESTAMP, true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'PRD001');

INSERT INTO products (sku, name, description, price, stock_quantity, created_at, is_active)
SELECT 'PRD002', 'Mouse', 'Wireless mouse', 29.99, 200, CURRENT_TIMESTAMP, true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'PRD002');

INSERT INTO products (sku, name, description, price, stock_quantity, created_at, is_active)
SELECT 'PRD003', 'Keyboard', 'Mechanical keyboard', 79.99, 150, CURRENT_TIMESTAMP, true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'PRD003');

INSERT INTO products (sku, name, description, price, stock_quantity, created_at, is_active)
SELECT 'PRD004', 'Monitor', '27-inch 4K monitor', 399.99, 75, CURRENT_TIMESTAMP, true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'PRD004');

INSERT INTO products (sku, name, description, price, stock_quantity, created_at, is_active)
SELECT 'PRD005', 'Headphones', 'Noise-canceling headphones', 199.99, 100, CURRENT_TIMESTAMP, true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'PRD005');

