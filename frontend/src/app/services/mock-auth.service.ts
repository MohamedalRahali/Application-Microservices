import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MockAuthService {
  private authStatus$ = new BehaviorSubject<boolean>(false);

  async init(): Promise<boolean> {
    console.log('Using Mock Auth Service - Keycloak disabled');
    // Simulate successful initialization
    this.authStatus$.next(false);
    return true;
  }

  isAuthenticated(): boolean {
    return false;
  }

  getUserRoles(): string[] {
    return [];
  }

  hasRole(role: string): boolean {
    return false;
  }

  isAdmin(): boolean {
    return false;
  }

  isRestaurantOwner(): boolean {
    return false;
  }

  isDeliveryPerson(): boolean {
    return false;
  }

  isCustomer(): boolean {
    return false;
  }

  login(): void {
    console.log('Mock login - redirecting to mock dashboard');
    window.location.href = '/restaurants';
  }

  logout(): void {
    console.log('Mock logout');
  }

  register(): void {
    console.log('Mock register - redirecting to mock registration');
    window.location.href = '/restaurants';
  }

  getToken(): string {
    return '';
  }

  getUserInfo(): any {
    return null;
  }

  getUsername(): string {
    return 'Mock User';
  }

  getUserName(): string {
    return 'Mock User';
  }

  getUserEmail(): string {
    return 'mock@example.com';
  }

  async refreshToken(): Promise<boolean> {
    return true;
  }

  getAuthStatus() {
    return this.authStatus$;
  }

  getKeycloak(): any {
    return null;
  }

  needsRoleAssignment(): boolean {
    return false;
  }

  clearRoleAssignmentFlag(): void {
    // Mock implementation
  }
}