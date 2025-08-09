import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddKiranaItemComponent } from './add-kirana-item.component';

describe('AddKiranaItemComponent', () => {
  let component: AddKiranaItemComponent;
  let fixture: ComponentFixture<AddKiranaItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddKiranaItemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddKiranaItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
