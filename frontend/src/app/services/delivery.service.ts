import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Delivery, DeliveryStats, DeliveryStatus, Driver } from '../models/delivery.model';

@Injectable({ providedIn: 'root' })
export class DeliveryService {
  private readonly base = 'http://localhost:8080/api/deliveries';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Delivery[]> {
    return this.http.get<Delivery[]>(this.base);
  }

  getById(id: number): Observable<Delivery> {
    return this.http.get<Delivery>(`${this.base}/${id}`);
  }

  getByOrderId(orderId: string): Observable<Delivery> {
    return this.http.get<Delivery>(`${this.base}/order/${orderId}`);
  }

  getByCustomer(customerId: string): Observable<Delivery[]> {
    return this.http.get<Delivery[]>(`${this.base}/customer/${customerId}`);
  }

  getStats(): Observable<DeliveryStats> {
    return this.http.get<DeliveryStats>(`${this.base}/stats`);
  }

  create(data: Partial<Delivery>): Observable<Delivery> {
    return this.http.post<Delivery>(this.base, data);
  }

  updateStatus(id: number, status: DeliveryStatus): Observable<Delivery> {
    return this.http.put<Delivery>(`${this.base}/${id}/status?status=${status}`, {});
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }

  // Drivers
  getAllDrivers(): Observable<Driver[]> {
    return this.http.get<Driver[]>(`${this.base}/drivers`);
  }

  createDriver(driver: Partial<Driver>): Observable<Driver> {
    return this.http.post<Driver>(`${this.base}/drivers`, driver);
  }

  updateDriver(id: number, driver: Partial<Driver>): Observable<Driver> {
    return this.http.put<Driver>(`${this.base}/drivers/${id}`, driver);
  }

  deleteDriver(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/drivers/${id}`);
  }
}
