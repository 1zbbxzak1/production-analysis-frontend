import {ComponentFixture, TestBed} from '@angular/core/testing';

import {UpdateDowntimeReasonGroupAdmin} from './update-downtime-reason-group-admin';

describe('UpdateDowntimeReasonGroupAdmin', () => {
    let component: UpdateDowntimeReasonGroupAdmin;
    let fixture: ComponentFixture<UpdateDowntimeReasonGroupAdmin>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [UpdateDowntimeReasonGroupAdmin]
        })
            .compileComponents();

        fixture = TestBed.createComponent(UpdateDowntimeReasonGroupAdmin);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
