package com.foodexpress.restaurant.service;

import com.foodexpress.restaurant.dto.RestaurantStatsDto;
import com.foodexpress.restaurant.model.Category;
import com.foodexpress.restaurant.model.Restaurant;
import com.foodexpress.restaurant.repository.CategoryRepository;
import com.foodexpress.restaurant.repository.RestaurantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RestaurantService {

    private final RestaurantRepository restaurantRepository;
    private final CategoryRepository categoryRepository;

    public List<Restaurant> getAll() { return restaurantRepository.findAll(); }
    public List<Restaurant> getActive() { return restaurantRepository.findByActiveTrue(); }
    public List<Restaurant> getPromoted() { return restaurantRepository.findByPromotedTrueAndActiveTrue(); }
    public List<Restaurant> search(String query) { return restaurantRepository.search(query); }
    public List<Restaurant> getByCategory(String category) { return restaurantRepository.findByCategory(category); }
    public Optional<Restaurant> getById(Long id) { return restaurantRepository.findById(id); }

    @Transactional
    public Restaurant save(Restaurant restaurant) { return restaurantRepository.save(restaurant); }

    @Transactional
    public Optional<Restaurant> update(Long id, Restaurant restaurant) {
        return restaurantRepository.findById(id).map(existing -> {
            restaurant.setId(id);
            return restaurantRepository.save(restaurant);
        });
    }

    @Transactional
    public void delete(Long id) { restaurantRepository.deleteById(id); }

    public RestaurantStatsDto getStats() {
        return new RestaurantStatsDto(
            restaurantRepository.count(),
            restaurantRepository.countByActiveTrue(),
            restaurantRepository.countByPromotedTrue(),
            categoryRepository.count()
        );
    }

    // Categories
    public List<Category> getAllCategories() { return categoryRepository.findAll(); }
    public Category saveCategory(Category category) { return categoryRepository.save(category); }
    public void deleteCategory(Long id) { categoryRepository.deleteById(id); }
}
