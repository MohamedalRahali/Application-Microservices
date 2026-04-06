package com.foodexpress.promotion.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.time.LocalDateTime;

@Entity
@Table(name = "promotions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Promotion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String title;

    private String description;

    @Column(unique = true)
    private String code;

    private Integer discountPercent;
    private Double discountAmount;

    @Enumerated(EnumType.STRING)
    @NotNull
    private PromotionType type;

    private String image;

    @NotNull
    private LocalDateTime validFrom = LocalDateTime.now();

    @NotNull
    private LocalDateTime validUntil;

    private Boolean active = true;
    private Integer usageLimit;
    private Integer usageCount = 0;

    private Double minOrderAmount;
    private String restaurantId; // null = applies to all
}
