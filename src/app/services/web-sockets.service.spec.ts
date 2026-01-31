import { TestBed } from '@angular/core/testing';

import { WebSocketService } from './web-sockets.service';

describe('WebSocketsService', () => {
  let service: WebSocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebSocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
