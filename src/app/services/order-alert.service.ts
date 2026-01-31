import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OrderAlertService {
  private alertSubject = new BehaviorSubject<any | null>(null);
  alert$ = this.alertSubject.asObservable();

  show(order: any) {
    this.alertSubject.next(order);

    setTimeout(() => {
      this.alertSubject.next(null);
    }, 8000);
  }
}
