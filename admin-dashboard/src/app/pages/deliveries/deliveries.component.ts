import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DeliveryService } from '../../services/delivery.service';
import { Delivery, DeliveryStatus, CreateDeliveryRequest, Driver } from '../../models/delivery.model';

@Component({
  selector: 'app-deliveries',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './deliveries.component.html'
})
export class DeliveriesComponent implements OnInit {
  deliveries: Delivery[] = [];
  filtered: Delivery[] = [];
  loading = true;
  filterStatus = '';
  searchQuery = '';

  // Creation modal
  showCreateModal = false;
  creating = false;
  /** Liste livreurs pour le select (chargée à l’ouverture du modal). */
  driversForSelect: Driver[] = [];
  newDelivery: CreateDeliveryRequest = {
    customerId: '',
    restaurantId: '',
    deliveryAddress: '',
    driverId: '',
  };

  statuses: DeliveryStatus[] = ['PENDING','CONFIRMED','PREPARING','PICKED_UP','ON_THE_WAY','DELIVERED','CANCELLED'];

  constructor(private deliveryService: DeliveryService) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading = true;
    this.deliveryService.getAll().subscribe({
      next: (data) => { this.deliveries = data; this.applyFilter(); this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  applyFilter() {
    this.filtered = this.deliveries.filter(d => {
      const matchStatus = !this.filterStatus || d.status === this.filterStatus;
      const q = this.searchQuery.toLowerCase();
      const matchSearch = !this.searchQuery ||
        d.orderId.toLowerCase().includes(q) ||
        d.deliveryAddress.toLowerCase().includes(q) ||
        d.customerId.toLowerCase().includes(q) ||
        d.restaurantId.toLowerCase().includes(q) ||
        (d.driverName?.toLowerCase().includes(q) ?? false);
      return matchStatus && matchSearch;
    });
  }

  updateStatus(delivery: Delivery, status: DeliveryStatus) {
    if (delivery.id) {
      this.deliveryService.updateStatus(delivery.id, status).subscribe(() => this.load());
    }
  }

  delete(id: number | undefined) {
    if (id && confirm('Supprimer cette livraison ?')) {
      this.deliveryService.delete(id).subscribe(() => this.load());
    }
  }

  statusBadge(status: DeliveryStatus): string {
    const map: Record<string, string> = {
      PENDING: 'badge-gray', CONFIRMED: 'badge-blue', PREPARING: 'badge-orange',
      PICKED_UP: 'badge-orange', ON_THE_WAY: 'badge-orange', DELIVERED: 'badge-green', CANCELLED: 'badge-red'
    };
    return map[status] ?? 'badge-gray';
  }

  statusLabel(status: DeliveryStatus): string {
    const map: Record<string, string> = {
      PENDING: 'En attente', CONFIRMED: 'Confirmée', PREPARING: 'Préparation',
      PICKED_UP: 'Récupérée', ON_THE_WAY: 'En route', DELIVERED: 'Livrée', CANCELLED: 'Annulée'
    };
    return map[status] ?? status;
  }

  // Delivery Creation Methods
  openCreateModal() {
    this.newDelivery = this.getEmptyDelivery();
    this.showCreateModal = true;
    this.deliveryService.getAllDrivers().subscribe({
      next: (rows) => {
        this.driversForSelect = [...rows].sort((a, b) => {
          if (a.available !== b.available) return a.available ? -1 : 1;
          return a.name.localeCompare(b.name, 'fr');
        });
      },
      error: () => {
        this.driversForSelect = [];
      },
    });
  }

  closeCreateModal() {
    this.showCreateModal = false;
    this.newDelivery = this.getEmptyDelivery();
    this.creating = false;
  }

  createDelivery() {
    if (!this.isValidDelivery()) return;

    this.creating = true;
    // select + [value] numérique peut lier un number : ne pas appeler .trim() directement
    const oid = String(this.newDelivery.orderId ?? '').trim();
    const did = String(this.newDelivery.driverId ?? '').trim();
    const body: CreateDeliveryRequest = {
      orderId: oid.length > 0 ? oid : undefined,
      customerId: this.newDelivery.customerId!.trim(),
      restaurantId: this.newDelivery.restaurantId!.trim(),
      deliveryAddress: this.newDelivery.deliveryAddress!.trim(),
      ...(did.length > 0 ? { driverId: did } : {}),
    };
    const lat = this.newDelivery.deliveryLatitude;
    const lon = this.newDelivery.deliveryLongitude;
    if (lat !== undefined && lat !== null && `${lat}`.trim() !== '' && !Number.isNaN(Number(lat))) {
      body.deliveryLatitude = Number(lat);
    }
    if (lon !== undefined && lon !== null && `${lon}`.trim() !== '' && !Number.isNaN(Number(lon))) {
      body.deliveryLongitude = Number(lon);
    }

    this.deliveryService.create(body).subscribe({
      next: () => {
        this.load();
        this.closeCreateModal();
      },
      error: (error) => {
        console.error('Error creating delivery:', error);
        const status = error?.status;
        const msg = this.httpErrorMessage(error);
        alert(
          `Echec création livraison (HTTP ${status ?? '?'}). ${msg}`
        );
        this.creating = false;
      }
    });
  }

  private isValidDelivery(): boolean {
    return !!(
      this.newDelivery.customerId?.trim() &&
      this.newDelivery.restaurantId?.trim() &&
      this.newDelivery.deliveryAddress?.trim()
    );
  }

  private getEmptyDelivery(): CreateDeliveryRequest {
    return {
      orderId: '',
      customerId: '',
      restaurantId: '',
      deliveryAddress: '',
      driverId: '',
    };
  }

  /** Extrait un message lisible depuis la réponse Spring / navigateur. */
  private httpErrorMessage(error: unknown): string {
    const e = error as {
      status?: number;
      message?: string;
      error?: string | { message?: string };
    };
    if (e?.status === 0) {
      return 'Pas de réponse : démarre Eureka puis api-gateway (port 8080) et delivery-service. Vérifie MySQL pour delivery_db.';
    }
    const body = e?.error;
    if (typeof body === 'string') return body;
    const m = body?.message ?? e?.message;
    if (typeof m === 'string') return m;
    return 'Vérifie client, restaurant, adresse, livreur disponible. Redémarre Eureka + gateway + delivery-service si besoin.';
  }
}
