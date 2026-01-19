import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CreateDowntimeReasonGroupAdmin} from './create-downtime-reason-group-admin';

describe('CreateDowntimeReasonGroupAdmin', () => {
    let component: CreateDowntimeReasonGroupAdmin;
    let fixture: ComponentFixture<CreateDowntimeReasonGroupAdmin>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CreateDowntimeReasonGroupAdmin]
        })
            .compileComponents();

        fixture = TestBed.createComponent(CreateDowntimeReasonGroupAdmin);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
