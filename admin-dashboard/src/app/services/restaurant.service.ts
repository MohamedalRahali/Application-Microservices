import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Restaurant, RestaurantStats } from '../models/restaurant.model';
import { apiJsonHeaders, apiCacheBustParams } from '../core/api-http';
import { apiUrl } from '../core/api-url';

@Injectable({ providedIn: 'root' })
export class RestaurantService {
  private readonly base = apiUrl('/api/restaurants');

  constructor(private http: HttpClient) {}

  getAll(): Observable<Restaurant[]> {
    return this.http
      .get<Restaurant[]>(`${this.base}/all`, { headers: apiJsonHeaders(), params: apiCacheBustParams() })
      .pipe(catchError(() => of([])));
  }

  getStats(): Observable<RestaurantStats> {
    return this.http
      .get<RestaurantStats>(`${this.base}/stats`, { headers: apiJsonHeaders(), params: apiCacheBustParams() })
      .pipe(
        catchError(() =>
          of({
            totalRestaurants: 0,
            activeRestaurants: 0,
            promotedRestaurants: 0,
            totalCategories: 0,
          })
        )
      );
  }

  create(r: Partial<Restaurant>): Observable<Restaurant> {
    return this.http.post<Restaurant>(this.base, r, { headers: apiJsonHeaders() });
  }

  update(id: number, r: Partial<Restaurant>): Observable<Restaurant> {
    return this.http.put<Restaurant>(`${this.base}/${id}`, r, { headers: apiJsonHeaders() });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`, { headers: apiJsonHeaders() });
  }
}
