import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersStore } from '../../stores/orders.store';
import { OrderCardComponent } from '../order-card/order-card.component';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, OrderCardComponent],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css',
})
export class OrdersComponent {
  constructor(private ordersStore: OrdersStore) {}

  orders: any[] = [];

  ngOnInit() {
    this.ordersStore.getOrders().subscribe((orders) => {
      this.orders = orders;
    });

    this.ordersStore.clearNewOrderCount();
  }

  get newOrders() {
    return this.orders.filter((o) => o.status === 'NEW');
  }

  get oldOrders() {
    return this.orders.filter((o) => o.status !== 'NEW');
  }
}
