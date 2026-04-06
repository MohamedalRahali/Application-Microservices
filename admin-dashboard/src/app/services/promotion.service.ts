import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Promotion, PromotionStats } from '../models/promotion.model';
import { apiJsonHeaders, apiCacheBustParams } from '../core/api-http';
import { apiUrl } from '../core/api-url';

@Injectable({ providedIn: 'root' })
export class PromotionService {
  private readonly base = apiUrl('/api/promotions');

  constructor(private http: HttpClient) {}

  getAll(): Observable<Promotion[]> {
    return this.http
      .get<Promotion[]>(this.base, { headers: apiJsonHeaders(), params: apiCacheBustParams() })
      .pipe(catchError(() => of([])));
  }

  getStats(): Observable<PromotionStats> {
    return this.http
      .get<PromotionStats>(`${this.base}/stats`, { headers: apiJsonHeaders(), params: apiCacheBustParams() })
      .pipe(
        catchError(() =>
          of({
            totalPromotions: 0,
            activePromotions: 0,
            expiredPromotions: 0,
            totalUsages: 0,
          })
        )
      );
  }

  create(p: Partial<Promotion>): Observable<Promotion> {
    return this.http.post<Promotion>(this.base, p, { headers: apiJsonHeaders() });
  }

  update(id: number, p: Partial<Promotion>): Observable<Promotion> {
    return this.http.put<Promotion>(`${this.base}/${id}`, p, { headers: apiJsonHeaders() });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`, { headers: apiJsonHeaders() });
  }
}
