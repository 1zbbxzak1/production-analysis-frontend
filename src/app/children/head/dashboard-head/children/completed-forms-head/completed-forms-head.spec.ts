import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompletedFormsHead } from './completed-forms-head';

describe('CompletedFormsHead', () => {
  let component: CompletedFormsHead;
  let fixture: ComponentFixture<CompletedFormsHead>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompletedFormsHead]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompletedFormsHead);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
