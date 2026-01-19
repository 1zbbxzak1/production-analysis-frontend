import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmployeesAdmin } from './employees-admin';
import { DictManagerService } from '../../../data/service/dictionaries/dict.manager.service';
import { of } from 'rxjs';
import { SearchFormsService } from '../../../data/service/forms/search.forms.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('EmployeesAdmin', () => {
    let component: EmployeesAdmin;
    let fixture: ComponentFixture<EmployeesAdmin>;

    const dictManagerMock = {
        getEmployees: () => of([]),
        getDepartments: () => of([]),
        deleteEmployee: () => of(void 0)
    };

    const searchFormsServiceMock = {
        searchValue$: of('')
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EmployeesAdmin, RouterTestingModule],
            providers: [
                { provide: DictManagerService, useValue: dictManagerMock },
                { provide: SearchFormsService, useValue: searchFormsServiceMock }
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(EmployeesAdmin);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

