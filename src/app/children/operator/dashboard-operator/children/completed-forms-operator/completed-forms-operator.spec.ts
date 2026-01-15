import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CompletedFormsOperator} from './completed-forms-operator';

describe('CompleteOperator', () => {
    let component: CompletedFormsOperator;
    let fixture: ComponentFixture<CompletedFormsOperator>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CompletedFormsOperator]
        })
            .compileComponents();

        fixture = TestBed.createComponent(CompletedFormsOperator);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
