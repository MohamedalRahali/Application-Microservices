package com.foodexpress.promotion.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PromotionStatsDto {
    private long totalPromotions;
    private long activePromotions;
    private long expiredPromotions;
    private long totalUsages;
}
