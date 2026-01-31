import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OrdersStore {
  private orders$ = new BehaviorSubject<any[]>([]);
  private newOrderCount$ = new BehaviorSubject<number>(0);

  getOrders() {
    return this.orders$.asObservable();
  }

  getNewOrderCount() {
    return this.newOrderCount$.asObservable();
  }

  addNewOrder(order: any) {
    const current = this.orders$.value;

    this.orders$.next([order, ...current]);
    this.newOrderCount$.next(this.newOrderCount$.value + 1);
  }

  clearNewOrderCount() {
    this.newOrderCount$.next(0);
  }

  updateOrderStatus(orderId: string, status: string) {
    const updated = this.orders$.value.map((o) =>
      o.id === orderId ? { ...o, status } : o,
    );
    this.orders$.next(updated);
  }
}
