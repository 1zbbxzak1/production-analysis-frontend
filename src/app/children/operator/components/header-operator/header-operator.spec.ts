import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderOperator } from './header-operator';

describe('HeaderOperator', () => {
  let component: HeaderOperator;
  let fixture: ComponentFixture<HeaderOperator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderOperator]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderOperator);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
