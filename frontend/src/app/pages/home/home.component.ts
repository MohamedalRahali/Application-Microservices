import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { PromotionService } from '../../services/promotion.service';
import { RestaurantService } from '../../services/restaurant.service';
import { Promotion } from '../../models/promotion.model';
import { Restaurant, Category } from '../../models/restaurant.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  promotions: Promotion[] = [];
  promotedRestaurants: Restaurant[] = [];
  categories: Category[] = [];
  currentPromoIndex = 0;
  searchQuery = '';
  loading = true;

  constructor(
    private promotionService: PromotionService,
    private restaurantService: RestaurantService
  ) {}

  ngOnInit() {
    forkJoin({
      promotions: this.promotionService.getActive(),
      restaurants: this.restaurantService.getPromoted(),
      categories: this.restaurantService.getCategories()
    }).subscribe({
      next: ({ promotions, restaurants, categories }) => {
        this.promotions = promotions;
        this.promotedRestaurants = restaurants;
        this.categories = categories;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  setPromo(index: number) { this.currentPromoIndex = index; }
  get currentPromo(): Promotion | null { return this.promotions[this.currentPromoIndex] ?? null; }
}
