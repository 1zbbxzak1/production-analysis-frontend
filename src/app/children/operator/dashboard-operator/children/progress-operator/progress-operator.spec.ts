import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressOperator } from './progress-operator';

describe('ProgressOperator', () => {
  let component: ProgressOperator;
  let fixture: ComponentFixture<ProgressOperator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgressOperator]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgressOperator);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
