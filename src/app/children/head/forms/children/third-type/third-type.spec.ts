import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThirdType } from './third-type';

describe('ThirdType', () => {
  let component: ThirdType;
  let fixture: ComponentFixture<ThirdType>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThirdType]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThirdType);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
