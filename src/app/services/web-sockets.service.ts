import { Injectable, NgZone } from '@angular/core';
import { OrdersStore } from '../stores/orders.store';
import { OrderAlertService } from './order-alert.service';

@Injectable({ providedIn: 'root' })
export class WebSocketService {
  constructor(
    private ordersStore: OrdersStore,
    private alertService: OrderAlertService,
    private zone: NgZone,
  ) {}

  private socket!: WebSocket;

  connect(merchantId: string) {
    console.log('🔌 Connecting to WebSocket...');

    this.socket = new WebSocket('ws://localhost:8080/chat');

    this.socket.onopen = () => {
      console.log('✅ WebSocket connected');

      const payload = {
        merchantId,
        type: 'REGISTER',
      };

      console.log('➡️ Sending register payload:', payload);
      this.socket.send(JSON.stringify(payload));
    };

    // this.socket.onmessage = (event) => {
    //   console.log('📩 WebSocket message received:', event.data);
    //   this.handleEvent(event.data);
    // };
    this.socket.onmessage = (event) => {
      this.zone.run(() => {
        this.handleEvent(event.data);
      });
    };

    this.socket.onerror = (error) => {
      console.error('❌ WebSocket error:', error);
    };

    this.socket.onclose = () => {
      console.warn('🔌 WebSocket closed');
    };
  }
  handleEvent(data: any) {
    const parsedData = JSON.parse(data);
    if (parsedData.event === 'NEW_ORDER') {
      this.playSound();
      this.ordersStore.addNewOrder(parsedData.order);
      this.alertService.show(parsedData.order);
    }
  }

  playSound() {
    const audio = new Audio('assets/sounds/notif-2.mp3');
    audio.load();
    audio.play().catch((err) => console.error('Audio error:', err));
  }
}
