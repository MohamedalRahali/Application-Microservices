-- ============================================
-- PROMOTION SERVICE — Données de test
-- Base: promotion_db
-- ============================================

USE promotion_db;

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE promotions;
SET FOREIGN_KEY_CHECKS = 1;

INSERT INTO promotions (id, title, description, code, discount_percent, discount_amount, type, image, valid_from, valid_until, active, usage_limit, usage_count, min_order_amount, restaurant_id) VALUES

(1, 'Bienvenue sur FoodExpress !',
 '20% de réduction sur votre première commande',
 'WELCOME20', 20, NULL, 'PERCENTAGE',
 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=400&fit=crop',
 NOW() - INTERVAL 1 DAY, NOW() + INTERVAL 30 DAY,
 1, 1000, 245, 15.00, NULL),

(2, 'Livraison Gratuite Weekend',
 'Livraison offerte tous les weekends sans minimum',
 'FREESHIP', NULL, NULL, 'FREE_DELIVERY',
 'https://images.unsplash.com/photo-1526367790999-0150786686a2?w=800&h=400&fit=crop',
 NOW() - INTERVAL 5 DAY, NOW() + INTERVAL 7 DAY,
 1, 500, 89, NULL, NULL),

(3, 'Happy Hour -15%',
 '15% de réduction entre 14h et 17h',
 'HAPPY15', 15, NULL, 'PERCENTAGE',
 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=400&fit=crop',
 NOW() - INTERVAL 2 DAY, NOW() + INTERVAL 14 DAY,
 1, 200, 67, 20.00, NULL),

(4, '-5€ sur votre commande',
 '5 euros de réduction dès 25€ d\'achat',
 'SAVE5', NULL, 5.00, 'FIXED_AMOUNT',
 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&h=400&fit=crop',
 NOW() - INTERVAL 3 DAY, NOW() + INTERVAL 21 DAY,
 1, 300, 112, 25.00, NULL),

(5, 'Sushi Master — 10% OFF',
 '10% de réduction chez Sushi Master',
 'SUSHI10', 10, NULL, 'PERCENTAGE',
 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&h=400&fit=crop',
 NOW() - INTERVAL 1 DAY, NOW() + INTERVAL 10 DAY,
 1, 150, 43, 18.00, '2'),

(6, 'Pizza Party !',
 'Achetez 2 pizzas, obtenez la 3ème gratuite',
 'PIZZA3', NULL, NULL, 'BUY_ONE_GET_ONE',
 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=400&fit=crop',
 NOW() - INTERVAL 2 DAY, NOW() + INTERVAL 5 DAY,
 1, 100, 28, NULL, '3'),

(7, 'Offre Été — Expirée',
 'Promotion été terminée',
 'SUMMER10', 10, NULL, 'PERCENTAGE',
 NULL,
 NOW() - INTERVAL 60 DAY, NOW() - INTERVAL 1 DAY,
 0, 500, 312, NULL, NULL),

(8, 'Flash Sale -25%',
 '25% de réduction pendant 48h seulement !',
 'FLASH25', 25, NULL, 'PERCENTAGE',
 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&h=400&fit=crop',
 NOW(), NOW() + INTERVAL 2 DAY,
 1, 50, 8, 30.00, NULL);
