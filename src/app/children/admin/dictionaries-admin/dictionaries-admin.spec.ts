import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DictionariesAdmin} from './dictionaries-admin';

describe('DictionariesAdmin', () => {
    let component: DictionariesAdmin;
    let fixture: ComponentFixture<DictionariesAdmin>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DictionariesAdmin]
        })
            .compileComponents();

        fixture = TestBed.createComponent(DictionariesAdmin);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
