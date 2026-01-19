import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CreateEmployeeAdmin} from './create-employee-admin';

describe('CreateEmployeeAdmin', () => {
    let component: CreateEmployeeAdmin;
    let fixture: ComponentFixture<CreateEmployeeAdmin>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CreateEmployeeAdmin]
        })
            .compileComponents();

        fixture = TestBed.createComponent(CreateEmployeeAdmin);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
