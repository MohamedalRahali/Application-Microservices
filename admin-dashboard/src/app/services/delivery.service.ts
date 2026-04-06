import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {
  Delivery,
  DeliveryStats,
  DeliveryStatus,
  Driver,
  Restaurant,
  Customer,
  CreateDeliveryRequest,
} from '../models/delivery.model';
import { apiJsonHeaders, apiCacheBustParams } from '../core/api-http';
import { apiUrl } from '../core/api-url';

@Injectable({ providedIn: 'root' })
export class DeliveryService {
  private readonly base = apiUrl('/api/deliveries');
  private readonly driversBase = apiUrl('/api/deliveries/drivers');

  constructor(private http: HttpClient) {}

  private mapDelivery(raw: Record<string, unknown>): Delivery {
    const g = (k: string): unknown => raw[k];
    const str = (k: string, d = ''): string => String(g(k) ?? d);
    const num = (k: string): number | undefined => (g(k) == null ? undefined : Number(g(k)));
    const strOpt = (k: string): string | undefined => (g(k) == null ? undefined : String(g(k)));
    return {
      id: g('id') as number | undefined,
      orderId: str('orderId'),
      customerId: str('customerId'),
      restaurantId: str('restaurantId'),
      deliveryAddress: str('deliveryAddress'),
      deliveryLatitude: num('deliveryLatitude'),
      deliveryLongitude: num('deliveryLongitude'),
      status: g('status') as DeliveryStatus,
      driverId: strOpt('driverId'),
      driverName: strOpt('driverName'),
      driverPhone: strOpt('driverPhone'),
      driverVehicle: strOpt('driverVehicle'),
      driverRating: num('driverRating'),
      driverAvatar: strOpt('driverAvatar'),
      estimatedMinutes:
        g('estimatedMinutes') == null ? undefined : Math.trunc(Number(g('estimatedMinutes'))),
      currentLatitude: num('currentLatitude'),
      currentLongitude: num('currentLongitude'),
      createdAt: strOpt('createdAt'),
      pickedUpAt: strOpt('pickedUpAt'),
      deliveredAt: strOpt('deliveredAt'),
    };
  }

  private mapStats(r: Record<string, unknown>): DeliveryStats {
    return {
      totalDeliveries: Number(r['totalDeliveries'] ?? 0),
      pendingDeliveries: Number(r['pendingDeliveries'] ?? 0),
      activeDeliveries: Number(r['activeDeliveries'] ?? 0),
      completedDeliveries: Number(r['completedDeliveries'] ?? 0),
      cancelledDeliveries: Number(r['cancelledDeliveries'] ?? 0),
      totalDrivers: Number(r['totalDrivers'] ?? 0),
      availableDrivers: Number(r['availableDrivers'] ?? 0),
      averageDeliveryTime: Number(r['averageDeliveryTime'] ?? 0),
      totalRevenue: Number(r['totalRevenue'] ?? 0),
    };
  }

  private mapDriver(raw: Record<string, unknown>): Driver {
    const lat = raw['currentLatitude'];
    const lon = raw['currentLongitude'];
    return {
      id: Number(raw['id']),
      name: String(raw['name'] ?? ''),
      phone: String(raw['phone'] ?? ''),
      email: raw['email'] as string | undefined,
      avatar: raw['avatar'] as string | undefined,
      vehicle: raw['vehicle'] as string | undefined,
      vehicleType: raw['vehicleType'] as Driver['vehicleType'],
      licensePlate: raw['licensePlate'] as string | undefined,
      rating: Number(raw['rating'] ?? 5),
      totalDeliveries: raw['totalDeliveries'] as number | undefined,
      available: raw['available'] !== false,
      currentLocation:
        lat != null && lon != null
          ? { latitude: Number(lat), longitude: Number(lon) }
          : undefined,
      };
  }

  getAll(): Observable<Delivery[]> {
    return this.http.get<Record<string, unknown>[]>(this.base, { headers: apiJsonHeaders(), params: apiCacheBustParams() }).pipe(
      map((rows) => rows.map((r) => this.mapDelivery(r))),
      catchError(() => of([]))
    );
  }

  getById(id: number): Observable<Delivery> {
    return this.http.get<Record<string, unknown>>(`${this.base}/${id}`, { headers: apiJsonHeaders() }).pipe(map((r) => this.mapDelivery(r)));
  }

  create(delivery: CreateDeliveryRequest): Observable<Delivery> {
    return this.http.post<Record<string, unknown>>(this.base, delivery, { headers: apiJsonHeaders() }).pipe(map((r) => this.mapDelivery(r)));
  }

