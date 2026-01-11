import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompleteOperator } from './complete-operator';

describe('CompleteOperator', () => {
  let component: CompleteOperator;
  let fixture: ComponentFixture<CompleteOperator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompleteOperator]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompleteOperator);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
