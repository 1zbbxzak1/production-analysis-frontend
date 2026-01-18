import {ComponentFixture, TestBed} from '@angular/core/testing';

import {FormType5} from './form-type-5';

describe('FormType4', () => {
    let component: FormType5;
    let fixture: ComponentFixture<FormType5>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FormType5]
        })
            .compileComponents();

        fixture = TestBed.createComponent(FormType5);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
