package com.foodexpress.delivery.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class DeliveryRequest {
    /** Si vide, généré côté serveur (évite échec client si le front n’envoie pas la clé). */
    private String orderId;
    @NotBlank
    private String customerId;
    @NotBlank
    private String restaurantId;
    @NotBlank
    private String deliveryAddress;
    private Double deliveryLatitude;
    private Double deliveryLongitude;
    /** Id du livreur (optionnel). Si absent, assignation automatique au premier disponible. */
    private String driverId;
}
