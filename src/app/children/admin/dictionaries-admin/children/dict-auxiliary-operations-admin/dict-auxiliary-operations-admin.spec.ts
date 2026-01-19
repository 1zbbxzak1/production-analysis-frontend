import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DictAuxiliaryOperationsAdmin} from './dict-auxiliary-operations-admin';

describe('AuxiliaryOperationsAdmin', () => {
    let component: DictAuxiliaryOperationsAdmin;
    let fixture: ComponentFixture<DictAuxiliaryOperationsAdmin>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DictAuxiliaryOperationsAdmin]
        })
            .compileComponents();

        fixture = TestBed.createComponent(DictAuxiliaryOperationsAdmin);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
