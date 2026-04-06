import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DeliveryService } from '../../services/delivery.service';
import { Driver } from '../../models/delivery.model';

@Component({
  selector: 'app-drivers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './drivers.component.html'
})
export class DriversComponent implements OnInit {
  drivers: Driver[] = [];
  loading = true;
  showForm = false;
  editingDriver: Partial<Driver> = {};
  isEditing = false;

  constructor(private deliveryService: DeliveryService) {}

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.deliveryService.getAllDrivers().subscribe({
      next: (data) => { this.drivers = data; this.loading = false; },
      error: (err) => {
        this.loading = false;
        console.error(err);
        alert('Impossible de charger les livreurs. Verifie console (F12).');
      }
    });
  }

  openCreate() {
    this.editingDriver = { available: true, rating: 5.0 };
    this.isEditing = false;
    this.showForm = true;
  }

  openEdit(driver: Driver) {
    this.editingDriver = { ...driver };
    this.isEditing = true;
    this.showForm = true;
  }

  /** Corps d’API = champs Java `Driver` uniquement (évite champs UI inconnus du backend). */
  private driverApiPayload(): Partial<Driver> | null {
    const name = this.editingDriver.name?.trim();
    const phone = this.editingDriver.phone?.trim();
    if (!name || !phone) {
      return null;
    }
    const r = this.editingDriver.rating;
    return {
      name,
      phone,
      vehicle: this.editingDriver.vehicle?.trim() || undefined,
      avatar: this.editingDriver.avatar?.trim() || undefined,
      available: this.editingDriver.available !== false,
      rating: r != null && !Number.isNaN(Number(r)) ? Number(r) : 5,
    };
  }

  save() {
    const payload = this.driverApiPayload();
    if (!payload) {
      alert('Nom et téléphone sont obligatoires pour le livreur.');
      return;
    }
    if (this.isEditing && this.editingDriver.id) {
      this.deliveryService.updateDriver(this.editingDriver.id, payload).subscribe({
        next: () => { this.showForm = false; this.load(); },
        error: (err) => {
          console.error(err);
          alert(this.driverErrorMessage(err));
        }
      });
    } else {
      this.deliveryService.createDriver(payload).subscribe({
        next: () => { this.showForm = false; this.load(); },
        error: (err) => {
          console.error(err);
          alert(this.driverErrorMessage(err));
        }
      });
    }
  }

  delete(id: number) {
    if (confirm('Supprimer ce livreur ?')) {
      this.deliveryService.deleteDriver(id).subscribe(() => this.load());
    }
  }

  private driverErrorMessage(err: unknown): string {
    const e = err as { status?: number; message?: string; error?: string | { message?: string } };
    if (e?.status === 0) {
      return 'Pas de réponse (gateway 8080 / delivery-service arrêté, ou CORS). Démarre Eureka puis gateway puis delivery-service.';
    }
    const body = e?.error;
    if (typeof body === 'string') return body;
    const m = body?.message ?? e?.message;
    if (typeof m === 'string') return m;
    return 'Échec livreur : nom et téléphone obligatoires ; vérifie MySQL (delivery_db) et les logs delivery-service.';
  }
}
