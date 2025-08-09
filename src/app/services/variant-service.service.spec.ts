import { TestBed } from '@angular/core/testing';

import { VariantServiceService } from './variant-service.service';

describe('VariantServiceService', () => {
  let service: VariantServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VariantServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
