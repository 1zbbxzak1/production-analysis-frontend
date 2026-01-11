import {ComponentFixture, TestBed} from '@angular/core/testing';

import {HeaderHead} from './header-head';

describe('Header', () => {
    let component: HeaderHead;
    let fixture: ComponentFixture<HeaderHead>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HeaderHead]
        })
            .compileComponents();

        fixture = TestBed.createComponent(HeaderHead);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
