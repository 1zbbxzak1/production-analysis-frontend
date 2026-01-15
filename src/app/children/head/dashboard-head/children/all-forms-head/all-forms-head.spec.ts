import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllFormsHead } from './all-forms-head';

describe('AllFormsHead', () => {
  let component: AllFormsHead;
  let fixture: ComponentFixture<AllFormsHead>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllFormsHead]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllFormsHead);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
