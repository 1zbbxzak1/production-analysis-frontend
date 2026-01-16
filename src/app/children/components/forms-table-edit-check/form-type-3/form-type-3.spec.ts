import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormType3 } from './form-type-3';

describe('FormType3', () => {
  let component: FormType3;
  let fixture: ComponentFixture<FormType3>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormType3]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormType3);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
