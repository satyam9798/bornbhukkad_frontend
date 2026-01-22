import { TestBed } from '@angular/core/testing';

import { PublicLinkService } from './public-link.service';

describe('PublicLinkService', () => {
  let service: PublicLinkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PublicLinkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
