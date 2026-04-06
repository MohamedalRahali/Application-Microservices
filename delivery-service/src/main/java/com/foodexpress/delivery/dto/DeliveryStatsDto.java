package com.foodexpress.delivery.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DeliveryStatsDto {
    private long totalDeliveries;
    private long pendingDeliveries;
    private long activeDeliveries;
    private long completedDeliveries;
    private long cancelledDeliveries;
    private long totalDrivers;
    private long availableDrivers;
}
