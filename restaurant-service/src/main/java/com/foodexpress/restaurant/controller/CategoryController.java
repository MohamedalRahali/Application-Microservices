package com.foodexpress.restaurant.controller;

import com.foodexpress.restaurant.model.Category;
import com.foodexpress.restaurant.service.RestaurantService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/restaurants/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final RestaurantService restaurantService;

    @GetMapping
    public List<Category> getAll() { return restaurantService.getAllCategories(); }

    @PostMapping
    public Category create(@RequestBody Category category) { return restaurantService.saveCategory(category); }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        restaurantService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }
}
