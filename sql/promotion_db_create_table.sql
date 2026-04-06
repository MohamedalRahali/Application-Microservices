-- ============================================
-- PROMOTION SERVICE — Create Table Script
-- Database: promotion_db
-- ============================================

CREATE DATABASE IF NOT EXISTS promotion_db CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

USE promotion_db;

CREATE TABLE IF NOT EXISTS promotions (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  code VARCHAR(50) NOT NULL UNIQUE,
  discount_percent DECIMAL(5, 2),
  discount_amount DECIMAL(10, 2),
  type VARCHAR(50) NOT NULL DEFAULT 'PERCENTAGE',
  image VARCHAR(500),
  valid_from DATETIME,
  valid_until DATETIME,
  active TINYINT(1) DEFAULT 1,
  usage_limit INT,
  usage_count INT DEFAULT 0,
  min_order_amount DECIMAL(10, 2),
  restaurant_id VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_code (code),
  INDEX idx_active (active),
  INDEX idx_restaurant_id (restaurant_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
