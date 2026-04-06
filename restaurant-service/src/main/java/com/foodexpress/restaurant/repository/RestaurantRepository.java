package com.foodexpress.restaurant.repository;

import com.foodexpress.restaurant.model.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {
    List<Restaurant> findByActiveTrue();
    List<Restaurant> findByPromotedTrueAndActiveTrue();

    @Query("SELECT r FROM Restaurant r WHERE r.active = true AND " +
           "(LOWER(r.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(r.cuisine) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Restaurant> search(String query);

    @Query("SELECT r FROM Restaurant r WHERE r.active = true AND " +
           "LOWER(r.categories) LIKE LOWER(CONCAT('%', :category, '%'))")
    List<Restaurant> findByCategory(String category);

    long countByActiveTrue();
    long countByPromotedTrue();
}
