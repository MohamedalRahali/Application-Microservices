import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-debug',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gray-50 p-8">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-3xl font-bold text-gray-900 mb-8">Debug Information</h1>
        
        <div class="grid gap-6">
          <!-- Keycloak Status -->
          <div class="bg-white p-6 rounded-lg shadow">
            <h2 class="text-xl font-semibold mb-4">Keycloak Status</h2>
            <div class="space-y-2">
              <p><strong>Keycloak URL:</strong> http://localhost:9090</p>
              <p><strong>Realm:</strong> foodexpress</p>
              <p><strong>Client ID:</strong> foodexpress-client</p>
              <p><strong>Authenticated:</strong> 
                <span [class]="authService.isAuthenticated() ? 'text-green-600' : 'text-red-600'">
                  {{ authService.isAuthenticated() ? 'Yes' : 'No' }}
                </span>
              </p>
              <p><strong>User Roles:</strong> {{ getUserRoles() }}</p>
              <p><strong>User Email:</strong> {{ authService.getUserEmail() || 'Not available' }}</p>
            </div>
          </div>

          <!-- Connection Test -->
          <div class="bg-white p-6 rounded-lg shadow">
            <h2 class="text-xl font-semibold mb-4">Connection Test</h2>
            <button 
              (click)="testKeycloakConnection()"
              class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mr-4"
            >
              Test Keycloak Connection
            </button>
            <button 
              (click)="testRealmConnection()"
              class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Test Realm Connection
            </button>
            
            <div *ngIf="connectionResult" class="mt-4 p-4 rounded" 
                 [class]="connectionResult.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
              {{ connectionResult.message }}
            </div>
          </div>

          <!-- Local Storage -->
          <div class="bg-white p-6 rounded-lg shadow">
            <h2 class="text-xl font-semibold mb-4">Local Storage</h2>
            <div class="space-y-2">
              <p><strong>Pending User Role:</strong> {{ getPendingRole() || 'None' }}</p>
              <p><strong>Needs Role Assignment:</strong> {{ needsRoleAssignment() ? 'Yes' : 'No' }}</p>
            </div>
          </div>

          <!-- Actions -->
          <div class="bg-white p-6 rounded-lg shadow">
            <h2 class="text-xl font-semibold mb-4">Actions</h2>
            <div class="space-x-4">
              <button 
                (click)="clearLocalStorage()"
                class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Clear Local Storage
              </button>
              <button 
                (click)="goToLogin()"
                class="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
              >
                Go to Login
              </button>
              <button 
                (click)="goToRegister()"
                class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Go to Register
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DebugComponent implements OnInit {
  connectionResult: { success: boolean; message: string } | null = null;

  constructor(public authService: AuthService) {}

  ngOnInit() {
    console.log('Debug component loaded');
    console.log('Auth service:', this.authService);
    console.log('Keycloak instance:', this.authService.getKeycloak());
  }

  getUserRoles(): string {
    const roles = this.authService.getUserRoles();
    return roles.length > 0 ? roles.join(', ') : 'None';
  }

  getPendingRole(): string | null {
    return localStorage.getItem('pendingUserRole');
  }

  needsRoleAssignment(): boolean {
    return localStorage.getItem('needsRoleAssignment') === 'true';
  }

  async testKeycloakConnection() {
    try {
      const response = await fetch('http://localhost:9090');
      if (response.ok) {
        this.connectionResult = { success: true, message: 'Keycloak is running and accessible' };
      } else {
        this.connectionResult = { success: false, message: `Keycloak responded with status: ${response.status}` };
      }
    } catch (error) {
      this.connectionResult = { success: false, message: `Cannot connect to Keycloak: ${error}` };
    }
  }

  async testRealmConnection() {
    try {
      const response = await fetch('http://localhost:9090/realms/foodexpress');
      if (response.ok) {
        this.connectionResult = { success: true, message: 'Foodexpress realm is accessible' };
      } else {
        this.connectionResult = { success: false, message: `Realm responded with status: ${response.status}` };
      }
    } catch (error) {
      this.connectionResult = { success: false, message: `Cannot connect to realm: ${error}` };
    }
  }

  clearLocalStorage() {
    localStorage.removeItem('pendingUserRole');
    localStorage.removeItem('needsRoleAssignment');
    this.connectionResult = { success: true, message: 'Local storage cleared' };
  }

  goToLogin() {
    window.location.href = '/login';
  }

  goToRegister() {
    window.location.href = '/register';
  }
}