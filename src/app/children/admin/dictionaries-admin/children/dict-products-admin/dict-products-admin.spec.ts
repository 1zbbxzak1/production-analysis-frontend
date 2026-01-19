import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DictProductsAdmin} from './dict-products-admin';

describe('DcitProductsAdmin', () => {
    let component: DictProductsAdmin;
    let fixture: ComponentFixture<DictProductsAdmin>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DictProductsAdmin]
        })
            .compileComponents();

        fixture = TestBed.createComponent(DictProductsAdmin);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
