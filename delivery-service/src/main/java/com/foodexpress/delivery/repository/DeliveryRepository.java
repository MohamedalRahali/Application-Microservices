package com.foodexpress.delivery.repository;

import com.foodexpress.delivery.model.Delivery;
import com.foodexpress.delivery.model.DeliveryStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DeliveryRepository extends JpaRepository<Delivery, Long> {
    Optional<Delivery> findByOrderId(String orderId);
    List<Delivery> findByCustomerId(String customerId);
    List<Delivery> findByDriverId(String driverId);
    List<Delivery> findByStatus(DeliveryStatus status);
    long countByStatus(DeliveryStatus status);
}
