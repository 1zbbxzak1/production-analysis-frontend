import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DashboardHead} from './dashboard-head';

describe('Dashboard', () => {
    let component: DashboardHead;
    let fixture: ComponentFixture<DashboardHead>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DashboardHead]
        })
            .compileComponents();

        fixture = TestBed.createComponent(DashboardHead);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
