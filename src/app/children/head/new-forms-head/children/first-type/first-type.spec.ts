import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstType } from './first-type';

describe('FirstType', () => {
  let component: FirstType;
  let fixture: ComponentFixture<FirstType>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FirstType]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FirstType);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
