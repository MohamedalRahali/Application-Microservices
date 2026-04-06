import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { RestaurantService } from '../../services/restaurant.service';
import { Restaurant, MenuDto, MenuItem } from '../../models/restaurant.model';

interface CartItem { item: MenuItem; qty: number; }

@Component({
  selector: 'app-restaurant-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './restaurant-menu.component.html'
})
export class RestaurantMenuComponent implements OnInit {
  restaurant: Restaurant | null = null;
  menu: MenuDto | null = null;
  cart: CartItem[] = [];
  loading = true;
  activeCategory = 0;

  constructor(
    private route: ActivatedRoute,
    private restaurantService: RestaurantService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    forkJoin({
      restaurant: this.restaurantService.getById(id),
      menu: this.restaurantService.getMenu(id)
    }).subscribe({
      next: ({ restaurant, menu }) => {
        this.restaurant = restaurant;
        this.menu = menu;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  addToCart(item: MenuItem) {
    const existing = this.cart.find(c => c.item.id === item.id);
    if (existing) existing.qty++;
    else this.cart.push({ item, qty: 1 });
  }

  removeFromCart(item: MenuItem) {
    const idx = this.cart.findIndex(c => c.item.id === item.id);
    if (idx === -1) return;
    if (this.cart[idx].qty > 1) this.cart[idx].qty--;
    else this.cart.splice(idx, 1);
  }

  getQty(item: MenuItem): number {
    return this.cart.find(c => c.item.id === item.id)?.qty ?? 0;
  }

  get total(): number {
    return this.cart.reduce((sum, c) => sum + c.item.price * c.qty, 0);
  }

  get cartCount(): number {
    return this.cart.reduce((sum, c) => sum + c.qty, 0);
  }
}
