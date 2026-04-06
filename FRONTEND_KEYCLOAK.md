# Angular Frontend Keycloak Integration ✅

Your Angular frontend is now fully integrated with Keycloak OAuth2!

## 📦 What Was Set Up

### 1. **Dependencies Added**
- `keycloak-angular` — Angular wrapper for Keycloak
- `keycloak-js` — Keycloak client library

### 2. **Services Created**
- **AuthService** (`auth.service.ts`) — Main authentication service with methods:
  - `login()` — Redirect to Keycloak login
  - `register()` — Redirect to Keycloak registration
  - `logout()` — Clear session and logout
  - `isAuthenticated()` — Check login status
  - `getUserRoles()` — Get user's roles
  - `hasRole(role)` — Check if user has specific role
  - `getToken()` — Get JWT access token
  - `getUserProfile()` — Get user profile info

- **AuthInterceptor** (`auth.interceptor.ts`) — Automatic JWT injection:
  - Adds `Authorization: Bearer <token>` to all API requests
  - Handles token refresh on 401 errors
  - Skips token for Keycloak endpoints

- **AuthGuard** (`auth.guard.ts`) — Route protection:
  - Protect routes that require authentication
  - Check user roles before allowing access

### 3. **Components Updated**
- **Login Component** — Now redirects to Keycloak:
  - Click "🔐 Se connecter avec Keycloak" button
  - Redirects to Keycloak login page
  - Auto-redirects back after login

- **Signup Component** — New user registration:
  - Click "✨ Créer mon compte" button
  - Redirects to Keycloak registration
  - Auto-logs in after registration

### 4. **App Configuration**
- Keycloak initialized on app startup
- Sets realm to **"foodexpress"** on port **9090**
- Silent SSO check enabled for seamless re-login

---

## 🚀 Installation Steps

### Step 1: Install Dependencies
```bash
cd frontend
npm install
```
This will install `keycloak-angular` and `keycloak-js`.

### Step 2: Start Frontend
```bash
npm start
# OR
ng serve --port 4200
```

Access: **http://localhost:4200**

---

## 🧪 Testing Login & Register

### Test Login Flow:
1. Go to: http://localhost:4200/login
2. Click **"🔐 Se connecter avec Keycloak"**
3. You're redirected to: http://localhost:9090 (Keycloak login)
4. Login with:
   - **Username**: customer
   - **Password**: Customer@123
5. Auto-redirected to: http://localhost:4200/dashboard
6. You're now authenticated! ✅

### Test Registration Flow:
1. Go to: http://localhost:4200/signup
2. Click **"✨ Créer mon compte"**
3. You're redirected to Keycloak registration page
4. Fill registration form
5. After registration, auto-logged in and redirected to dashboard

### Test Logout:
In navigation, click "Logout" and you'll be:
- Logged out from app
- Logged out from Keycloak
- Redirected to login page

---

## 🔑 Test Credentials

All users available in Keycloak realm:

| Role | Username | Password | Role ID |
|------|----------|----------|---------|
| **Customer** | customer | Customer@123 | customer |
| **Admin** | admin | Admin@123 | admin |
| **Restaurant Owner** | restaurant_owner | Owner@123 | restaurant_owner |
| **Delivery Person** | delivery_person | Delivery@123 | delivery_person |

---

## 🛡️ Route Protection Example

To protect a route, add auth guard in `app.routes.ts`:

```typescript
import { Routes } from '@angular/router';
import { AuthGuardService } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  
  // Protected routes (require authentication)
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuardService] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuardService] },
  
  // Role-based protected routes
  { path: 'admin', component: AdminComponent, canActivate: [AdminGuard] },
];
```

---

## 🔄 API Requests with Authentication

All API calls automatically get JWT token via interceptor:

```typescript
// Your service
constructor(private http: HttpClient) {}

getProfile() {
  return this.http.get('/api/v1/users/me');
  // Automatically includes: Authorization: Bearer <token>
}

getDeliveries() {
  return this.http.get('/api/deliveries');
  // Automatically includes JWT token
}
```

---

## 📋 Checking User Status

In any component:

```typescript
import { AuthService } from './services/auth.service';

export class MyComponent {
  constructor(private auth: AuthService) {}

  ngOnInit() {
    // Check if logged in
    if (this.auth.isAuthenticated()) {
      console.log('User is logged in');
    }

    // Get user name
    this.auth.getUserName().subscribe(name => {
      console.log('Hello', name);
    });

    // Check role
    if (this.auth.hasRole('admin')) {
      console.log('User is admin');
    }

    // Get user roles
    const roles = this.auth.getUserRoles();
    console.log('User roles:', roles);
  }

  logout() {
    this.auth.logout();
  }
}
```

---

## 🔧 Configuration

### Edit Keycloak URL
File: `src/app/app.config.ts`

```typescript
keycloak.init({
  config: {
    realm: 'foodexpress',
    clientId: 'foodexpress-client',
    url: 'http://localhost:9090'  // ← Change here if needed
  }
});
```

### Edit Redirect URI
File: `src/app/app.config.ts`

```typescript
initOptions: {
  redirectUri: window.location.origin + '/dashboard'  // ← Backend redirect
}
```

---

## ✅ Success Indicators

You'll know it's working when:

✅ Login button redirects to Keycloak
✅ Can login with test credentials
✅ Auto-redirects to dashboard after login
✅ User info displays (name, email)
✅ Token is valid in browser storage
✅ API calls include JWT token
✅ Logout clears session

---

## 🐛 Troubleshooting

### Issue: "Cannot GET /silent-check-sso.html"
**Solution**: The `silent-check-sso.html` file is in `src/`. Make sure it's included in build.

Edit `angular.json`:
```json
"assets": [
  "src/favicon.ico",
  "src/assets",
  "src/silent-check-sso.html"
]
```

### Issue: "Login redirects to blank page"
**Solution**: Check Keycloak config:
- Make sure `url: 'http://localhost:9090'` is correct
- Make sure Keycloak is running on port 9090
- Check browser console for errors

### Issue: API calls return 401 Unauthorized
**Solution**: Check AuthInterceptor:
- Token might be expired (use `auth.refreshToken()`)
- Keycloak might not be responding
- Backend might not accept bearer tokens

---

## 📚 Next Steps

1. ✅ Ensure Keycloak is running on http://localhost:9090
2. ✅ Ensure realm "foodexpress" is imported
3. ✅ Install frontend dependencies: `npm install`
4. ✅ Start frontend: `npm start`
5. ✅ Test login at http://localhost:4200/login
6. ✅ Test API calls with authenticated user

---

**Last Updated**: 2026-03-30  
**Status**: ✅ Frontend Keycloak integration complete
