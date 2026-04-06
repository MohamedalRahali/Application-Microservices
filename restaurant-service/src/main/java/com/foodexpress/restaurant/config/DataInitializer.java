package com.foodexpress.restaurant.config;

import com.foodexpress.restaurant.model.Category;
import com.foodexpress.restaurant.model.Restaurant;
import com.foodexpress.restaurant.repository.CategoryRepository;
import com.foodexpress.restaurant.repository.RestaurantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@ConditionalOnProperty(name = "app.seed.enabled", havingValue = "true")
public class DataInitializer implements CommandLineRunner {

    private final RestaurantRepository restaurantRepository;
    private final CategoryRepository categoryRepository;

    @Override
    public void run(String... args) {
        if (restaurantRepository.count() > 0) return; // don't re-seed

        // Categories
        categoryRepository.save(new Category(null, "Française", "🥐", 24));
        categoryRepository.save(new Category(null, "Japonaise", "🍣", 18));
        categoryRepository.save(new Category(null, "Italienne", "🍕", 31));
        categoryRepository.save(new Category(null, "Américaine", "🍔", 15));
        categoryRepository.save(new Category(null, "Chinoise", "🥡", 22));
        categoryRepository.save(new Category(null, "Indienne", "🍛", 12));
        categoryRepository.save(new Category(null, "Mexicaine", "🌮", 9));
        categoryRepository.save(new Category(null, "Desserts", "🍰", 20));

        // Restaurants
        Restaurant r1 = new Restaurant();
        r1.setName("Le Bistrot Parisien");
        r1.setCuisine("Française");
        r1.setRating(4.8); r1.setRatingCount(1250);
        r1.setDeliveryTime("25-35"); r1.setDeliveryFee(2.50); r1.setMinOrder(15.0);
        r1.setImage("https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop");
        r1.setPromoted(true); r1.setDiscount(20);
        r1.setLatitude(48.8566); r1.setLongitude(2.3522);
        r1.setCategories("Française,Bistrot");
        r1.setDescription("Cuisine française authentique avec des produits frais");
        restaurantRepository.save(r1);

        Restaurant r2 = new Restaurant();
        r2.setName("Sushi Master");
        r2.setCuisine("Japonaise");
        r2.setRating(4.9); r2.setRatingCount(890);
        r2.setDeliveryTime("30-40"); r2.setDeliveryFee(3.00); r2.setMinOrder(20.0);
        r2.setImage("https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=600&h=400&fit=crop");
        r2.setPromoted(false);
        r2.setLatitude(48.8606); r2.setLongitude(2.3376);
        r2.setCategories("Japonaise,Sushi");
        r2.setDescription("Les meilleurs sushi de Paris");
        restaurantRepository.save(r2);

        Restaurant r3 = new Restaurant();
        r3.setName("Pizza Napoli");
        r3.setCuisine("Italienne");
        r3.setRating(4.6); r3.setRatingCount(2100);
        r3.setDeliveryTime("20-30"); r3.setDeliveryFee(1.99); r3.setMinOrder(12.0);
        r3.setImage("https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop");
        r3.setPromoted(true); r3.setDiscount(15);
        r3.setLatitude(48.8584); r3.setLongitude(2.2945);
        r3.setCategories("Italienne,Pizza");
        r3.setDescription("Pizzas artisanales au feu de bois");
        restaurantRepository.save(r3);

        Restaurant r4 = new Restaurant();
        r4.setName("Burger King");
        r4.setCuisine("Américaine");
        r4.setRating(4.5); r4.setRatingCount(3200);
        r4.setDeliveryTime("15-25"); r4.setDeliveryFee(1.50); r4.setMinOrder(10.0);
        r4.setImage("https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600&h=400&fit=crop");
        r4.setPromoted(false);
        r4.setLatitude(48.8738); r4.setLongitude(2.2950);
        r4.setCategories("Américaine,Burgers");
        r4.setDescription("Burgers gourmands et généreux");
        restaurantRepository.save(r4);

        Restaurant r5 = new Restaurant();
        r5.setName("Saigon Street");
        r5.setCuisine("Vietnamienne");
        r5.setRating(4.7); r5.setRatingCount(560);
        r5.setDeliveryTime("25-35"); r5.setDeliveryFee(2.00); r5.setMinOrder(15.0);
        r5.setImage("https://images.unsplash.com/photo-1559314809-0d155014e29e?w=600&h=400&fit=crop");
        r5.setPromoted(true); r5.setDiscount(10);
        r5.setLatitude(48.8520); r5.setLongitude(2.3400);
        r5.setCategories("Vietnamienne,Asiatique");
        r5.setDescription("Saveurs authentiques du Vietnam");
        restaurantRepository.save(r5);

        Restaurant r6 = new Restaurant();
        r6.setName("Taj Mahal");
        r6.setCuisine("Indienne");
        r6.setRating(4.4); r6.setRatingCount(430);
        r6.setDeliveryTime("30-45"); r6.setDeliveryFee(2.50); r6.setMinOrder(18.0);
        r6.setImage("https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&h=400&fit=crop");
        r6.setPromoted(false);
        r6.setLatitude(48.8650); r6.setLongitude(2.3600);
        r6.setCategories("Indienne,Curry");
        r6.setDescription("Cuisine indienne épicée et parfumée");
        restaurantRepository.save(r6);
    }
}
