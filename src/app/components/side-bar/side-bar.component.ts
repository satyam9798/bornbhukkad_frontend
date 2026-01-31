import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersStore } from '../../stores/orders.store';
@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css',
})
export class SideBarComponent {
  constructor(private ordersStore: OrdersStore) {}

  newOrderCount$ = this.ordersStore.getNewOrderCount();

  @Output() changeDashboardEvent = new EventEmitter<string>();

  emitEvent(dashboardName: string) {
    this.changeDashboardEvent.emit(dashboardName);
  }
}
