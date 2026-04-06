package com.foodexpress.menu.controller;

import com.foodexpress.menu.dto.MenuDto;
import com.foodexpress.menu.model.MenuCategory;
import com.foodexpress.menu.model.MenuItem;
import com.foodexpress.menu.service.MenuService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/menus")
@RequiredArgsConstructor
public class MenuController {

    private final MenuService menuService;

    // Full menu for a restaurant (categories + items)
    @GetMapping("/restaurant/{restaurantId}")
    public MenuDto getMenu(@PathVariable Long restaurantId) {
        return menuService.getMenuByRestaurant(restaurantId);
    }

    // All items for a restaurant (flat list)
    @GetMapping("/restaurant/{restaurantId}/items")
    public List<MenuItem> getItems(@PathVariable Long restaurantId) {
        return menuService.getItemsByRestaurant(restaurantId);
    }

    // Popular items
    @GetMapping("/restaurant/{restaurantId}/popular")
    public List<MenuItem> getPopular(@PathVariable Long restaurantId) {
        return menuService.getPopularItems(restaurantId);
    }

    // Single item
    @GetMapping("/items")
    public List<MenuItem> getAllItems() {
        return menuService.getAllItems();
    }

    // Single item
    @GetMapping("/items/{id}")
    public ResponseEntity<MenuItem> getItem(@PathVariable Long id) {
        return menuService.getItemById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Create item
    @PostMapping("/items")
    public MenuItem createItem(@Valid @RequestBody MenuItem item) {
        return menuService.saveItem(item);
    }

    // Update item
    @PutMapping("/items/{id}")
    public ResponseEntity<MenuItem> updateItem(@PathVariable Long id, @Valid @RequestBody MenuItem item) {
        return menuService.updateItem(id, item)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/items/{id}/toggle-availability")
    public ResponseEntity<MenuItem> toggleAvailability(@PathVariable Long id) {
        return menuService.toggleItemAvailability(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Delete item
    @DeleteMapping("/items/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable Long id) {
        menuService.deleteItem(id);
        return ResponseEntity.noContent().build();
    }

    // Create category
    @GetMapping("/categories")
    public List<MenuCategory> getAllCategories() {
        return menuService.getAllCategories();
    }

    @GetMapping("/categories/{id}")
    public ResponseEntity<MenuCategory> getCategory(@PathVariable Long id) {
        return menuService.getCategoryById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/categories/restaurant/{restaurantId}")
    public List<MenuCategory> getCategoriesByRestaurant(@PathVariable Long restaurantId) {
        return menuService.getCategoriesByRestaurant(restaurantId);
    }

    @PostMapping("/categories")
    public MenuCategory createCategory(@RequestBody MenuCategory category) {
        return menuService.saveCategory(category);
    }

    @PutMapping("/categories/{id}")
    public ResponseEntity<MenuCategory> updateCategory(@PathVariable Long id, @RequestBody MenuCategory category) {
        return menuService.updateCategory(id, category)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Delete category
    @DeleteMapping("/categories/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        menuService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/stats")
    public MenuService.MenuStats getStats() {
        return menuService.getStats();
    }
}