  update(id: number, delivery: Partial<Delivery>): Observable<Delivery> {
    return this.http.put<Record<string, unknown>>(`${this.base}/${id}`, delivery, { headers: apiJsonHeaders() }).pipe(map((r) => this.mapDelivery(r)));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`, { headers: apiJsonHeaders() });
  }

  updateStatus(id: number, status: DeliveryStatus): Observable<Delivery> {
    return this.http
      .put<Record<string, unknown>>(`${this.base}/${id}/status`, {}, { headers: apiJsonHeaders(), params: new HttpParams().set('status', status) })
      .pipe(map((r) => this.mapDelivery(r)));
  }

  assignDriver(deliveryId: number, driverId: string): Observable<Delivery> {
    return this.http
      .put<Record<string, unknown>>(`${this.base}/${deliveryId}/assign-driver`, { driverId }, { headers: apiJsonHeaders() })
      .pipe(map((r) => this.mapDelivery(r)));
  }

  getStats(): Observable<DeliveryStats> {
    return this.http.get<Record<string, unknown>>(`${this.base}/stats`, { headers: apiJsonHeaders(), params: apiCacheBustParams() }).pipe(
      map((r) => this.mapStats(r)),
      catchError(() =>
        of({
          totalDeliveries: 0,
          pendingDeliveries: 0,
          activeDeliveries: 0,
          completedDeliveries: 0,
          cancelledDeliveries: 0,
          totalDrivers: 0,
          availableDrivers: 0,
          averageDeliveryTime: 0,
          totalRevenue: 0,
        })
      )
    );
  }

  getAllDrivers(): Observable<Driver[]> {
    return this.http.get<Record<string, unknown>[]>(this.driversBase, { headers: apiJsonHeaders(), params: apiCacheBustParams() }).pipe(
      map((rows) => rows.map((r) => this.mapDriver(r))),
      catchError(() => of([]))
    );
  }

  getAvailableDrivers(): Observable<Driver[]> {
    return this.getAllDrivers().pipe(map((drivers) => drivers.filter((d) => d.available)));
  }

  createDriver(driver: Partial<Driver>): Observable<Driver> {
    return this.http.post<Record<string, unknown>>(this.driversBase, driver, { headers: apiJsonHeaders() }).pipe(map((r) => this.mapDriver(r)));
  }

  updateDriver(id: number, driver: Partial<Driver>): Observable<Driver> {
    return this.http.put<Record<string, unknown>>(`${this.driversBase}/${id}`, driver, { headers: apiJsonHeaders() }).pipe(map((r) => this.mapDriver(r)));
  }

  deleteDriver(id: number): Observable<void> {
    return this.http.delete<void>(`${this.driversBase}/${id}`, { headers: apiJsonHeaders() });
  }

  getRestaurants(): Observable<Restaurant[]> {
    return this.http
      .get<Restaurant[]>(apiUrl('/api/restaurants/all'), { headers: apiJsonHeaders(), params: apiCacheBustParams() })
      .pipe(catchError(() => of([])));
  }

  /**
   * Pas d’endpoint « clients » sur le gateway : construit une liste à partir des livraisons réelles.
   */
  getCustomers(): Observable<Customer[]> {
    return this.getAll().pipe(
      map((deliveries) => {
        const byCustomer = new Map<string, Customer>();
        let nextId = 1;
        for (const d of deliveries) {
          const cid = (d.customerId || '').trim();
          if (!cid) continue;
          if (!byCustomer.has(cid)) {
            byCustomer.set(cid, {
              id: nextId++,
              name: `Client ${cid}`,
              phone: d.customerPhone ?? '',
              email: undefined,
              addresses: [
                {
                  id: 1,
                  label: 'Adresse livraison',
                  address: d.deliveryAddress,
                  instructions: d.deliveryInstructions,
                  isDefault: true,
                },
              ],
            });
          }
        }
        return Array.from(byCustomer.values());
      })
    );
  }

  searchCustomers(query: string): Observable<Customer[]> {
    const q = query.trim().toLowerCase();
    return this.getCustomers().pipe(
      map((customers) => {
        if (!q) return customers;
        return customers.filter(
          (c) =>
            c.name.toLowerCase().includes(q) ||
            (c.phone && c.phone.includes(q)) ||
            (c.email?.toLowerCase().includes(q) ?? false)
        );
      })
    );
  }
}
