package com.foodexpress.menu.service;

import com.foodexpress.menu.dto.MenuDto;
import com.foodexpress.menu.model.MenuCategory;
import com.foodexpress.menu.model.MenuItem;
import com.foodexpress.menu.repository.MenuCategoryRepository;
import com.foodexpress.menu.repository.MenuItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.DoubleSummaryStatistics;

@Service
@RequiredArgsConstructor
public class MenuService {

    private final MenuCategoryRepository categoryRepository;
    private final MenuItemRepository itemRepository;

    public MenuDto getMenuByRestaurant(Long restaurantId) {
        List<MenuCategory> categories = categoryRepository.findByRestaurantIdOrderByDisplayOrder(restaurantId);
        return new MenuDto(restaurantId, categories);
    }

    public List<MenuItem> getItemsByRestaurant(Long restaurantId) {
        return itemRepository.findByRestaurantId(restaurantId);
    }

    public List<MenuItem> getPopularItems(Long restaurantId) {
        return itemRepository.findByRestaurantIdAndPopularTrue(restaurantId);
    }

    public Optional<MenuItem> getItemById(Long id) {
        return itemRepository.findById(id);
    }

    public List<MenuItem> getAllItems() {
        return itemRepository.findAll();
    }

    public List<MenuCategory> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Optional<MenuCategory> getCategoryById(Long id) {
        return categoryRepository.findById(id);
    }

    public List<MenuCategory> getCategoriesByRestaurant(Long restaurantId) {
        return categoryRepository.findByRestaurantIdOrderByDisplayOrder(restaurantId);
    }

    @Transactional
    public MenuCategory saveCategory(MenuCategory category) {
        return categoryRepository.save(category);
    }

    @Transactional
    public void deleteCategory(Long id) {
        categoryRepository.deleteById(id);
    }

    @Transactional
    public MenuItem saveItem(MenuItem item) {
        Long cid = item.getCategoryId();
        if (cid != null) {
            item.setMenuCategory(categoryRepository.getReferenceById(cid));
        }
        return itemRepository.save(item);
    }

    @Transactional
    public Optional<MenuItem> updateItem(Long id, MenuItem item) {
        return itemRepository.findById(id).map(existing -> {
            item.setId(id);
            Long cid = item.getCategoryId();
            if (cid != null) {
                item.setMenuCategory(categoryRepository.getReferenceById(cid));
            }
            return itemRepository.save(item);
        });
    }

    @Transactional
    public Optional<MenuItem> toggleItemAvailability(Long id) {
        return itemRepository.findById(id).map(item -> {
            item.setAvailable(!Boolean.TRUE.equals(item.getAvailable()));
            return itemRepository.save(item);
        });
    }

    @Transactional
    public void deleteItem(Long id) {
        itemRepository.deleteById(id);
    }

    @Transactional
    public Optional<MenuCategory> updateCategory(Long id, MenuCategory category) {
        return categoryRepository.findById(id).map(existing -> {
            category.setId(id);
            return categoryRepository.save(category);
        });
    }

    public MenuStats getStats() {
        List<MenuItem> items = itemRepository.findAll();
        long availableCount = items.stream().filter(i -> Boolean.TRUE.equals(i.getAvailable())).count();
        DoubleSummaryStatistics priceStats = items.stream()
                .filter(i -> i.getPrice() != null)
                .mapToDouble(MenuItem::getPrice)
                .summaryStatistics();

        return new MenuStats(
                items.size(),
                categoryRepository.count(),
                availableCount,
                items.size() - availableCount,
                priceStats.getCount() > 0 ? priceStats.getAverage() : 0.0
        );
    }

    public record MenuStats(long totalItems, long totalCategories, long availableItems, long unavailableItems, double averagePrice) {}
}
