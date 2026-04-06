import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RestaurantService } from '../../services/restaurant.service';
import { Restaurant } from '../../models/restaurant.model';

@Component({
  selector: 'app-restaurants',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './restaurants.component.html'
})
export class RestaurantsComponent implements OnInit {
  restaurants: Restaurant[] = [];
  loading = true;
  searchQuery = '';
  selectedCategory = '';

  constructor(
    private restaurantService: RestaurantService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['search'] ?? '';
      this.selectedCategory = params['category'] ?? '';
      this.load();
    });
  }

  load() {
    this.loading = true;
    this.restaurantService.getAll(this.searchQuery, this.selectedCategory).subscribe({
      next: (data) => { this.restaurants = data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  search() { this.load(); }

  stars(rating: number): string[] {
    return Array(5).fill('').map((_, i) => i < Math.round(rating) ? '★' : '☆');
  }
}
