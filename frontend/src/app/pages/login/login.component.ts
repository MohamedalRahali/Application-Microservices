import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span class="text-3xl">🍽️</span>
          </div>
          <h1 class="text-2xl font-bold text-gray-900">Connexion</h1>
          <p class="text-gray-500 mt-1">Bienvenue sur FoodExpress</p>
        </div>

        <!-- Login Button -->
        <button 
          (click)="login()"
          class="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold py-3 rounded-lg hover:shadow-lg transition transform hover:scale-105"
        >
          🔐 Se connecter avec Keycloak
        </button>

        <!-- Divider -->
        <div class="my-6 flex items-center gap-3">
          <div class="flex-1 h-px bg-gray-200"></div>
          <span class="text-gray-400 text-sm">ou</span>
          <div class="flex-1 h-px bg-gray-200"></div>
        </div>

        <!-- Test Credentials -->
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p class="text-sm font-semibold text-blue-900 mb-3">Test Credentials :</p>
          <div class="space-y-2 text-xs text-blue-800">
            <p><strong>Customers:</strong> customer / Customer&#64;123</p>
            <p><strong>Admin:</strong> admin / Admin&#64;123</p>
            <p><strong>Restaurant Owner:</strong> restaurant_owner / Owner&#64;123</p>
            <p><strong>Delivery:</strong> delivery_person / Delivery&#64;123</p>
          </div>
        </div>

        <!-- Footer -->
        <p class="text-center text-sm text-gray-500">
          Pas encore de compte ?
          <button (click)="register()" class="text-orange-600 font-semibold hover:underline cursor-pointer">
            S'inscrire
          </button>
        </p>
      </div>
    </div>
  `
})
export class LoginComponent {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    // If already logged in, redirect to dashboard
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  login(): void {
    this.authService.login();
  }

  register(): void {
    this.router.navigate(['/register']);
  }
}
