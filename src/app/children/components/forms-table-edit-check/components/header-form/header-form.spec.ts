import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderForm } from './header-form';
import { AuthManagerService } from '../../../../../data/service/auth/auth.manager.service';
import { FormDto } from '../../../../../data/models/forms/responses/FormDto';

describe('HeaderFormOperator', () => {
    let component: HeaderForm;
    let fixture: ComponentFixture<HeaderForm>;

    const authManagerMock = {
        getDepartmentName: () => 'Test Dept',
        getUserName: () => 'Test User'
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HeaderForm],
            providers: [
                { provide: AuthManagerService, useValue: authManagerMock }
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(HeaderForm);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should update assigneeName from formInfo', () => {
        const mockFormInfo = {
            assignee: {
                fullName: 'Ivanov Ivan Ivanovich'
            }
        } as FormDto;

        component.formInfo = mockFormInfo;
        component.ngOnChanges({
            formInfo: {
                currentValue: mockFormInfo,
                previousValue: null,
                isFirstChange: () => true,
                firstChange: true
            }
        });

        // "Ivanov Ivan Ivanovich" -> "Ivanov I.I." via formatFullName logic
        expect((component as any).assigneeName).toBe('Ivanov I.I.');
    });

    it('should set assigneeName to null if formInfo is missing assignee', () => {
        const mockFormInfo = {
            assignee: null
        } as unknown as FormDto;

        component.formInfo = mockFormInfo;
        component.ngOnChanges({
            formInfo: {
                currentValue: mockFormInfo,
                previousValue: null,
                isFirstChange: () => true,
                firstChange: true
            }
        });

        expect((component as any).assigneeName).toBeNull();
    });
});
