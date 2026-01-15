import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsTable } from './forms-table';

describe('FormsTable', () => {
  let component: FormsTable;
  let fixture: ComponentFixture<FormsTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormsTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
