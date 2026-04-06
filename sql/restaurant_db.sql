-- ============================================
-- RESTAURANT SERVICE — Données de test
-- Base: restaurant_db
-- ============================================

USE restaurant_db;

-- Vider les tables existantes
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE categories;
TRUNCATE TABLE restaurants;
SET FOREIGN_KEY_CHECKS = 1;

-- CATEGORIES
INSERT INTO categories (id, name, icon, restaurant_count) VALUES
(1, 'Française',    '🥐', 24),
(2, 'Japonaise',    '🍣', 18),
(3, 'Italienne',    '🍕', 31),
(4, 'Américaine',   '🍔', 15),
(5, 'Chinoise',     '🥡', 22),
(6, 'Indienne',     '🍛', 12),
(7, 'Mexicaine',    '🌮',  9),
(8, 'Desserts',     '🍰', 20),
(9, 'Vietnamienne', '🍜', 14),
(10,'Libanaise',    '🧆', 11);

-- RESTAURANTS
INSERT INTO restaurants (id, name, cuisine, rating, rating_count, delivery_time, delivery_fee, min_order, image, promoted, discount, latitude, longitude, description, categories, active) VALUES
(1, 'Le Bistrot Parisien', 'Française', 4.8, 1250, '25-35', 2.50, 15.00,
 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop',
 1, 20, 48.8566, 2.3522, 'Cuisine française authentique avec des produits frais', 'Française,Bistrot', 1),

(2, 'Sushi Master', 'Japonaise', 4.9, 890, '30-40', 3.00, 20.00,
 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=600&h=400&fit=crop',
 0, NULL, 48.8606, 2.3376, 'Les meilleurs sushi de Paris', 'Japonaise,Sushi', 1),

(3, 'Pizza Napoli', 'Italienne', 4.6, 2100, '20-30', 1.99, 12.00,
 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop',
 1, 15, 48.8584, 2.2945, 'Pizzas artisanales au feu de bois', 'Italienne,Pizza', 1),

(4, 'Burger King', 'Américaine', 4.5, 3200, '15-25', 1.50, 10.00,
 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600&h=400&fit=crop',
 0, NULL, 48.8738, 2.2950, 'Burgers gourmands et généreux', 'Américaine,Burgers', 1),

(5, 'Saigon Street', 'Vietnamienne', 4.7, 560, '25-35', 2.00, 15.00,
 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=600&h=400&fit=crop',
 1, 10, 48.8520, 2.3400, 'Saveurs authentiques du Vietnam', 'Vietnamienne,Asiatique', 1),

(6, 'Taj Mahal', 'Indienne', 4.4, 430, '30-45', 2.50, 18.00,
 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&h=400&fit=crop',
 0, NULL, 48.8650, 2.3600, 'Cuisine indienne épicée et parfumée', 'Indienne,Curry', 1),

(7, 'Wok Dynasty', 'Chinoise', 4.3, 780, '20-30', 1.50, 12.00,
 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&h=400&fit=crop',
 1, 5, 48.8700, 2.3300, 'Cuisine chinoise traditionnelle', 'Chinoise,Wok', 1),

(8, 'El Rancho', 'Mexicaine', 4.5, 320, '25-35', 2.00, 14.00,
 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&h=400&fit=crop',
 0, NULL, 48.8480, 2.3500, 'Tacos et burritos authentiques', 'Mexicaine', 1),

(9, 'Maison du Liban', 'Libanaise', 4.6, 290, '30-40', 2.50, 16.00,
 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&h=400&fit=crop',
 1, 12, 48.8610, 2.3450, 'Mezze et grillades libanaises', 'Libanaise', 1),

(10, 'Sweet Paradise', 'Desserts', 4.8, 1100, '15-25', 1.00, 8.00,
 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&h=400&fit=crop',
 1, 0, 48.8555, 2.3480, 'Gâteaux, crêpes et desserts maison', 'Desserts,Pâtisserie', 1);
