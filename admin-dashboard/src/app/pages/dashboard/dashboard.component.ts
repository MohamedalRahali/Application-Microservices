import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { DeliveryService } from '../../services/delivery.service';
import { PromotionService } from '../../services/promotion.service';
import { RestaurantService } from '../../services/restaurant.service';
import { DeliveryStats } from '../../models/delivery.model';
import { PromotionStats } from '../../models/promotion.model';
import { RestaurantStats } from '../../models/restaurant.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  deliveryStats: DeliveryStats | null = null;
  promotionStats: PromotionStats | null = null;
  restaurantStats: RestaurantStats | null = null;
  loading = true;

  constructor(
    private deliveryService: DeliveryService,
    private promotionService: PromotionService,
    private restaurantService: RestaurantService
  ) {}

  ngOnInit() {
    forkJoin({
      delivery: this.deliveryService.getStats(),
      promotion: this.promotionService.getStats(),
      restaurant: this.restaurantService.getStats()
    }).subscribe({
      next: ({ delivery, promotion, restaurant }) => {
        this.deliveryStats = delivery;
        this.promotionStats = promotion;
        this.restaurantStats = restaurant;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }
}
