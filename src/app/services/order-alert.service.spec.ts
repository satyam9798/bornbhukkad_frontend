import { TestBed } from '@angular/core/testing';

import { OrderAlertService } from './order-alert.service';

describe('OrderAlertService', () => {
  let service: OrderAlertService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrderAlertService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
