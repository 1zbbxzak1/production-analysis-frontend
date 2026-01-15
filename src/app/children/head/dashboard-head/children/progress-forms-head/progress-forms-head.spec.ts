import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressFormsHead } from './progress-forms-head';

describe('ProgressFormsHead', () => {
  let component: ProgressFormsHead;
  let fixture: ComponentFixture<ProgressFormsHead>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgressFormsHead]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgressFormsHead);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
