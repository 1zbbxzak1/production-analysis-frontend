import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardOperator } from './dashboard-operator';

describe('DashboardOperator', () => {
  let component: DashboardOperator;
  let fixture: ComponentFixture<DashboardOperator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardOperator]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardOperator);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
