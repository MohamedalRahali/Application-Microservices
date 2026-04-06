import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DeliveryService } from '../../services/delivery.service';
import { Delivery } from '../../models/delivery.model';
import { interval, Subscription } from 'rxjs';

interface TimelineStep {
  status: string;
  label: string;
  completed: boolean;
  time?: string;
}

@Component({
  selector: 'app-delivery-tracking',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delivery-tracking.component.html'
})
export class DeliveryTrackingComponent implements OnInit, OnDestroy {
  delivery: Delivery | null = null;
  orderId = '';
  estimatedTime = 0;
  loading = true;
  private timerSub?: Subscription;

  timeline: TimelineStep[] = [];

  constructor(
    private route: ActivatedRoute,
    private deliveryService: DeliveryService
  ) {}

  ngOnInit() {
    this.orderId = this.route.snapshot.paramMap.get('orderId') ?? '';
    this.deliveryService.getByOrderId(this.orderId).subscribe({
      next: (d) => {
        this.delivery = d;
        this.estimatedTime = d.estimatedMinutes ?? 0;
        this.buildTimeline(d);
        this.loading = false;
        if (d.status !== 'DELIVERED' && d.status !== 'CANCELLED') {
          this.timerSub = interval(60000).subscribe(() => {
            this.estimatedTime = Math.max(0, this.estimatedTime - 1);
          });
        }
      },
      error: () => { this.loading = false; }
    });
  }

  buildTimeline(d: Delivery) {
    const statuses = ['CONFIRMED', 'PREPARING', 'PICKED_UP', 'ON_THE_WAY', 'DELIVERED'];
    const labels: Record<string, string> = {
      CONFIRMED: 'Commande confirmée',
      PREPARING: 'En préparation',
      PICKED_UP: 'Récupérée par le livreur',
      ON_THE_WAY: 'En route',
      DELIVERED: 'Livrée'
    };
    const currentIdx = statuses.indexOf(d.status);
    this.timeline = statuses.map((s, i) => ({
      status: s,
      label: labels[s],
      completed: i <= currentIdx,
      time: i < currentIdx ? '✓' : undefined
    }));
  }

  ngOnDestroy() {
    this.timerSub?.unsubscribe();
  }
}
