package com.foodexpress.restaurant.controller;

import com.foodexpress.restaurant.dto.RestaurantStatsDto;
import com.foodexpress.restaurant.model.Restaurant;
import com.foodexpress.restaurant.service.RestaurantService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/restaurants")
@RequiredArgsConstructor
public class RestaurantController {

    private final RestaurantService restaurantService;

    @GetMapping
    public List<Restaurant> getAll(@RequestParam(required = false) String search,
                                   @RequestParam(required = false) String category) {
        if (search != null && !search.isBlank()) return restaurantService.search(search);
        if (category != null && !category.isBlank()) return restaurantService.getByCategory(category);
        return restaurantService.getActive();
    }

    @GetMapping("/all")
    public List<Restaurant> getAllAdmin() { return restaurantService.getAll(); }

    @GetMapping("/promoted")
    public List<Restaurant> getPromoted() { return restaurantService.getPromoted(); }

    @GetMapping("/stats")
    public RestaurantStatsDto getStats() { return restaurantService.getStats(); }

    @GetMapping("/{id}")
    public ResponseEntity<Restaurant> getById(@PathVariable Long id) {
        return restaurantService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Restaurant create(@Valid @RequestBody Restaurant restaurant) {
        return restaurantService.save(restaurant);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Restaurant> update(@PathVariable Long id, @Valid @RequestBody Restaurant restaurant) {
        return restaurantService.update(id, restaurant)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        restaurantService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
