import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Promotion, PromotionStats, ValidateCodeRequest, ValidateCodeResponse } from '../models/promotion.model';

@Injectable({ providedIn: 'root' })
export class PromotionService {
  private readonly base = 'http://localhost:8080/api/promotions';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Promotion[]> {
    return this.http.get<Promotion[]>(this.base);
  }

  getActive(): Observable<Promotion[]> {
    return this.http.get<Promotion[]>(`${this.base}/active`);
  }

  getById(id: number): Observable<Promotion> {
    return this.http.get<Promotion>(`${this.base}/${id}`);
  }

  getStats(): Observable<PromotionStats> {
    return this.http.get<PromotionStats>(`${this.base}/stats`);
  }

  create(promotion: Partial<Promotion>): Observable<Promotion> {
    return this.http.post<Promotion>(this.base, promotion);
  }

  update(id: number, promotion: Partial<Promotion>): Observable<Promotion> {
    return this.http.put<Promotion>(`${this.base}/${id}`, promotion);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }

  validateCode(request: ValidateCodeRequest): Observable<ValidateCodeResponse> {
    return this.http.post<ValidateCodeResponse>(`${this.base}/validate`, request);
  }
}
