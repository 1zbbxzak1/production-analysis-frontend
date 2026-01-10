import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FifthType } from './fifth-type';

describe('FifthType', () => {
  let component: FifthType;
  let fixture: ComponentFixture<FifthType>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FifthType]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FifthType);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
