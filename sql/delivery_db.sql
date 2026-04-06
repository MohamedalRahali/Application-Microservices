-- ============================================
-- DELIVERY SERVICE — Données de test
-- Base: delivery_db
-- ============================================

USE delivery_db;

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE deliveries;
TRUNCATE TABLE drivers;
SET FOREIGN_KEY_CHECKS = 1;

-- LIVREURS
INSERT INTO drivers (id, name, phone, avatar, vehicle, rating, available, current_latitude, current_longitude) VALUES
(1, 'Ahmed Benali',   '+213 555 0101', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',  'Moto Yamaha MT-07',   4.8, 1, 48.8566, 2.3522),
(2, 'Karim Meziane',  '+213 555 0102', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',  'Vélo électrique',     4.9, 1, 48.8606, 2.3376),
(3, 'Youcef Hamidi',  '+213 555 0103', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',  'Scooter Honda PCX',   4.7, 0, 48.8584, 2.2945),
(4, 'Sofiane Kaci',   '+213 555 0104', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop',  'Moto Kawasaki',       4.6, 1, 48.8700, 2.3300),
(5, 'Riad Bensalem',  '+213 555 0105', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop',  'Scooter Yamaha NMAX', 4.5, 1, 48.8480, 2.3500);

-- LIVRAISONS
INSERT INTO deliveries (id, order_id, customer_id, restaurant_id, delivery_address, delivery_latitude, delivery_longitude, status, driver_id, driver_name, driver_phone, driver_vehicle, driver_rating, driver_avatar, estimated_minutes, current_latitude, current_longitude, created_at, picked_up_at, delivered_at) VALUES

(1, 'ORD-001', 'user-1', '2', '15 Rue de la Paix, 75002 Paris',
 48.8698, 2.3309, 'ON_THE_WAY',
 '3', 'Youcef Hamidi', '+213 555 0103', 'Scooter Honda PCX', 4.7,
 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
 12, 48.8620, 2.3400,
 NOW() - INTERVAL 20 MINUTE, NOW() - INTERVAL 10 MINUTE, NULL),

(2, 'ORD-002', 'user-2', '1', '42 Avenue des Champs-Élysées, 75008 Paris',
 48.8738, 2.2950, 'DELIVERED',
 '1', 'Ahmed Benali', '+213 555 0101', 'Moto Yamaha MT-07', 4.8,
 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
 0, NULL, NULL,
 NOW() - INTERVAL 2 HOUR, NOW() - INTERVAL 90 MINUTE, NOW() - INTERVAL 1 HOUR),

(3, 'ORD-003', 'user-3', '3', '8 Rue du Faubourg Saint-Antoine, 75011 Paris',
 48.8533, 2.3692, 'PREPARING',
 '4', 'Sofiane Kaci', '+213 555 0104', 'Moto Kawasaki', 4.6,
 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop',
 25, NULL, NULL,
 NOW() - INTERVAL 10 MINUTE, NULL, NULL),

(4, 'ORD-004', 'user-1', '5', '22 Boulevard Haussmann, 75009 Paris',
 48.8737, 2.3322, 'CONFIRMED',
 '2', 'Karim Meziane', '+213 555 0102', 'Vélo électrique', 4.9,
 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
 35, NULL, NULL,
 NOW() - INTERVAL 5 MINUTE, NULL, NULL),

(5, 'ORD-005', 'user-4', '4', '3 Place de la République, 75003 Paris',
 48.8674, 2.3634, 'DELIVERED',
 '5', 'Riad Bensalem', '+213 555 0105', 'Scooter Yamaha NMAX', 4.5,
 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop',
 0, NULL, NULL,
 NOW() - INTERVAL 3 HOUR, NOW() - INTERVAL 150 MINUTE, NOW() - INTERVAL 2 HOUR),

(6, 'ORD-006', 'user-5', '2', '55 Rue de Rivoli, 75001 Paris',
 48.8603, 2.3477, 'PENDING',
 NULL, NULL, NULL, NULL, NULL, NULL,
 30, NULL, NULL,
 NOW() - INTERVAL 2 MINUTE, NULL, NULL),

(7, 'ORD-007', 'user-2', '3', '18 Rue Montorgueil, 75001 Paris',
 48.8632, 2.3474, 'CANCELLED',
 NULL, NULL, NULL, NULL, NULL, NULL,
 0, NULL, NULL,
 NOW() - INTERVAL 1 HOUR, NULL, NULL);
