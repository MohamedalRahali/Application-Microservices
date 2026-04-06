import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gray-50 pb-16 md:pb-0">
      <div class="max-w-2xl mx-auto px-4 py-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-8">Mon Profil 👤</h1>
        <div class="bg-white rounded-xl shadow-sm p-6 text-center">
          <div class="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span class="text-3xl">👤</span>
          </div>
          <p class="text-gray-500">Connectez le User Service pour afficher le profil.</p>
          <div class="mt-6 space-y-3">
            <a routerLink="/login" class="block w-full btn-primary text-center">Se connecter</a>
            <a routerLink="/signup" class="block w-full btn-outline text-center">Créer un compte</a>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProfileComponent {}
