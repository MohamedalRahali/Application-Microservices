package com.foodexpress.promotion.dto;

import com.foodexpress.promotion.model.Promotion;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ValidateCodeResponse {
    private boolean valid;
    private String message;
    private Promotion promotion;
    private Double discountValue;
}
