import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondType } from './second-type';

describe('SecondType', () => {
  let component: SecondType;
  let fixture: ComponentFixture<SecondType>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecondType]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecondType);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
