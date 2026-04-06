import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RestaurantService } from '../../services/restaurant.service';
import { Restaurant } from '../../models/restaurant.model';

@Component({
  selector: 'app-restaurants-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './restaurants.component.html'
})
export class RestaurantsAdminComponent implements OnInit {
  restaurants: Restaurant[] = [];
  loading = true;
  showForm = false;
  isEditing = false;
  editingRestaurant: Partial<Restaurant> = {};

  constructor(private restaurantService: RestaurantService) {}

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.restaurantService.getAll().subscribe({
      next: (data) => { this.restaurants = data; this.loading = false; },
      error: (err) => {
        this.loading = false;
        console.error(err);
        alert('Impossible de charger les restaurants (API / CORS / gateway). Regard console (F12).');
      }
    });
  }

  openCreate() {
    this.editingRestaurant = { active: true, promoted: false, rating: 0, ratingCount: 0, deliveryFee: 0, minOrder: 0 };
    this.isEditing = false;
    this.showForm = true;
  }

  openEdit(r: Restaurant) {
    this.editingRestaurant = { ...r };
    this.isEditing = true;
    this.showForm = true;
  }

  save() {
    if (this.isEditing && this.editingRestaurant.id) {
      this.restaurantService.update(this.editingRestaurant.id, this.editingRestaurant).subscribe({
        next: () => { this.showForm = false; this.load(); },
        error: (err) => {
          console.error(err);
          alert('Échec enregistrement restaurant. Verifie la console (F12).');
        }
      });
    } else {
      this.restaurantService.create(this.editingRestaurant).subscribe({
        next: () => { this.showForm = false; this.load(); },
        error: (err) => {
          console.error(err);
          alert('Échec création restaurant. Verifie la console (F12).');
        }
      });
    }
  }

  delete(id: number) {
    if (confirm('Supprimer ce restaurant ?')) {
      this.restaurantService.delete(id).subscribe(() => this.load());
    }
  }
}
