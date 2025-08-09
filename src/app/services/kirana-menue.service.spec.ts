import { TestBed } from '@angular/core/testing';

import { KiranaMenueService } from './kirana-menue.service';

describe('KiranaMenueService', () => {
  let service: KiranaMenueService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KiranaMenueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
