package com.foodexpress.delivery.service;

import com.foodexpress.delivery.dto.DeliveryRequest;
import com.foodexpress.delivery.dto.DeliveryStatsDto;
import com.foodexpress.delivery.dto.LocationUpdateRequest;
import com.foodexpress.delivery.model.Delivery;
import com.foodexpress.delivery.model.DeliveryStatus;
import com.foodexpress.delivery.model.Driver;
import com.foodexpress.delivery.repository.DeliveryRepository;
import com.foodexpress.delivery.repository.DriverRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DeliveryService {

    private final DeliveryRepository deliveryRepository;
    private final DriverRepository driverRepository;

    public List<Delivery> getAllDeliveries() {
        return deliveryRepository.findAll();
    }

    public Optional<Delivery> getDeliveryById(Long id) {
        return deliveryRepository.findById(id);
    }

    public Optional<Delivery> getDeliveryByOrderId(String orderId) {
        return deliveryRepository.findByOrderId(orderId);
    }

    public List<Delivery> getDeliveriesByCustomer(String customerId) {
        return deliveryRepository.findByCustomerId(customerId);
    }

    public List<Delivery> getDeliveriesByStatus(DeliveryStatus status) {
        return deliveryRepository.findByStatus(status);
    }

    @Transactional
    public Delivery createDelivery(DeliveryRequest request) {
        String orderId = request.getOrderId();
        if (orderId == null || orderId.isBlank()) {
            orderId = "ORD-" + UUID.randomUUID().toString().replace("-", "").substring(0, 12);
        }
        while (deliveryRepository.findByOrderId(orderId).isPresent()) {
            orderId = "ORD-" + UUID.randomUUID().toString().replace("-", "").substring(0, 12);
        }
        Delivery delivery = new Delivery();
        delivery.setOrderId(orderId);
        delivery.setCustomerId(request.getCustomerId());
        delivery.setRestaurantId(request.getRestaurantId());
        delivery.setDeliveryAddress(request.getDeliveryAddress());
        delivery.setDeliveryLatitude(request.getDeliveryLatitude());
        delivery.setDeliveryLongitude(request.getDeliveryLongitude());
        delivery.setStatus(DeliveryStatus.PENDING);
        delivery.setEstimatedMinutes(30);

        String explicitDriverId = request.getDriverId();
        if (explicitDriverId != null && !explicitDriverId.isBlank()) {
            long driverPk;
            try {
                driverPk = Long.parseLong(explicitDriverId.trim());
            } catch (NumberFormatException e) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "ID livreur invalide");
            }
            Driver chosen = driverRepository.findById(driverPk)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Livreur inconnu"));
            if (!Boolean.TRUE.equals(chosen.getAvailable())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Ce livreur n'est pas disponible");
            }
            assignDriverToDelivery(delivery, chosen);
        } else {
            List<Driver> availableDrivers = driverRepository.findByAvailable(true);
            if (!availableDrivers.isEmpty()) {
                assignDriverToDelivery(delivery, availableDrivers.get(0));
            }
        }

        return deliveryRepository.save(delivery);
    }

    @Transactional
    public Optional<Delivery> updateStatus(Long id, DeliveryStatus status) {
        return deliveryRepository.findById(id).map(delivery -> {
            delivery.setStatus(status);
            if (status == DeliveryStatus.PICKED_UP) {
                delivery.setPickedUpAt(LocalDateTime.now());
            } else if (status == DeliveryStatus.DELIVERED) {
                delivery.setDeliveredAt(LocalDateTime.now());
                // Free up driver
                if (delivery.getDriverId() != null) {
                    driverRepository.findById(Long.parseLong(delivery.getDriverId()))
                        .ifPresent(d -> { d.setAvailable(true); driverRepository.save(d); });
                }
            }
            return deliveryRepository.save(delivery);
        });
    }

    @Transactional
    public Optional<Delivery> updateLocation(Long id, LocationUpdateRequest request) {
        return deliveryRepository.findById(id).map(delivery -> {
            delivery.setCurrentLatitude(request.getLatitude());
            delivery.setCurrentLongitude(request.getLongitude());
            return deliveryRepository.save(delivery);
        });
    }

    @Transactional
    public void deleteDelivery(Long id) {
        deliveryRepository.deleteById(id);
    }

    private void assignDriverToDelivery(Delivery delivery, Driver driver) {
        delivery.setDriverId(String.valueOf(driver.getId()));
        delivery.setDriverName(driver.getName());
        delivery.setDriverPhone(driver.getPhone());
        delivery.setDriverVehicle(driver.getVehicle());
        delivery.setDriverRating(driver.getRating());
        delivery.setDriverAvatar(driver.getAvatar());
        driver.setAvailable(false);
        driverRepository.save(driver);
        delivery.setStatus(DeliveryStatus.CONFIRMED);
    }

    public DeliveryStatsDto getStats() {
        long total = deliveryRepository.count();
        long pending = deliveryRepository.countByStatus(DeliveryStatus.PENDING);
        long active = deliveryRepository.countByStatus(DeliveryStatus.ON_THE_WAY)
                    + deliveryRepository.countByStatus(DeliveryStatus.PICKED_UP)
                    + deliveryRepository.countByStatus(DeliveryStatus.CONFIRMED)
                    + deliveryRepository.countByStatus(DeliveryStatus.PREPARING);
        long completed = deliveryRepository.countByStatus(DeliveryStatus.DELIVERED);
        long cancelled = deliveryRepository.countByStatus(DeliveryStatus.CANCELLED);
        long totalDrivers = driverRepository.count();
        long availableDrivers = driverRepository.findByAvailable(true).size();
        return new DeliveryStatsDto(total, pending, active, completed, cancelled, totalDrivers, availableDrivers);
    }

    // Driver CRUD
    public List<Driver> getAllDrivers() { return driverRepository.findAll(); }
    public Optional<Driver> getDriverById(Long id) { return driverRepository.findById(id); }
    public Driver saveDriver(Driver driver) { return driverRepository.save(driver); }
    public void deleteDriver(Long id) { driverRepository.deleteById(id); }
}
