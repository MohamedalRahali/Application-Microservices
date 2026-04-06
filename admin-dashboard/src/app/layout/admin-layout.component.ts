import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './admin-layout.component.html'
})
export class AdminLayoutComponent {
  sidebarOpen = true;

  navItems = [
    { path: '/dashboard', icon: '📊', label: 'Dashboard' },
    { path: '/deliveries', icon: '🛵', label: 'Livraisons' },
    { path: '/drivers', icon: '👤', label: 'Livreurs' },
    { path: '/restaurants', icon: '🍴', label: 'Restaurants' },
    { path: '/menu', icon: '📋', label: 'Menu' },
    { path: '/promotions', icon: '🎁', label: 'Promotions' },
  ];
}
