package com.foodexpress.promotion.config;

import com.foodexpress.promotion.model.Promotion;
import com.foodexpress.promotion.model.PromotionType;
import com.foodexpress.promotion.repository.PromotionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
@ConditionalOnProperty(name = "app.seed.enabled", havingValue = "true")
public class DataInitializer implements CommandLineRunner {

    private final PromotionRepository promotionRepository;

    @Override
    public void run(String... args) {
        if (promotionRepository.count() > 0) return;

        Promotion p1 = new Promotion();
        p1.setTitle("Bienvenue sur FoodExpress !");
        p1.setDescription("20% de réduction sur votre première commande");
        p1.setCode("WELCOME20");
        p1.setDiscountPercent(20);
        p1.setType(PromotionType.PERCENTAGE);
        p1.setImage("https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=400&fit=crop");
        p1.setValidFrom(LocalDateTime.now().minusDays(1));
        p1.setValidUntil(LocalDateTime.now().plusDays(30));
        p1.setActive(true);
        p1.setUsageLimit(1000);
        p1.setUsageCount(245);
        p1.setMinOrderAmount(15.0);
        promotionRepository.save(p1);

        Promotion p2 = new Promotion();
        p2.setTitle("Livraison Gratuite");
        p2.setDescription("Livraison offerte sans minimum d'achat");
        p2.setCode("FREESHIP");
        p2.setType(PromotionType.FREE_DELIVERY);
        p2.setImage("https://images.unsplash.com/photo-1526367790999-0150786686a2?w=800&h=400&fit=crop");
        p2.setValidFrom(LocalDateTime.now().minusDays(5));
        p2.setValidUntil(LocalDateTime.now().plusDays(7));
        p2.setActive(true);
        p2.setUsageLimit(500);
        p2.setUsageCount(89);
        promotionRepository.save(p2);

        Promotion p3 = new Promotion();
        p3.setTitle("Happy Hour -15%");
        p3.setDescription("15% de réduction entre 14h et 17h");
        p3.setCode("HAPPY15");
        p3.setDiscountPercent(15);
        p3.setType(PromotionType.PERCENTAGE);
        p3.setImage("https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=400&fit=crop");
        p3.setValidFrom(LocalDateTime.now().minusDays(2));
        p3.setValidUntil(LocalDateTime.now().plusDays(14));
        p3.setActive(true);
        p3.setUsageLimit(200);
        p3.setUsageCount(67);
        p3.setMinOrderAmount(20.0);
        promotionRepository.save(p3);

        Promotion p4 = new Promotion();
        p4.setTitle("Offre Été Expirée");
        p4.setDescription("Promotion été terminée");
        p4.setCode("SUMMER10");
        p4.setDiscountPercent(10);
        p4.setType(PromotionType.PERCENTAGE);
        p4.setValidFrom(LocalDateTime.now().minusDays(60));
        p4.setValidUntil(LocalDateTime.now().minusDays(1));
        p4.setActive(false);
        p4.setUsageCount(312);
        promotionRepository.save(p4);
    }
}
