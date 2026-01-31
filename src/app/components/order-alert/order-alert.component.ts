import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderAlertService } from '../../services/order-alert.service';

@Component({
  selector: 'app-order-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-alert.component.html',
  styleUrl: './order-alert.component.css',
})
export class OrderAlertComponent {
  order: any = null;

  constructor(private alertService: OrderAlertService) {
    this.alertService.alert$.subscribe((order) => {
      console.log('🟣 Alert received in component:', order);
      this.order = order;
    });
  }

  get itemNames(): string {
    if (!this.order?.items) return '';
    return this.order.items.map((i: any) => i.name).join(', ');
  }

  close() {
    this.order = null;
  }
}
