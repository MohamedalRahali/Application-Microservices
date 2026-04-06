package com.foodexpress.delivery.controller;

import com.foodexpress.delivery.dto.DeliveryRequest;
import com.foodexpress.delivery.dto.DeliveryStatsDto;
import com.foodexpress.delivery.dto.LocationUpdateRequest;
import com.foodexpress.delivery.model.Delivery;
import com.foodexpress.delivery.model.DeliveryStatus;
import com.foodexpress.delivery.service.DeliveryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/deliveries")
@RequiredArgsConstructor
public class DeliveryController {

    private final DeliveryService deliveryService;

    @GetMapping
    public List<Delivery> getAll() {
        return deliveryService.getAllDeliveries();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Delivery> getById(@PathVariable Long id) {
        return deliveryService.getDeliveryById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<Delivery> getByOrderId(@PathVariable String orderId) {
        return deliveryService.getDeliveryByOrderId(orderId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/customer/{customerId}")
    public List<Delivery> getByCustomer(@PathVariable String customerId) {
        return deliveryService.getDeliveriesByCustomer(customerId);
    }

    @GetMapping("/status/{status}")
    public List<Delivery> getByStatus(@PathVariable DeliveryStatus status) {
        return deliveryService.getDeliveriesByStatus(status);
    }

    @GetMapping("/stats")
    public DeliveryStatsDto getStats() {
        return deliveryService.getStats();
    }

    @PostMapping
    public ResponseEntity<Delivery> create(@Valid @RequestBody DeliveryRequest request) {
        return ResponseEntity.ok(deliveryService.createDelivery(request));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Delivery> updateStatus(
            @PathVariable Long id,
            @RequestParam DeliveryStatus status) {
        return deliveryService.updateStatus(id, status)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/location")
    public ResponseEntity<Delivery> updateLocation(
            @PathVariable Long id,
            @Valid @RequestBody LocationUpdateRequest request) {
        return deliveryService.updateLocation(id, request)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        deliveryService.deleteDelivery(id);
        return ResponseEntity.noContent().build();
    }
}
