import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCustomGroupsComponent } from './add-custom-groups.component';

describe('AddCustomGroupsComponent', () => {
  let component: AddCustomGroupsComponent;
  let fixture: ComponentFixture<AddCustomGroupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCustomGroupsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddCustomGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
