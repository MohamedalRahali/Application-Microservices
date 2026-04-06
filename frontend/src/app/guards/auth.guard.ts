import { Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = new AuthService(null as any as any);
  const router = new Router(null as any, null as any, null as any, null as any, null as any);

  if (authService.isAuthenticated()) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      return true;
    }

    this.router.navigate(['/login']);
    return false;
  }

  canActivateByRole(role: string): boolean {
    if (this.authService.isAuthenticated() && this.authService.hasRole(role)) {
      return true;
    }

    this.router.navigate(['/login']);
    return false;
  }

  canActivateByRoles(roles: string[]): boolean {
    if (this.authService.isAuthenticated()) {
      const userRoles = this.authService.getUserRoles();
      if (roles.some(role => userRoles.includes(role))) {
        return true;
      }
    }

    this.router.navigate(['/login']);
    return false;
  }
}
