import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PromotionService } from '../../services/promotion.service';
import { Promotion, PromotionType } from '../../models/promotion.model';

@Component({
  selector: 'app-promotions-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './promotions.component.html'
})
export class PromotionsAdminComponent implements OnInit {
  promotions: Promotion[] = [];
  loading = true;
  showForm = false;
  isEditing = false;
  editingPromo: Partial<Promotion> = {};

  types: PromotionType[] = ['PERCENTAGE', 'FIXED_AMOUNT', 'FREE_DELIVERY', 'BUY_ONE_GET_ONE'];

  constructor(private promotionService: PromotionService) {}

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.promotionService.getAll().subscribe({
      next: (data) => { this.promotions = data; this.loading = false; },
      error: (err) => {
        this.loading = false;
        console.error(err);
        alert('Impossible de charger les promotions. Verifie console (F12).');
      }
    });
  }

  openCreate() {
    this.editingPromo = {
      active: true,
      type: 'PERCENTAGE',
      validFrom: new Date().toISOString().slice(0, 16),
      validUntil: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 16)
    };
    this.isEditing = false;
    this.showForm = true;
  }

  openEdit(p: Promotion) {
    this.editingPromo = {
      ...p,
      validFrom: p.validFrom?.slice(0, 16),
      validUntil: p.validUntil?.slice(0, 16)
    };
    this.isEditing = true;
    this.showForm = true;
  }

  save() {
    if (this.isEditing && this.editingPromo.id) {
      this.promotionService.update(this.editingPromo.id, this.editingPromo).subscribe({
        next: () => { this.showForm = false; this.load(); },
        error: (err) => {
          console.error(err);
          alert('Échec enregistrement promotion (champs obligatoires: titre, type, dates valide).');
        }
      });
    } else {
      this.promotionService.create(this.editingPromo).subscribe({
        next: () => { this.showForm = false; this.load(); },
        error: (err) => {
          console.error(err);
          alert('Échec création promotion (titre, type, date fin obligatoires).');
        }
      });
    }
  }

  delete(id: number) {
    if (confirm('Supprimer cette promotion ?')) {
      this.promotionService.delete(id).subscribe(() => this.load());
    }
  }

  typeLabel(type: string): string {
    const map: Record<string, string> = {
      PERCENTAGE: '% Réduction', FIXED_AMOUNT: 'Montant fixe',
      FREE_DELIVERY: 'Livraison gratuite', BUY_ONE_GET_ONE: '1 acheté = 1 offert'
    };
    return map[type] ?? type;
  }

  isExpired(validUntil: string): boolean {
    return new Date(validUntil) < new Date();
  }
}
