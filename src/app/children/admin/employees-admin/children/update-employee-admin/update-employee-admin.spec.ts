import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateEmployeeAdmin } from './update-employee-admin';

describe('UpdateEmployeeAdmin', () => {
  let component: UpdateEmployeeAdmin;
  let fixture: ComponentFixture<UpdateEmployeeAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateEmployeeAdmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateEmployeeAdmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
