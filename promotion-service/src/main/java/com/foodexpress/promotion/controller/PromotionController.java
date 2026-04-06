package com.foodexpress.promotion.controller;

import com.foodexpress.promotion.dto.PromotionStatsDto;
import com.foodexpress.promotion.dto.ValidateCodeRequest;
import com.foodexpress.promotion.dto.ValidateCodeResponse;
import com.foodexpress.promotion.model.Promotion;
import com.foodexpress.promotion.service.PromotionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/promotions")
@RequiredArgsConstructor
public class PromotionController {

    private final PromotionService promotionService;

    @GetMapping
    public List<Promotion> getAll() {
        return promotionService.getAllPromotions();
    }

    @GetMapping("/active")
    public List<Promotion> getActive() {
        return promotionService.getActivePromotions();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Promotion> getById(@PathVariable Long id) {
        return promotionService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/stats")
    public PromotionStatsDto getStats() {
        return promotionService.getStats();
    }

    @PostMapping
    public Promotion create(@Valid @RequestBody Promotion promotion) {
        return promotionService.save(promotion);
    }

    @PostMapping("/validate")
    public ValidateCodeResponse validateCode(@Valid @RequestBody ValidateCodeRequest request) {
        return promotionService.validateCode(request);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Promotion> update(@PathVariable Long id, @Valid @RequestBody Promotion promotion) {
        return promotionService.update(id, promotion)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        promotionService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
