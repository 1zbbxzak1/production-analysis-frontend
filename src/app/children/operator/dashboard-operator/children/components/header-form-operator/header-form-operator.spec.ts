import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderFormOperator } from './header-form-operator';

describe('HeaderFormOperator', () => {
  let component: HeaderFormOperator;
  let fixture: ComponentFixture<HeaderFormOperator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderFormOperator]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderFormOperator);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
