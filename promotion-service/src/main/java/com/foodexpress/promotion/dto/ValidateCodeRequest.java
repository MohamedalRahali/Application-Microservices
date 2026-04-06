package com.foodexpress.promotion.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ValidateCodeRequest {
    @NotBlank
    private String code;
    private Double orderAmount;
}
