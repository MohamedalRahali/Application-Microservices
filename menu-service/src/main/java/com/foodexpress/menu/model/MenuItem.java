package com.foodexpress.menu.model;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "menu_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MenuItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String name;

    private String description;

    @NotNull
    private Double price;

    /** Image URL; Angular envoie souvent "imageUrl" — alias JSON */
    @JsonAlias("imageUrl")
    private String image;

    private Boolean popular = false;
    private Boolean vegetarian = false;
    private Boolean available = true;
    private Long restaurantId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "menu_category_id")
    @JsonIgnore
    private MenuCategory menuCategory;

    @JsonProperty("categoryId")
    public Long getCategoryId() {
        return menuCategory == null ? null : menuCategory.getId();
    }

    @JsonProperty("categoryId")
    public void setCategoryId(Long categoryId) {
        if (categoryId == null) {
            this.menuCategory = null;
        } else {
            MenuCategory ref = new MenuCategory();
            ref.setId(categoryId);
            this.menuCategory = ref;
        }
    }
}
