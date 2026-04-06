package com.foodexpress.restaurant.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "restaurants")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Restaurant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String name;

    private String cuisine;
    private Double rating = 0.0;
    private Integer ratingCount = 0;
    private String deliveryTime; // e.g. "25-35"
    private Double deliveryFee = 0.0;
    private Double minOrder = 0.0;
    private String image;
    private Boolean promoted = false;
    private Integer discount;
    private Double latitude;
    private Double longitude;
    private String description;
    private Boolean active = true;

    // comma-separated categories e.g. "Française,Bistrot"
    private String categories;
}
