import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DictDowntimeReasonGroupsAdmin } from './dict-downtime-reason-groups-admin';

describe('DictDowntimeReasonGroupsAdmin', () => {
  let component: DictDowntimeReasonGroupsAdmin;
  let fixture: ComponentFixture<DictDowntimeReasonGroupsAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DictDowntimeReasonGroupsAdmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DictDowntimeReasonGroupsAdmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
