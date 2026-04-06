-- ============================================
-- MENU SERVICE — Données de test
-- Base: menu_db
-- ============================================

USE menu_db;

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE menu_items;
TRUNCATE TABLE menu_categories;
SET FOREIGN_KEY_CHECKS = 1;

-- CATÉGORIES DE MENU
INSERT INTO menu_categories (id, name, restaurant_id, display_order) VALUES
-- Restaurant 1 — Le Bistrot Parisien
(1,  'Entrées',   1, 1),
(2,  'Plats',     1, 2),
(3,  'Desserts',  1, 3),
-- Restaurant 2 — Sushi Master
(4,  'Sushis & Makis', 2, 1),
(5,  'Ramens',         2, 2),
(6,  'Entrées',        2, 3),
-- Restaurant 3 — Pizza Napoli
(7,  'Pizzas',   3, 1),
(8,  'Pâtes',    3, 2),
(9,  'Salades',  3, 3),
-- Restaurant 4 — Burger King
(10, 'Burgers',  4, 1),
(11, 'Sides',    4, 2),
(12, 'Boissons', 4, 3),
-- Restaurant 5 — Saigon Street
(13, 'Soupes',   5, 1),
(14, 'Plats',    5, 2),
(15, 'Entrées',  5, 3);

-- ITEMS — Restaurant 1 (Le Bistrot Parisien)
INSERT INTO menu_items (id, name, description, price, image, popular, vegetarian, available, restaurant_id, menu_category_id) VALUES
(1,  'Soupe à l\'oignon',   'Soupe gratinée traditionnelle au gruyère',        8.50,  'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=300&h=200&fit=crop', 1, 0, 1, 1, 1),
(2,  'Salade Niçoise',      'Thon, olives, tomates, œufs durs, anchois',       11.00, 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=200&fit=crop', 0, 0, 1, 1, 1),
(3,  'Foie Gras Maison',    'Foie gras de canard, toast brioche, chutney',     16.00, 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300&h=200&fit=crop', 1, 0, 1, 1, 1),
(4,  'Bœuf Bourguignon',    'Bœuf mijoté au vin rouge, carottes, champignons', 18.50, 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=300&h=200&fit=crop', 1, 0, 1, 1, 2),
(5,  'Poulet Rôti',         'Poulet fermier, pommes de terre sarladaises',     16.00, 'https://images.unsplash.com/photo-1598103442097-8b74394b95c3?w=300&h=200&fit=crop', 0, 0, 1, 1, 2),
(6,  'Sole Meunière',       'Sole fraîche, beurre citronné, câpres',           22.00, 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=300&h=200&fit=crop', 0, 0, 1, 1, 2),
(7,  'Crème Brûlée',        'Crème vanille, caramel croustillant',              7.50, 'https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=300&h=200&fit=crop', 1, 1, 1, 1, 3),
(8,  'Tarte Tatin',         'Tarte aux pommes caramélisées, crème fraîche',    8.00, 'https://images.unsplash.com/photo-1568571780765-9276ac8b75a2?w=300&h=200&fit=crop', 0, 1, 1, 1, 3),

-- ITEMS — Restaurant 2 (Sushi Master)
(9,  'Plateau Sushi 12p',   'Saumon x4, thon x4, crevette x4',               18.90, 'https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=300&h=200&fit=crop', 1, 0, 1, 2, 4),
(10, 'California Roll x8',  'Avocat, crabe, concombre, sésame',               12.50, 'https://images.unsplash.com/photo-1562802378-063ec186a863?w=300&h=200&fit=crop', 1, 0, 1, 2, 4),
(11, 'Sashimi Saumon x6',   'Saumon frais, gingembre, wasabi',                14.00, 'https://images.unsplash.com/photo-1534482421-64566f976cfa?w=300&h=200&fit=crop', 0, 0, 1, 2, 4),
(12, 'Ramen Tonkotsu',      'Bouillon de porc, chashu, œuf mollet, nori',     14.90, 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300&h=200&fit=crop', 1, 0, 1, 2, 5),
(13, 'Ramen Végétarien',    'Bouillon miso, tofu, champignons, légumes',      13.50, 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300&h=200&fit=crop', 0, 1, 1, 2, 5),
(14, 'Edamame',             'Fèves de soja vapeur, fleur de sel',              5.50, 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=200&fit=crop', 0, 1, 1, 2, 6),
(15, 'Gyoza x6',            'Raviolis japonais poêlés, sauce ponzu',           8.90, 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=300&h=200&fit=crop', 1, 0, 1, 2, 6),

-- ITEMS — Restaurant 3 (Pizza Napoli)
(16, 'Margherita',          'Tomate, mozzarella fior di latte, basilic',      11.00, 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=300&h=200&fit=crop', 1, 1, 1, 3, 7),
(17, 'Quattro Formaggi',    'Mozzarella, gorgonzola, parmesan, chèvre',       13.50, 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300&h=200&fit=crop', 1, 1, 1, 3, 7),
(18, 'Diavola',             'Salami piquant, olives noires, piment',          13.00, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&h=200&fit=crop', 0, 0, 1, 3, 7),
(19, 'Prosciutto e Funghi', 'Jambon cru, champignons, mozzarella',            14.00, 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=300&h=200&fit=crop', 0, 0, 1, 3, 7),
(20, 'Spaghetti Carbonara', 'Lardons fumés, œuf, parmesan, poivre noir',      12.50, 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=300&h=200&fit=crop', 1, 0, 1, 3, 8),
(21, 'Penne Arrabbiata',    'Sauce tomate épicée, ail, basilic',              10.50, 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=300&h=200&fit=crop', 0, 1, 1, 3, 8),
(22, 'Salade César',        'Romaine, parmesan, croûtons, sauce césar',        9.50, 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=300&h=200&fit=crop', 0, 0, 1, 3, 9),

-- ITEMS — Restaurant 4 (Burger King)
(23, 'Classic Burger',      'Steak 180g, cheddar, salade, tomate, cornichon', 12.00, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=200&fit=crop', 1, 0, 1, 4, 10),
(24, 'Double Smash',        'Double steak smashé, sauce spéciale, oignons',   15.00, 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=300&h=200&fit=crop', 1, 0, 1, 4, 10),
(25, 'Veggie Burger',       'Steak de légumes, avocat, roquette, tomate',     11.50, 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=300&h=200&fit=crop', 0, 1, 1, 4, 10),
(26, 'Frites Maison',       'Frites fraîches, sel, sauce au choix',            4.50, 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300&h=200&fit=crop', 1, 1, 1, 4, 11),
(27, 'Onion Rings',         'Rondelles d\'oignon panées, sauce ranch',         5.00, 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=300&h=200&fit=crop', 0, 1, 1, 4, 11),
(28, 'Coca-Cola 50cl',      'Boisson gazeuse',                                 3.00, 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=300&h=200&fit=crop', 0, 1, 1, 4, 12),

-- ITEMS — Restaurant 5 (Saigon Street)
(29, 'Pho Bo',              'Soupe de bœuf, nouilles de riz, herbes fraîches', 13.50, 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=300&h=200&fit=crop', 1, 0, 1, 5, 13),
(30, 'Pho Ga',              'Soupe de poulet, nouilles, citron vert, menthe',  12.50, 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=300&h=200&fit=crop', 0, 0, 1, 5, 13),
(31, 'Bun Bo Hue',          'Soupe épicée, bœuf, citronnelle, piment',        14.00, 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=300&h=200&fit=crop', 0, 0, 1, 5, 13),
(32, 'Bun Cha',             'Vermicelles, porc grillé, sauce nuoc-mam',       13.00, 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=300&h=200&fit=crop', 1, 0, 1, 5, 14),
(33, 'Com Tam',             'Riz brisé, côte de porc grillée, œuf au plat',   12.00, 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=300&h=200&fit=crop', 0, 0, 1, 5, 14),
(34, 'Rouleaux de Printemps','Crevettes, vermicelles, légumes, sauce hoisin',  7.50, 'https://images.unsplash.com/photo-1562802378-063ec186a863?w=300&h=200&fit=crop', 1, 0, 1, 5, 15),
(35, 'Nems x4',             'Rouleaux frits, porc, champignons, sauce',        7.00, 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=300&h=200&fit=crop', 0, 0, 1, 5, 15);
