import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/layout/layout.component').then(m => m.LayoutComponent),
    children: [
      { path: '', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
      { path: 'restaurants', loadComponent: () => import('./pages/restaurants/restaurants.component').then(m => m.RestaurantsComponent) },
      { path: 'restaurant/:id', loadComponent: () => import('./pages/restaurant-menu/restaurant-menu.component').then(m => m.RestaurantMenuComponent) },
      { path: 'cart', loadComponent: () => import('./pages/cart/cart.component').then(m => m.CartComponent) },
      { path: 'delivery/:orderId', loadComponent: () => import('./pages/delivery-tracking/delivery-tracking.component').then(m => m.DeliveryTrackingComponent) },
      { path: 'promotions', loadComponent: () => import('./pages/promotions/promotions.component').then(m => m.PromotionsComponent) },
      { path: 'profile', loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent) },
    ]
  },
  { path: 'login', loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent) },
  { path: 'role-assignment', loadComponent: () => import('./pages/role-assignment/role-assignment.component').then(m => m.RoleAssignmentComponent) },
  { path: 'debug', loadComponent: () => import('./pages/debug/debug.component').then(m => m.DebugComponent) },
  { path: 'signup', loadComponent: () => import('./pages/signup/signup.component').then(m => m.SignupComponent) },
  { path: '**', loadComponent: () => import('./pages/not-found/not-found.component').then(m => m.NotFoundComponent) },
];
