import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Skip token injection for Keycloak endpoints
    if (this.isKeycloakUrl(request.url)) {
      return next.handle(request);
    }

    // Add token if user is authenticated
    if (this.authService.isAuthenticated()) {
      const token = this.authService.getToken();
      if (token) {
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
      }
    }

    return next.handle(request);
  }

  private isKeycloakUrl(url: string): boolean {
    return url.includes('keycloak') ||
           url.includes('realms') ||
           url.includes('protocol/openid-connect');
  }
}
