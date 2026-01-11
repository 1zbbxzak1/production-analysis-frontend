import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FourthType } from './fourth-type';

describe('FourthType', () => {
  let component: FourthType;
  let fixture: ComponentFixture<FourthType>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FourthType]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FourthType);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
