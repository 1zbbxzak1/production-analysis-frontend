import {ComponentFixture, TestBed} from '@angular/core/testing';

import {FormType1Operator} from './form-type-1-operator';

describe('FormEditOperator', () => {
    let component: FormType1Operator;
    let fixture: ComponentFixture<FormType1Operator>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FormType1Operator]
        })
            .compileComponents();

        fixture = TestBed.createComponent(FormType1Operator);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
