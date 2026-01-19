import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormType4 } from './form-type-4';

describe('FormType4', () => {
  let component: FormType4;
  let fixture: ComponentFixture<FormType4>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormType4]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormType4);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
