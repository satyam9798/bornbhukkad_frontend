import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { OrdersStore } from '../../stores/orders.store';

@Component({
  selector: 'app-order-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-card.component.html',
  styleUrl: './order-card.component.css',
})
export class OrderCardComponent implements OnInit, OnDestroy {
  @Input() order: any;

  remainingSeconds = 0;
  isCritical = false;
  intervalId!: ReturnType<typeof setInterval>;

  constructor(
    private ordersStore: OrdersStore,
    private http: HttpClient,
  ) {}

  ngOnInit() {
    if (this.order.status === 'NEW') {
      this.startTimer();
    }
  }

  startTimer() {
    this.intervalId = setInterval(() => {
      const deadline = new Date(this.order.acceptanceDeadline).getTime();
      const now = Date.now();

      this.remainingSeconds = Math.max(Math.floor((deadline - now) / 1000), 0);

      this.isCritical = this.remainingSeconds <= 20;

      if (this.remainingSeconds === 0) {
        clearInterval(this.intervalId);
      }
    }, 1000);
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  accept() {
    this.http.post(`/api/orders/${this.order.id}/accept`, {}).subscribe(() => {
      this.ordersStore.updateOrderStatus(this.order.id, 'ACCEPTED');
      clearInterval(this.intervalId);
    });
  }

  reject() {
    this.http.post(`/api/orders/${this.order.id}/reject`, {}).subscribe(() => {
      this.ordersStore.updateOrderStatus(this.order.id, 'REJECTED');
      clearInterval(this.intervalId);
    });
  }
}
