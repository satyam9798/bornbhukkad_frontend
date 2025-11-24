import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCredItemComponent } from './add-cred-item.component';

describe('AddCredItemComponent', () => {
  let component: AddCredItemComponent;
  let fixture: ComponentFixture<AddCredItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCredItemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddCredItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
