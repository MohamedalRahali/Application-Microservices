import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class KeycloakAdminService {
  private keycloakUrl = 'http://localhost:9090';
  private realm = 'foodexpress';
  
  // Admin credentials - in production, this should be handled by backend
  private adminCredentials = {
    username: 'admin',
    password: 'admin'
  };

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  /**
   * Get admin access token
   */
  private getAdminToken(): Observable<any> {
    const tokenUrl = `${this.keycloakUrl}/realms/master/protocol/openid-connect/token`;
    
    const body = new URLSearchParams();
    body.set('grant_type', 'password');
    body.set('client_id', 'admin-cli');
    body.set('username', this.adminCredentials.username);
    body.set('password', this.adminCredentials.password);

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    return this.http.post(tokenUrl, body.toString(), { headers });
  }

  /**
   * Assign role to user
   */
  assignRoleToUser(userId: string, roleName: string): Observable<any> {
    return new Observable(observer => {
      this.getAdminToken().subscribe({
        next: (tokenResponse: any) => {
          const adminToken = tokenResponse.access_token;
          
          // First, get the role ID
          this.getRoleByName(adminToken, roleName).subscribe({
            next: (role: any) => {
              // Then assign the role to the user
              this.assignRole(adminToken, userId, role).subscribe({
                next: (result) => {
                  observer.next(result);
                  observer.complete();
                },
                error: (error) => observer.error(error)
              });
            },
            error: (error) => observer.error(error)
          });
        },
        error: (error) => observer.error(error)
      });
    });
  }

  /**
   * Get role by name
   */
  private getRoleByName(adminToken: string, roleName: string): Observable<any> {
    const url = `${this.keycloakUrl}/admin/realms/${this.realm}/roles/${roleName}`;
    
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${adminToken}`,
      'Content-Type': 'application/json'
    });

    return this.http.get(url, { headers });
  }

  /**
   * Assign role to user
   */
  private assignRole(adminToken: string, userId: string, role: any): Observable<any> {
    const url = `${this.keycloakUrl}/admin/realms/${this.realm}/users/${userId}/role-mappings/realm`;
    
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${adminToken}`,
      'Content-Type': 'application/json'
    });

    const roleMapping = [{
      id: role.id,
      name: role.name,
      description: role.description
    }];

    return this.http.post(url, roleMapping, { headers });
  }

  /**
   * Get user by email
   */
  getUserByEmail(email: string): Observable<any> {
    return new Observable(observer => {
      this.getAdminToken().subscribe({
        next: (tokenResponse: any) => {
          const adminToken = tokenResponse.access_token;
          const url = `${this.keycloakUrl}/admin/realms/${this.realm}/users?email=${encodeURIComponent(email)}`;
          
          const headers = new HttpHeaders({
            'Authorization': `Bearer ${adminToken}`,
            'Content-Type': 'application/json'
          });

          this.http.get(url, { headers }).subscribe({
            next: (users: any) => {
              if (users && users.length > 0) {
                observer.next(users[0]);
              } else {
                observer.error('User not found');
              }
              observer.complete();
            },
            error: (error) => observer.error(error)
          });
        },
        error: (error) => observer.error(error)
      });
    });
  }

  /**
   * Handle post-registration role assignment
   */
  handlePostRegistrationRole(): void {
    const pendingRole = localStorage.getItem('pendingUserRole');
    const userEmail = this.authService.getUserEmail();
    
    if (pendingRole && userEmail && this.authService.isAuthenticated()) {
      console.log(`Assigning role ${pendingRole} to user ${userEmail}`);
      
      this.getUserByEmail(userEmail).subscribe({
        next: (user) => {
          this.assignRoleToUser(user.id, pendingRole).subscribe({
            next: (response) => {
              console.log('Role assigned successfully:', response);
              localStorage.removeItem('pendingUserRole');
              
              // Show success message
              alert(`Welcome! Your account has been set up as ${this.getRoleDisplayName(pendingRole)}.`);
              
              // Refresh the token to get updated roles
              this.authService.refreshToken().then(() => {
                // Redirect based on role
                this.redirectBasedOnRole(pendingRole);
              });
            },
            error: (error) => {
              console.error('Error assigning role:', error);
              // Keep the pending role for retry
              alert('Account created successfully, but there was an issue setting up your role. Please contact support.');
            }
          });
        },
        error: (error) => {
          console.error('Error finding user:', error);
          // Keep the pending role for retry
        }
      });
    }
  }

  /**
   * Get display name for role
   */
  private getRoleDisplayName(role: string): string {
    const roleNames: { [key: string]: string } = {
      'customer': 'Customer',
      'restaurant_owner': 'Restaurant Owner',
      'delivery_person': 'Delivery Driver'
    };
    return roleNames[role] || role;
  }

  /**
   * Redirect user based on their role
   */
  private redirectBasedOnRole(role: string): void {
    switch (role) {
      case 'restaurant_owner':
        window.location.href = 'http://localhost:4201'; // Admin dashboard
        break;
      case 'delivery_person':
        // Could redirect to a delivery driver app or dashboard
        window.location.href = '/profile';
        break;
      case 'customer':
      default:
        window.location.href = '/restaurants';
        break;
    }
  }
}