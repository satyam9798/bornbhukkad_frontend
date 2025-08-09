import { TestBed } from '@angular/core/testing';

import { MenueServicesService } from './menue-services.service';

describe('MenueServicesService', () => {
  let service: MenueServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MenueServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
