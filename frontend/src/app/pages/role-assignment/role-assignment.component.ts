import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { KeycloakAdminService } from '../../services/keycloak-admin.service';

@Component({
  selector: 'app-role-assignment',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div class="text-center">
            <div class="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span class="text-3xl">🍽️</span>
            </div>
            <h2 class="text-2xl font-bold text-gray-900 mb-4">
              Setting up your account...
            </h2>
            
            <div *ngIf="isAssigning" class="text-center">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p class="text-gray-600">
                Assigning your {{ getRoleDisplayName(selectedRole) }} role...
              </p>
            </div>

            <div *ngIf="assignmentComplete && !error" class="text-center">
              <div class="text-green-500 text-4xl mb-4">✅</div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Welcome!</h3>
              <p class="text-gray-600 mb-4">
                Your account has been set up as {{ getRoleDisplayName(selectedRole) }}.
              </p>
              <p class="text-sm text-gray-500">
                Redirecting you to the appropriate dashboard...
              </p>
            </div>

            <div *ngIf="error" class="text-center">
              <div class="text-red-500 text-4xl mb-4">❌</div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Setup Issue</h3>
              <p class="text-gray-600 mb-4">
                There was an issue setting up your role. You can continue using the app, but some features may be limited.
              </p>
              <button 
                (click)="continueAnyway()"
                class="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors"
              >
                Continue Anyway
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class RoleAssignmentComponent implements OnInit {
  selectedRole: string = '';
  isAssigning: boolean = false;
  assignmentComplete: boolean = false;
  error: boolean = false;

  constructor(
    private authService: AuthService,
    private keycloakAdminService: KeycloakAdminService,
    private router: Router
  ) {}

  ngOnInit() {
    this.selectedRole = localStorage.getItem('pendingUserRole') || '';
    
    if (!this.selectedRole) {
      // No pending role, redirect to home
      this.router.navigate(['/']);
      return;
    }

    if (!this.authService.isAuthenticated()) {
      // Not authenticated, redirect to login
      this.router.navigate(['/login']);
      return;
    }

    // Check if user already has the role
    if (this.authService.hasRole(this.selectedRole)) {
      // User already has the role, clear and redirect
      this.authService.clearRoleAssignmentFlag();
      this.redirectBasedOnRole();
      return;
    }

    // Start role assignment process
    this.assignRole();
  }

  assignRole() {
    this.isAssigning = true;
    const userEmail = this.authService.getUserEmail();

    if (!userEmail) {
      this.error = true;
      this.isAssigning = false;
      return;
    }

    this.keycloakAdminService.getUserByEmail(userEmail).subscribe({
      next: (user) => {
        this.keycloakAdminService.assignRoleToUser(user.id, this.selectedRole).subscribe({
          next: () => {
            this.isAssigning = false;
            this.assignmentComplete = true;
            this.authService.clearRoleAssignmentFlag();
            
            // Refresh token to get updated roles
            this.authService.refreshToken().then(() => {
              // Wait a moment then redirect
              setTimeout(() => {
                this.redirectBasedOnRole();
              }, 2000);
            });
          },
          error: (error) => {
            console.error('Error assigning role:', error);
            this.isAssigning = false;
            this.error = true;
          }
        });
      },
      error: (error) => {
        console.error('Error finding user:', error);
        this.isAssigning = false;
        this.error = true;
      }
    });
  }

  getRoleDisplayName(role: string): string {
    const roleNames: { [key: string]: string } = {
      'customer': 'Customer',
      'restaurant_owner': 'Restaurant Owner',
      'delivery_person': 'Delivery Driver'
    };
    return roleNames[role] || role;
  }

  continueAnyway() {
    this.authService.clearRoleAssignmentFlag();
    this.router.navigate(['/']);
  }

  private redirectBasedOnRole() {
    switch (this.selectedRole) {
      case 'restaurant_owner':
        window.location.href = 'http://localhost:4201'; // Admin dashboard
        break;
      case 'delivery_person':
        this.router.navigate(['/profile']);
        break;
      case 'customer':
      default:
        this.router.navigate(['/restaurants']);
        break;
    }
  }
}