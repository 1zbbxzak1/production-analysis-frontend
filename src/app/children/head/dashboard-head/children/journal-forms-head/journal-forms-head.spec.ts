import {ComponentFixture, TestBed} from '@angular/core/testing';

import {JournalFormsHead} from './journal-forms-head';

describe('Archive', () => {
    let component: JournalFormsHead;
    let fixture: ComponentFixture<JournalFormsHead>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [JournalFormsHead]
        })
            .compileComponents();

        fixture = TestBed.createComponent(JournalFormsHead);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
