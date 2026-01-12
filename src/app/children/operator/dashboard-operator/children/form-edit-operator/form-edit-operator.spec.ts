import {ComponentFixture, TestBed} from '@angular/core/testing';

import {FormEditOperator} from './form-edit-operator';

describe('FormEditOperator', () => {
    let component: FormEditOperator;
    let fixture: ComponentFixture<FormEditOperator>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FormEditOperator]
        })
            .compileComponents();

        fixture = TestBed.createComponent(FormEditOperator);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
