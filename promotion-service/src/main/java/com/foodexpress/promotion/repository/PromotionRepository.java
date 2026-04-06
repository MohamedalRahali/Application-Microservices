package com.foodexpress.promotion.repository;

import com.foodexpress.promotion.model.Promotion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PromotionRepository extends JpaRepository<Promotion, Long> {
    Optional<Promotion> findByCode(String code);
    List<Promotion> findByActive(Boolean active);

    @Query("SELECT p FROM Promotion p WHERE p.active = true AND p.validFrom <= :now AND p.validUntil >= :now")
    List<Promotion> findActiveAndValid(LocalDateTime now);

    long countByActive(Boolean active);
}
