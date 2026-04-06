package com.foodexpress.menu.dto;

import com.foodexpress.menu.model.MenuCategory;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class MenuDto {
    private Long restaurantId;
    private List<MenuCategory> categories;
}
