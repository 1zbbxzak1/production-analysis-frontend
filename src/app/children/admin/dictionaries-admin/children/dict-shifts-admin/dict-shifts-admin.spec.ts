import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DictShiftsAdmin} from './dict-shifts-admin';

describe('DictShiftsAdmin', () => {
    let component: DictShiftsAdmin;
    let fixture: ComponentFixture<DictShiftsAdmin>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DictShiftsAdmin]
        })
            .compileComponents();

        fixture = TestBed.createComponent(DictShiftsAdmin);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

