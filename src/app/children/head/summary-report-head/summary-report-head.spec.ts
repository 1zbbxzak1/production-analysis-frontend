import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SummaryReportHead} from './summary-report-head';

describe('Reports', () => {
    let component: SummaryReportHead;
    let fixture: ComponentFixture<SummaryReportHead>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SummaryReportHead]
        })
            .compileComponents();

        fixture = TestBed.createComponent(SummaryReportHead);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
