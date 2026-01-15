import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompletedFormPopUp } from './completed-form-pop-up';

describe('CompletedFormPopUp', () => {
  let component: CompletedFormPopUp;
  let fixture: ComponentFixture<CompletedFormPopUp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompletedFormPopUp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompletedFormPopUp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
