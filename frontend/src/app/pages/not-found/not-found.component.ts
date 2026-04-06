import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="min-h-screen bg-gray-50 flex items-center justify-center text-center p-4">
      <div>
        <div class="text-8xl mb-6">🍽️</div>
        <h1 class="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <p class="text-xl text-gray-600 mb-8">Cette page n'existe pas</p>
        <a routerLink="/" class="btn-primary">Retour à l'accueil</a>
      </div>
    </div>
  `
})
export class NotFoundComponent {}
