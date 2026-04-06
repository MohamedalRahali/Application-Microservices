import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserRoleService {
  private apiUrl = 'http://localhost:8085/api/users'; // User service URL

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  /**
   * Assign role to user after registration
   */
  assignRoleToUser(userId: string, role: string): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.put(`${this.apiUrl}/${userId}/role`, { role }, { headers });
  }

  /**
   * Get user profile
   */
  getUserProfile(): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get(`${this.apiUrl}/profile`, { headers });
  }

  /**
   * Update user profile
   */
  updateUserProfile(profileData: any): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.put(`${this.apiUrl}/profile`, profileData, { headers });
  }

  /**
   * Handle post-registration role assignment
   */
  handlePostRegistrationRole(): void {
    const pendingRole = localStorage.getItem('pendingUserRole');
    if (pendingRole && this.authService.isAuthenticated()) {
      const userInfo = this.authService.getUserInfo();
      if (userInfo?.sub) {
        this.assignRoleToUser(userInfo.sub, pendingRole).subscribe({
          next: (response) => {
            console.log('Role assigned successfully:', response);
            localStorage.removeItem('pendingUserRole');
            // Refresh the token to get updated roles
            this.authService.refreshToken();
          },
          error: (error) => {
            console.error('Error assigning role:', error);
            // Keep the pending role for retry
          }
        });
      }
    }
  }
}