import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ProgressFormsOperator} from './progress-forms-operator';

describe('ProgressOperator', () => {
    let component: ProgressFormsOperator;
    let fixture: ComponentFixture<ProgressFormsOperator>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ProgressFormsOperator]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ProgressFormsOperator);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
