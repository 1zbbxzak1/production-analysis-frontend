import {ComponentFixture, TestBed} from '@angular/core/testing';

import {FormType12} from './form-type-1-2';

describe('FormEditOperator', () => {
    let component: FormType12;
    let fixture: ComponentFixture<FormType12>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FormType12]
        })
            .compileComponents();

        fixture = TestBed.createComponent(FormType12);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
