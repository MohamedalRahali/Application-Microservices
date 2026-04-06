package com.foodexpress.restaurant.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RestaurantStatsDto {
    private long totalRestaurants;
    private long activeRestaurants;
    private long promotedRestaurants;
    private long totalCategories;
}
