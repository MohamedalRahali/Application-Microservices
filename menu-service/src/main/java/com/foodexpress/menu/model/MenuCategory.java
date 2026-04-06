package com.foodexpress.menu.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;

@Entity
@Table(name = "menu_categories")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MenuCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String name;

    /** Présent en base (menu_categories.description) — utilisé par l’admin */
    private String description;

    private Long restaurantId;
    private Integer displayOrder = 0;

    @OneToMany(mappedBy = "menuCategory", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<MenuItem> items;
}
