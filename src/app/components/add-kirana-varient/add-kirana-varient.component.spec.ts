import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddKiranaVarientComponent } from './add-kirana-varient.component';

describe('AddKiranaVarientComponent', () => {
  let component: AddKiranaVarientComponent;
  let fixture: ComponentFixture<AddKiranaVarientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddKiranaVarientComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddKiranaVarientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
