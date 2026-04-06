import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category, MenuDto, MenuItem, Restaurant } from '../models/restaurant.model';

@Injectable({ providedIn: 'root' })
export class RestaurantService {
  private readonly base = 'http://localhost:8080/api/restaurants';
  private readonly menuBase = 'http://localhost:8080/api/menus';

  constructor(private http: HttpClient) {}

  getAll(search?: string, category?: string): Observable<Restaurant[]> {
    let url = this.base;
    const params: string[] = [];
    if (search) params.push(`search=${encodeURIComponent(search)}`);
    if (category) params.push(`category=${encodeURIComponent(category)}`);
    if (params.length) url += '?' + params.join('&');
    return this.http.get<Restaurant[]>(url);
  }

  getPromoted(): Observable<Restaurant[]> {
    return this.http.get<Restaurant[]>(`${this.base}/promoted`);
  }

  getById(id: number): Observable<Restaurant> {
    return this.http.get<Restaurant>(`${this.base}/${id}`);
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.base}/categories`);
  }

  getMenu(restaurantId: number): Observable<MenuDto> {
    return this.http.get<MenuDto>(`${this.menuBase}/restaurant/${restaurantId}`);
  }

  getPopularItems(restaurantId: number): Observable<MenuItem[]> {
    return this.http.get<MenuItem[]>(`${this.menuBase}/restaurant/${restaurantId}/popular`);
  }
}
