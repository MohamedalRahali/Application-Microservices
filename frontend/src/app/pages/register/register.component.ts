import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <div class="text-center">
          <h2 class="mt-6 text-3xl font-extrabold text-gray-900">
            Join FoodExpress
          </h2>
          <p class="mt-2 text-sm text-gray-600">
            Choose your account type to get started
          </p>
        </div>
      </div>

      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div class="space-y-6">
            <!-- Role Selection -->
            <div>
              <label class="text-base font-medium text-gray-900">I want to:</label>
              <div class="mt-4 space-y-4">
                <div class="flex items-center">
                  <input
                    id="customer"
                    name="userType"
                    type="radio"
                    value="customer"
                    [(ngModel)]="selectedRole"
                    class="focus:ring-orange-500 h-4 w-4 text-orange-600 border-gray-300"
                  />
                  <label for="customer" class="ml-3 block text-sm font-medium text-gray-700">
                    <div class="font-semibold">Order Food</div>
                    <div class="text-gray-500">Browse restaurants and place orders</div>
                  </label>
                </div>

                <div class="flex items-center">
                  <input
                    id="restaurant_owner"
                    name="userType"
                    type="radio"
                    value="restaurant_owner"
                    [(ngModel)]="selectedRole"
                    class="focus:ring-orange-500 h-4 w-4 text-orange-600 border-gray-300"
                  />
                  <label for="restaurant_owner" class="ml-3 block text-sm font-medium text-gray-700">
                    <div class="font-semibold">Manage Restaurant</div>
                    <div class="text-gray-500">List your restaurant and manage orders</div>
                  </label>
                </div>

                <div class="flex items-center">
                  <input
                    id="delivery_person"
                    name="userType"
                    type="radio"
                    value="delivery_person"
                    [(ngModel)]="selectedRole"
                    class="focus:ring-orange-500 h-4 w-4 text-orange-600 border-gray-300"
                  />
                  <label for="delivery_person" class="ml-3 block text-sm font-medium text-gray-700">
                    <div class="font-semibold">Deliver Orders</div>
                    <div class="text-gray-500">Join as a delivery driver</div>
                  </label>
                </div>
              </div>
            </div>

            <!-- Continue Button -->
            <div>
              <button
                type="button"
                (click)="proceedToRegistration()"
                [disabled]="!selectedRole"
                class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Continue to Registration
              </button>
            </div>

            <!-- Login Link -->
            <div class="text-center">
              <span class="text-sm text-gray-600">
                Already have an account?
                <button
                  type="button"
                  (click)="goToLogin()"
                  class="font-medium text-orange-600 hover:text-orange-500"
                >
                  Sign in
                </button>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
  selectedRole: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  proceedToRegistration() {
    if (this.selectedRole) {
      // Store the selected role in localStorage to use after registration
      localStorage.setItem('pendingUserRole', this.selectedRole);
      
      // Proceed with Keycloak registration
      this.authService.register();
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}