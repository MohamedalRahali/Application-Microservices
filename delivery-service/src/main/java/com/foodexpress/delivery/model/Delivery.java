package com.foodexpress.delivery.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "deliveries")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Delivery {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(unique = true)
    private String orderId;

    @NotBlank
    private String customerId;

    @NotBlank
    private String restaurantId;

    @NotBlank
    private String deliveryAddress;

    private Double deliveryLatitude;
    private Double deliveryLongitude;

    @Enumerated(EnumType.STRING)
    private DeliveryStatus status = DeliveryStatus.PENDING;

    private String driverId;
    private String driverName;
    private String driverPhone;
    private String driverVehicle;
    private Double driverRating;
    private String driverAvatar;

    private Integer estimatedMinutes;

    private Double currentLatitude;
    private Double currentLongitude;

    @NotNull
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime pickedUpAt;
    private LocalDateTime deliveredAt;
}
