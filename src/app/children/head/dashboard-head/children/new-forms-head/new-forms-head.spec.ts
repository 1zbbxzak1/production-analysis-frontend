import {ComponentFixture, TestBed} from '@angular/core/testing';

import {NewFormsHead} from './new-forms-head';

describe('Forms', () => {
    let component: NewFormsHead;
    let fixture: ComponentFixture<NewFormsHead>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [NewFormsHead]
        })
            .compileComponents();

        fixture = TestBed.createComponent(NewFormsHead);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
