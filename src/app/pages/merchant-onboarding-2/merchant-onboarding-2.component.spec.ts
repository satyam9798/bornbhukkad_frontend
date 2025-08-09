import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantOnboarding2Component } from './merchant-onboarding-2.component';

describe('MerchantOnboarding2Component', () => {
  let component: MerchantOnboarding2Component;
  let fixture: ComponentFixture<MerchantOnboarding2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MerchantOnboarding2Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MerchantOnboarding2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
