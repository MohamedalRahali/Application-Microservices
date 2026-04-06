package com.foodexpress.delivery.controller;

import com.foodexpress.delivery.model.Driver;
import com.foodexpress.delivery.service.DeliveryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/deliveries/drivers")
@RequiredArgsConstructor
public class DriverController {

    private final DeliveryService deliveryService;

    @GetMapping
    public List<Driver> getAll() {
        return deliveryService.getAllDrivers();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Driver> getById(@PathVariable Long id) {
        return deliveryService.getDriverById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Driver create(@Valid @RequestBody Driver driver) {
        return deliveryService.saveDriver(driver);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Driver> update(@PathVariable Long id, @Valid @RequestBody Driver driver) {
        return deliveryService.getDriverById(id).map(existing -> {
            driver.setId(id);
            return ResponseEntity.ok(deliveryService.saveDriver(driver));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        deliveryService.deleteDriver(id);
        return ResponseEntity.noContent().build();
    }
}
