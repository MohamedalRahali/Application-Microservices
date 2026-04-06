import { Injectable } from '@angular/core';
import Keycloak from 'keycloak-js';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private keycloak: Keycloak | null = null;

  async init(): Promise<boolean> {
    if (!environment.keycloakEnabled) {
      return true;
    }

    this.keycloak = new Keycloak({
      url: 'http://localhost:9090',
      realm: 'foodexpress',
      clientId: 'foodexpress-client'
    });

    try {
      const authenticated = await this.keycloak.init({
        onLoad: 'login-required',
        redirectUri: window.location.origin,
        checkLoginIframe: false
      });
      return authenticated;
    } catch (error) {
      console.error('Keycloak init error (admin):', error);
      return false;
    }
  }

  isAuthenticated(): boolean {
    return this.keycloak?.authenticated || false;
  }

  getToken(): string {
    return this.keycloak?.token || '';
  }
}
