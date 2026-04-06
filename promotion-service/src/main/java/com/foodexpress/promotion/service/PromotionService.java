package com.foodexpress.promotion.service;

import com.foodexpress.promotion.dto.PromotionStatsDto;
import com.foodexpress.promotion.dto.ValidateCodeRequest;
import com.foodexpress.promotion.dto.ValidateCodeResponse;
import com.foodexpress.promotion.model.Promotion;
import com.foodexpress.promotion.model.PromotionType;
import com.foodexpress.promotion.repository.PromotionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PromotionService {

    private final PromotionRepository promotionRepository;

    public List<Promotion> getAllPromotions() {
        return promotionRepository.findAll();
    }

    public List<Promotion> getActivePromotions() {
        return promotionRepository.findActiveAndValid(LocalDateTime.now());
    }

    public Optional<Promotion> getById(Long id) {
        return promotionRepository.findById(id);
    }

    @Transactional
    public Promotion save(Promotion promotion) {
        return promotionRepository.save(promotion);
    }

    @Transactional
    public Optional<Promotion> update(Long id, Promotion promotion) {
        return promotionRepository.findById(id).map(existing -> {
            promotion.setId(id);
            return promotionRepository.save(promotion);
        });
    }

    @Transactional
    public void delete(Long id) {
        promotionRepository.deleteById(id);
    }

    @Transactional
    public ValidateCodeResponse validateCode(ValidateCodeRequest request) {
        Optional<Promotion> opt = promotionRepository.findByCode(request.getCode().toUpperCase());
        if (opt.isEmpty()) {
            return new ValidateCodeResponse(false, "Code promo invalide", null, 0.0);
        }
        Promotion promo = opt.get();
        LocalDateTime now = LocalDateTime.now();

        if (!promo.getActive()) {
            return new ValidateCodeResponse(false, "Ce code promo n'est plus actif", null, 0.0);
        }
        if (now.isBefore(promo.getValidFrom()) || now.isAfter(promo.getValidUntil())) {
            return new ValidateCodeResponse(false, "Ce code promo a expiré", null, 0.0);
        }
        if (promo.getUsageLimit() != null && promo.getUsageCount() >= promo.getUsageLimit()) {
            return new ValidateCodeResponse(false, "Ce code promo a atteint sa limite d'utilisation", null, 0.0);
        }
        if (promo.getMinOrderAmount() != null && request.getOrderAmount() != null
                && request.getOrderAmount() < promo.getMinOrderAmount()) {
            return new ValidateCodeResponse(false,
                "Montant minimum de commande requis: " + promo.getMinOrderAmount() + "€", null, 0.0);
        }

        double discount = calculateDiscount(promo, request.getOrderAmount());
        promo.setUsageCount(promo.getUsageCount() + 1);
        promotionRepository.save(promo);

        return new ValidateCodeResponse(true, "Code promo appliqué avec succès", promo, discount);
    }

    private double calculateDiscount(Promotion promo, Double orderAmount) {
        if (promo.getType() == PromotionType.PERCENTAGE && promo.getDiscountPercent() != null && orderAmount != null) {
            return orderAmount * promo.getDiscountPercent() / 100.0;
        } else if (promo.getType() == PromotionType.FIXED_AMOUNT && promo.getDiscountAmount() != null) {
            return promo.getDiscountAmount();
        } else if (promo.getType() == PromotionType.FREE_DELIVERY) {
            return 0.0; // handled by frontend
        }
        return 0.0;
    }

    public PromotionStatsDto getStats() {
        long total = promotionRepository.count();
        long active = promotionRepository.findActiveAndValid(LocalDateTime.now()).size();
        long expired = promotionRepository.findByActive(false).size();
        long usages = promotionRepository.findAll().stream()
                .mapToLong(p -> p.getUsageCount() != null ? p.getUsageCount() : 0).sum();
        return new PromotionStatsDto(total, active, expired, usages);
    }
}
