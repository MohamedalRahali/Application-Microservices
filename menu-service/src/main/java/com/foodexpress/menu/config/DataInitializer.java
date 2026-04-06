package com.foodexpress.menu.config;

import com.foodexpress.menu.model.MenuCategory;
import com.foodexpress.menu.model.MenuItem;
import com.foodexpress.menu.repository.MenuCategoryRepository;
import com.foodexpress.menu.repository.MenuItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@ConditionalOnProperty(name = "app.seed.enabled", havingValue = "true")
public class DataInitializer implements CommandLineRunner {

    private final MenuCategoryRepository categoryRepository;
    private final MenuItemRepository itemRepository;

    @Override
    public void run(String... args) {
        if (itemRepository.count() > 0) return;

        // Restaurant 1 — Le Bistrot Parisien
        MenuCategory entrees = new MenuCategory(null, "Entrées", null, 1L, 1, null);
        entrees = categoryRepository.save(entrees);
        MenuCategory plats = new MenuCategory(null, "Plats", null, 1L, 2, null);
        plats = categoryRepository.save(plats);
        MenuCategory desserts = new MenuCategory(null, "Desserts", null, 1L, 3, null);
        desserts = categoryRepository.save(desserts);

        itemRepository.save(new MenuItem(null, "Soupe à l'oignon", "Soupe gratinée traditionnelle", 8.50,
            "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=300&h=200&fit=crop",
            true, false, true, 1L, entrees));
        itemRepository.save(new MenuItem(null, "Salade Niçoise", "Thon, olives, tomates, œufs", 11.00,
            "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=200&fit=crop",
            false, false, true, 1L, entrees));
        itemRepository.save(new MenuItem(null, "Bœuf Bourguignon", "Bœuf mijoté au vin rouge", 18.50,
            "https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=300&h=200&fit=crop",
            true, false, true, 1L, plats));
        itemRepository.save(new MenuItem(null, "Poulet Rôti", "Poulet fermier, pommes de terre", 16.00,
            "https://images.unsplash.com/photo-1598103442097-8b74394b95c3?w=300&h=200&fit=crop",
            false, false, true, 1L, plats));
        itemRepository.save(new MenuItem(null, "Crème Brûlée", "Dessert classique à la vanille", 7.50,
            "https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=300&h=200&fit=crop",
            true, true, true, 1L, desserts));

        // Restaurant 2 — Sushi Master
        MenuCategory sushis = new MenuCategory(null, "Sushis & Makis", null, 2L, 1, null);
        sushis = categoryRepository.save(sushis);
        MenuCategory ramens = new MenuCategory(null, "Ramens", null, 2L, 2, null);
        ramens = categoryRepository.save(ramens);

        itemRepository.save(new MenuItem(null, "Plateau Sushi 12 pièces", "Saumon, thon, crevette", 18.90,
            "https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=300&h=200&fit=crop",
            true, false, true, 2L, sushis));
        itemRepository.save(new MenuItem(null, "California Roll x8", "Avocat, crabe, concombre", 12.50,
            "https://images.unsplash.com/photo-1562802378-063ec186a863?w=300&h=200&fit=crop",
            true, false, true, 2L, sushis));
        itemRepository.save(new MenuItem(null, "Ramen Tonkotsu", "Bouillon de porc, chashu, œuf mollet", 14.90,
            "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300&h=200&fit=crop",
            true, false, true, 2L, ramens));
        itemRepository.save(new MenuItem(null, "Ramen Végétarien", "Bouillon miso, tofu, légumes", 13.50,
            "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300&h=200&fit=crop",
            false, true, true, 2L, ramens));

        // Restaurant 3 — Pizza Napoli
        MenuCategory pizzas = new MenuCategory(null, "Pizzas", null, 3L, 1, null);
        pizzas = categoryRepository.save(pizzas);
        MenuCategory pastas = new MenuCategory(null, "Pâtes", null, 3L, 2, null);
        pastas = categoryRepository.save(pastas);

        itemRepository.save(new MenuItem(null, "Margherita", "Tomate, mozzarella, basilic", 11.00,
            "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=300&h=200&fit=crop",
            true, true, true, 3L, pizzas));
        itemRepository.save(new MenuItem(null, "Quattro Formaggi", "4 fromages italiens", 13.50,
            "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300&h=200&fit=crop",
            true, true, true, 3L, pizzas));
        itemRepository.save(new MenuItem(null, "Diavola", "Salami piquant, olives, piment", 13.00,
            "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&h=200&fit=crop",
            false, false, true, 3L, pizzas));
        itemRepository.save(new MenuItem(null, "Spaghetti Carbonara", "Lardons, œuf, parmesan", 12.50,
            "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=300&h=200&fit=crop",
            true, false, true, 3L, pastas));
    }
}
