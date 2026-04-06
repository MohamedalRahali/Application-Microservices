package com.foodexpress.delivery.config;

import com.foodexpress.delivery.model.Delivery;
import com.foodexpress.delivery.model.DeliveryStatus;
import com.foodexpress.delivery.model.Driver;
import com.foodexpress.delivery.repository.DeliveryRepository;
import com.foodexpress.delivery.repository.DriverRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
@ConditionalOnProperty(name = "app.seed.enabled", havingValue = "true")
public class DataInitializer implements CommandLineRunner {

    private final DriverRepository driverRepository;
    private final DeliveryRepository deliveryRepository;

    @Override
    public void run(String... args) {
        if (driverRepository.count() > 0) return; // don't re-seed
        Driver d1 = new Driver(null, "Ahmed Benali", "+213 555 0101",
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
            "Moto Yamaha", 4.8, true, 48.8566, 2.3522);
        Driver d2 = new Driver(null, "Karim Meziane", "+213 555 0102",
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
            "Vélo électrique", 4.9, true, 48.8606, 2.3376);
        Driver d3 = new Driver(null, "Youcef Hamidi", "+213 555 0103",
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop",
            "Scooter Honda", 4.7, false, 48.8584, 2.2945);
        driverRepository.save(d1);
        driverRepository.save(d2);
        driverRepository.save(d3);

        // Seed sample deliveries
        Delivery del1 = new Delivery();
        del1.setOrderId("ORD-001");
        del1.setCustomerId("user-1");
        del1.setRestaurantId("rest-2");
        del1.setDeliveryAddress("15 Rue de la Paix, 75002 Paris");
        del1.setDeliveryLatitude(48.8698);
        del1.setDeliveryLongitude(2.3309);
        del1.setStatus(DeliveryStatus.ON_THE_WAY);
        del1.setDriverId("3");
        del1.setDriverName("Youcef Hamidi");
        del1.setDriverPhone("+213 555 0103");
        del1.setDriverVehicle("Scooter Honda");
        del1.setDriverRating(4.7);
        del1.setEstimatedMinutes(12);
        del1.setCurrentLatitude(48.8620);
        del1.setCurrentLongitude(2.3400);
        del1.setCreatedAt(LocalDateTime.now().minusMinutes(20));
        del1.setPickedUpAt(LocalDateTime.now().minusMinutes(10));
        deliveryRepository.save(del1);

        Delivery del2 = new Delivery();
        del2.setOrderId("ORD-002");
        del2.setCustomerId("user-2");
        del2.setRestaurantId("rest-1");
        del2.setDeliveryAddress("42 Avenue des Champs-Élysées, 75008 Paris");
        del2.setStatus(DeliveryStatus.DELIVERED);
        del2.setDriverId("1");
        del2.setDriverName("Ahmed Benali");
        del2.setEstimatedMinutes(0);
        del2.setCreatedAt(LocalDateTime.now().minusHours(2));
        del2.setPickedUpAt(LocalDateTime.now().minusHours(1).minusMinutes(30));
        del2.setDeliveredAt(LocalDateTime.now().minusHours(1));
        deliveryRepository.save(del2);
    }
}
