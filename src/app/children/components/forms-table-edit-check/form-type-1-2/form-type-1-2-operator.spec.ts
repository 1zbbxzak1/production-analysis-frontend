import {ComponentFixture, TestBed} from '@angular/core/testing';

import {FormType12Operator} from './form-type-1-2-operator';

describe('FormEditOperator', () => {
    let component: FormType12Operator;
    let fixture: ComponentFixture<FormType12Operator>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FormType12Operator]
        })
            .compileComponents();

        fixture = TestBed.createComponent(FormType12Operator);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
