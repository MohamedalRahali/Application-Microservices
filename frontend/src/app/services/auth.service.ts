import { Injectable } from '@angular/core';
import Keycloak from 'keycloak-js';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private keycloak: Keycloak | null = null;
  private authStatus$ = new BehaviorSubject<boolean>(false);

  async init(): Promise<boolean> {
    this.keycloak = new Keycloak({
      url: 'http://localhost:9090',
      realm: 'foodexpress',
      clientId: 'foodexpress-client'
    });

    try {
      console.log('Initializing Keycloak...');
      
      // Add timeout to prevent hanging
      const initPromise = this.keycloak.init({
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
        redirectUri: window.location.origin,
        flow: 'standard',
        responseMode: 'fragment',
        checkLoginIframe: false, // Disable iframe check to prevent hanging
        enableLogging: true
      });

      // Add 10 second timeout
      const timeoutPromise = new Promise<boolean>((_, reject) => {
        setTimeout(() => reject(new Error('Keycloak initialization timeout')), 10000);
      });

      const authenticated = await Promise.race([initPromise, timeoutPromise]);

      console.log('Keycloak initialized, authenticated:', authenticated);
      this.authStatus$.next(authenticated);

      // Handle post-registration role assignment
      if (authenticated) {
        // Delay to ensure user data is fully loaded
        setTimeout(() => {
          this.handlePostRegistrationRole();
        }, 1000);
      }

      return authenticated;
    } catch (error) {
      console.error('Keycloak init error:', error);
      // Don't fail completely - allow app to work even if Keycloak init fails
      this.authStatus$.next(false);
      return false;
    }
  }

  /**
   * Handle role assignment after registration
   */
  private async handlePostRegistrationRole(): Promise<void> {
    const pendingRole = localStorage.getItem('pendingUserRole');
    if (pendingRole && this.isAuthenticated()) {
      // Check if user has the selected role
      const userRoles = this.getUserRoles();
      const hasSelectedRole = userRoles.includes(pendingRole);
      
      if (!hasSelectedRole) {
        console.log(`User needs role assignment: ${pendingRole}`);
        
        // Import the KeycloakAdminService dynamically to avoid circular dependency
        const { KeycloakAdminService } = await import('./keycloak-admin.service');
        const keycloakAdminService = new (KeycloakAdminService as any)(
          // We'll inject HttpClient in the component that calls this
        );
        
        // For now, we'll handle this in the component level
        // Store a flag to indicate role assignment is needed
        localStorage.setItem('needsRoleAssignment', 'true');
      } else {
        // User already has the correct role, clear pending role
        localStorage.removeItem('pendingUserRole');
      }
    }
  }

  /**
   * Check if user needs role assignment
   */
  needsRoleAssignment(): boolean {
    return localStorage.getItem('needsRoleAssignment') === 'true';
  }

  /**
   * Clear role assignment flag
   */
  clearRoleAssignmentFlag(): void {
    localStorage.removeItem('needsRoleAssignment');
    localStorage.removeItem('pendingUserRole');
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.keycloak?.authenticated || false;
  }

  /**
   * Get user roles
   */
  getUserRoles(): string[] {
    if (!this.keycloak?.realmAccess) return [];
    return this.keycloak.realmAccess.roles || [];
  }

  /**
   * Check if user has specific role
   */
  hasRole(role: string): boolean {
    return this.getUserRoles().includes(role);
  }

  /**
   * Check if user is admin
   */
  isAdmin(): boolean {
    return this.hasRole('admin');
  }

  /**
   * Check if user is restaurant owner
   */
  isRestaurantOwner(): boolean {
    return this.hasRole('restaurant_owner');
  }

  /**
   * Check if user is delivery person
   */
  isDeliveryPerson(): boolean {
    return this.hasRole('delivery_person');
  }

  /**
   * Check if user is customer
   */
  isCustomer(): boolean {
    return this.hasRole('customer');
  }

  /**
   * Login user
   */
  login(): void {
    if (this.keycloak) {
      this.keycloak.login({
        redirectUri: window.location.origin + '/dashboard'
      }).catch(error => {
        console.error('Login error:', error);
      });
    }
  }

  /**
   * Logout user
   */
  logout(): void {
    if (this.keycloak) {
      this.keycloak.logout({
        redirectUri: window.location.origin
      });
    }
  }

  /**
   * Register new user
   */
  register(): void {
    if (this.keycloak) {
      this.keycloak.login({
        action: 'register',
        redirectUri: window.location.origin + '/role-assignment'
      }).catch(error => {
        console.error('Registration error:', error);
      });
    }
  }

  /**
   * Get access token
   */
  getToken(): string {
    return this.keycloak?.token || '';
  }

  /**
   * Get user info from token
   */
  getUserInfo(): any {
    return this.keycloak?.tokenParsed;
  }

  /**
   * Get user preferred username
   */
  getUsername(): string {
    return this.keycloak?.tokenParsed?.['preferred_username'] || '';
  }

  /**
   * Get user name
   */
  getUserName(): string {
    return this.keycloak?.tokenParsed?.['given_name'] || this.getUsername() || 'User';
  }

  /**
   * Get user email
   */
  getUserEmail(): string {
    return this.keycloak?.tokenParsed?.['email'] || '';
  }

  /**
   * Refresh token
   */
  async refreshToken(): Promise<boolean> {
    if (!this.keycloak) return false;
    try {
      return await this.keycloak.updateToken(30);
    } catch (error) {
      console.error('Token refresh error:', error);
      return false;
    }
  }

  /**
   * Get auth status
   */
  getAuthStatus() {
    return this.authStatus$;
  }

  /**
   * Get Keycloak instance
   */
  getKeycloak(): Keycloak | null {
    return this.keycloak;
  }
}
