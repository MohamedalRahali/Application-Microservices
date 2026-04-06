import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span class="text-3xl">🍽️</span>
          </div>
          <h1 class="text-2xl font-bold text-gray-900">Créer un compte</h1>
          <p class="text-gray-500 mt-1 text-sm">Rejoignez FoodExpress dès maintenant</p>
        </div>

        <!-- Error Message -->
        <div *ngIf="errorMessage" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {{ errorMessage }}
        </div>

        <!-- Register Button -->
        <button 
          (click)="register()"
          [disabled]="isLoading"
          class="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold py-3 rounded-lg hover:shadow-lg transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span *ngIf="isLoading">⏳ Redirection en cours...</span>
          <span *ngIf="!isLoading">✨ Créer mon compte</span>
        </button>

        <!-- Divider -->
        <div class="my-6 flex items-center gap-3">
          <div class="flex-1 h-px bg-gray-200"></div>
          <span class="text-gray-400 text-sm">ou</span>
          <div class="flex-1 h-px bg-gray-200"></div>
        </div>

        <!-- Information Box -->
        <div class="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <p class="text-sm font-semibold text-amber-900 mb-3">ℹ️ Comment ça marche :</p>
          <div class="space-y-2 text-xs text-amber-800">
            <p>✓ Cliquez sur "Créer mon compte"</p>
            <p>✓ Remplissez votre formulaire d'inscription</p>
            <p>✓ Vous serez automatiquement connecté</p>
            <p>✓ Prêt à commander !</p>
          </div>
        </div>

        <!-- Features -->
        <div class="space-y-3 mb-6">
          <div class="flex items-center gap-2 text-sm">
            <span class="text-orange-500">🍕</span>
            <span class="text-gray-700">Accès à tous les restaurants</span>
          </div>
          <div class="flex items-center gap-2 text-sm">
            <span class="text-orange-500">🚚</span>
            <span class="text-gray-700">Suivi en temps réel</span>
          </div>
          <div class="flex items-center gap-2 text-sm">
            <span class="text-orange-500">🎁</span>
            <span class="text-gray-700">Promotions exclusives</span>
          </div>
        </div>

        <!-- Test Login Link -->
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <p class="text-xs text-blue-800 mb-2"><strong>Test rapide:</strong> Vous pouvez tester avec:</p>
          <p class="text-xs text-blue-900 font-mono">user: customer | pwd: Customer&#64;123</p>
        </div>

        <!-- Footer -->
        <p class="text-center text-sm text-gray-500">
          Vous avez déjà un compte ?
          <button (click)="login()" class="text-orange-600 font-semibold hover:underline cursor-pointer">
            Se connecter
          </button>
        </p>
      </div>
    </div>
  `
})
export class SignupComponent {
  isLoading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    // If already logged in, redirect to dashboard
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  register(): void {
    console.log('Register button clicked');
    this.isLoading = true;
    this.errorMessage = '';

    try {
      console.log('Calling authService.register()');
      this.authService.register();
      console.log('Register called successfully');
    } catch (error) {
      console.error('Error during registration:', error);
      this.errorMessage = 'Erreur lors de la redirection. Vérifiez la console.';
      this.isLoading = false;
    }
  }

  login(): void {
    this.authService.login();
  }
}
