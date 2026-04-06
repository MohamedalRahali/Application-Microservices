# Scripts SQL — Données de test

## Comment utiliser

### Option 1 — phpMyAdmin (recommandé)

1. Ouvre **http://localhost/phpmyadmin**
2. Clique sur l'onglet **SQL** (en haut)
3. Copie-colle le contenu du fichier SQL voulu
4. Clique **Exécuter**

### Option 2 — Un fichier à la fois

Importe chaque fichier dans l'ordre :

| Fichier              | Base de données   | Service             |
|----------------------|-------------------|---------------------|
| `restaurant_db.sql`  | `restaurant_db`   | restaurant-service  |
| `menu_db.sql`        | `menu_db`         | menu-service        |
| `delivery_db.sql`    | `delivery_db`     | delivery-service    |
| `promotion_db.sql`   | `promotion_db`    | promotion-service   |

### Option 3 — Ligne de commande MySQL

```bash
mysql -u root -p restaurant_db < restaurant_db.sql
mysql -u root -p menu_db < menu_db.sql
mysql -u root -p delivery_db < delivery_db.sql
mysql -u root -p promotion_db < promotion_db.sql
```

## Données incluses

- **10 restaurants** avec images, notes, catégories
- **35 items de menu** répartis sur 5 restaurants (15 catégories)
- **5 livreurs** + **7 livraisons** dans différents statuts
- **8 promotions** (actives, expirées, par restaurant)

## Codes promo à tester

| Code       | Réduction         | Min commande |
|------------|-------------------|--------------|
| WELCOME20  | -20%              | 15€          |
| FREESHIP   | Livraison gratuite| —            |
| HAPPY15    | -15%              | 20€          |
| SAVE5      | -5€               | 25€          |
| FLASH25    | -25%              | 30€          |
| SUSHI10    | -10% (Sushi)      | 18€          |
