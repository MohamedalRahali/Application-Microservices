import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gray-50 pb-16 md:pb-0">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-8">Mon Panier 🛒</h1>
        <div class="text-center py-16">
          <div class="text-6xl mb-4">🛒</div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">Votre panier est vide</h3>
          <p class="text-gray-500 mb-6">Ajoutez des articles depuis un restaurant</p>
          <a routerLink="/restaurants" class="btn-primary">Voir les restaurants</a>
        </div>
      </div>
    </div>
  `
})
export class CartComponent {}
