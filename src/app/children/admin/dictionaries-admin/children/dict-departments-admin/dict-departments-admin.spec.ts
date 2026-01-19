import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DictDepartmentsAdmin} from './dict-departments-admin';

describe('DictDepartmentsAdmin', () => {
    let component: DictDepartmentsAdmin;
    let fixture: ComponentFixture<DictDepartmentsAdmin>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DictDepartmentsAdmin]
        })
            .compileComponents();

        fixture = TestBed.createComponent(DictDepartmentsAdmin);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
