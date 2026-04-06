-- Exécuter sur menu_db si les INSERT de plats échouent avec:
--   Field 'category' doesn't have a default value (MySQL 1364)
USE menu_db;
ALTER TABLE menu_items MODIFY COLUMN category VARCHAR(255) NULL;
