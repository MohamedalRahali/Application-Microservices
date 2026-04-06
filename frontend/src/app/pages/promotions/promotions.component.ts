import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PromotionService } from '../../services/promotion.service';
import { Promotion, ValidateCodeResponse } from '../../models/promotion.model';

@Component({
  selector: 'app-promotions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './promotions.component.html'
})
export class PromotionsComponent implements OnInit {
  promotions: Promotion[] = [];
  loading = true;
  promoCode = '';
  orderAmount = 0;
  validateResult: ValidateCodeResponse | null = null;
  validating = false;

  constructor(private promotionService: PromotionService) {}

  ngOnInit() {
    this.promotionService.getActive().subscribe({
      next: (data) => { this.promotions = data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  validateCode() {
    if (!this.promoCode.trim()) return;
    this.validating = true;
    this.promotionService.validateCode({ code: this.promoCode, orderAmount: this.orderAmount }).subscribe({
      next: (res) => { this.validateResult = res; this.validating = false; },
      error: () => { this.validating = false; }
    });
  }

  typeLabel(type: string): string {
    const map: Record<string, string> = {
      PERCENTAGE: '% Réduction',
      FIXED_AMOUNT: 'Montant fixe',
      FREE_DELIVERY: 'Livraison gratuite',
      BUY_ONE_GET_ONE: '1 acheté = 1 offert'
    };
    return map[type] ?? type;
  }

  daysLeft(validUntil: string): number {
    const diff = new Date(validUntil).getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }
}
