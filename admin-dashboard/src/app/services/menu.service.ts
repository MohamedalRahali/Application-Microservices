import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MenuItem, MenuCategory, MenuStats } from '../models/menu.model';
import { apiJsonHeaders, apiCacheBustParams } from '../core/api-http';
import { apiUrl as gatewayApiUrl } from '../core/api-url';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private apiUrl = gatewayApiUrl('/api/menus');

  constructor(private http: HttpClient) {}

  /** Aligne le JSON Spring (`image`, `menuCategoryId`) sur le modèle admin (`imageUrl`, `categoryId`). */
  private mapMenuItem(raw: Record<string, unknown>): MenuItem {
    const imageUrl = (raw['imageUrl'] ?? raw['image']) as string | undefined;
    const categoryId = (raw['categoryId'] ?? raw['menuCategoryId']) as number | undefined;
    return {
      id: raw['id'] as number | undefined,
      name: String(raw['name'] ?? ''),
      description: String(raw['description'] ?? ''),
      price: Number(raw['price'] ?? 0),
      imageUrl,
      available: raw['available'] !== false,
      categoryId,
      categoryName: raw['categoryName'] as string | undefined,
      restaurantId: Number(raw['restaurantId'] ?? 0),
      restaurantName: raw['restaurantName'] as string | undefined
    };
  }

  private mapMenuCategory(raw: Record<string, unknown>): MenuCategory {
    return {
      id: raw['id'] as number | undefined,
      name: String(raw['name'] ?? ''),
      description: (raw['description'] as string) ?? '',
      restaurantId: Number(raw['restaurantId'] ?? 0),
      restaurantName: raw['restaurantName'] as string | undefined,
      displayOrder: Number(raw['displayOrder'] ?? 0),
      active: raw['active'] !== false
    };
  }

  private mapMenuStats(raw: Record<string, unknown>): MenuStats {
    return {
      totalItems: Number(raw['totalItems'] ?? 0),
      totalCategories: Number(raw['totalCategories'] ?? 0),
      availableItems: Number(raw['availableItems'] ?? 0),
      unavailableItems: Number(raw['unavailableItems'] ?? 0),
      averagePrice: Number(raw['averagePrice'] ?? 0),
      mostExpensiveItem: (raw['mostExpensiveItem'] as MenuItem | null | undefined) ?? null,
      cheapestItem: (raw['cheapestItem'] as MenuItem | null | undefined) ?? null
    };
  }

  // Menu Items
  getMenuItems(): Observable<MenuItem[]> {
    return this.http.get<Record<string, unknown>[]>(`${this.apiUrl}/items`, {
      headers: apiJsonHeaders(),
      params: apiCacheBustParams()
    }).pipe(map((rows) => rows.map((r) => this.mapMenuItem(r))));
  }

  getMenuItemById(id: number): Observable<MenuItem> {
    return this.http.get<Record<string, unknown>>(`${this.apiUrl}/items/${id}`, { headers: apiJsonHeaders() }).pipe(
      map((r) => this.mapMenuItem(r))
    );
  }

  getMenuItemsByCategory(categoryId: number): Observable<MenuItem[]> {
    return this.http.get<Record<string, unknown>[]>(`${this.apiUrl}/items`, {
      headers: apiJsonHeaders(),
      params: apiCacheBustParams()
    }).pipe(map((rows) => rows.map((r) => this.mapMenuItem(r))));
  }

  getMenuItemsByRestaurant(restaurantId: number): Observable<MenuItem[]> {
    return this.http.get<Record<string, unknown>[]>(`${this.apiUrl}/restaurant/${restaurantId}/items`, {
      headers: apiJsonHeaders(),
      params: apiCacheBustParams()
    }).pipe(map((rows) => rows.map((r) => this.mapMenuItem(r))));
  }

  createMenuItem(item: MenuItem): Observable<MenuItem> {
    return this.http.post<Record<string, unknown>>(`${this.apiUrl}/items`, item, { headers: apiJsonHeaders() }).pipe(
      map((r) => this.mapMenuItem(r))
    );
  }

  updateMenuItem(id: number, item: MenuItem): Observable<MenuItem> {
    return this.http.put<Record<string, unknown>>(`${this.apiUrl}/items/${id}`, item, { headers: apiJsonHeaders() }).pipe(
      map((r) => this.mapMenuItem(r))
    );
  }

  deleteMenuItem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/items/${id}`, { headers: apiJsonHeaders() });
  }

  toggleItemAvailability(id: number): Observable<MenuItem> {
    return this.http.patch<Record<string, unknown>>(`${this.apiUrl}/items/${id}/toggle-availability`, {}, { headers: apiJsonHeaders() }).pipe(
      map((r) => this.mapMenuItem(r))
    );
  }

  // Menu Categories
  getMenuCategories(): Observable<MenuCategory[]> {
    return this.http.get<Record<string, unknown>[]>(`${this.apiUrl}/categories`, {
      headers: apiJsonHeaders(),
      params: apiCacheBustParams()
    }).pipe(map((rows) => rows.map((r) => this.mapMenuCategory(r))));
  }

  getMenuCategoryById(id: number): Observable<MenuCategory> {
    return this.http.get<Record<string, unknown>>(`${this.apiUrl}/categories/${id}`, { headers: apiJsonHeaders() }).pipe(
      map((r) => this.mapMenuCategory(r))
    );
  }

  getCategoriesByRestaurant(restaurantId: number): Observable<MenuCategory[]> {
    return this.http.get<Record<string, unknown>[]>(`${this.apiUrl}/categories/restaurant/${restaurantId}`, {
      headers: apiJsonHeaders(),
      params: apiCacheBustParams()
    }).pipe(map((rows) => rows.map((r) => this.mapMenuCategory(r))));
  }

  createMenuCategory(category: MenuCategory): Observable<MenuCategory> {
    return this.http.post<Record<string, unknown>>(`${this.apiUrl}/categories`, category, { headers: apiJsonHeaders() }).pipe(
      map((r) => this.mapMenuCategory(r))
    );
  }

  updateMenuCategory(id: number, category: MenuCategory): Observable<MenuCategory> {
    return this.http.put<Record<string, unknown>>(`${this.apiUrl}/categories/${id}`, category, { headers: apiJsonHeaders() }).pipe(
      map((r) => this.mapMenuCategory(r))
    );
  }

  deleteMenuCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/categories/${id}`, { headers: apiJsonHeaders() });
  }

  // Statistics
  getMenuStats(): Observable<MenuStats> {
    return this.http.get<Record<string, unknown>>(`${this.apiUrl}/stats`, {
      headers: apiJsonHeaders(),
      params: apiCacheBustParams()
    }).pipe(map((r) => this.mapMenuStats(r)));
  }
}