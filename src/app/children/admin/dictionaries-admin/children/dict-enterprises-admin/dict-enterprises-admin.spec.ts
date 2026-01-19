import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DictEnterprisesAdmin} from './dict-enterprises-admin';

describe('DictEnterprisesAdmin', () => {
    let component: DictEnterprisesAdmin;
    let fixture: ComponentFixture<DictEnterprisesAdmin>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DictEnterprisesAdmin]
        })
            .compileComponents();

        fixture = TestBed.createComponent(DictEnterprisesAdmin);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
