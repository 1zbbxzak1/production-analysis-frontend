import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {BackHeader} from "../../../../components/back-header/back-header";
import {TuiAlertService} from "@taiga-ui/core";
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {DictManagerService} from '../../../../../data/service/dictionaries/dict.manager.service';
import {ActivatedRoute, Router} from '@angular/router';
import {CreateEmployeeRequest} from '../../../../../data/models/dictionaries/requests/CreateEmployeeRequest';
import {EmployeeDto} from '../../../../../data/models/dictionaries/responses/EmployeeDto';
import {EmployeeFormComponent} from '../../components/employee-form/employee-form';
import {UpdateEmployeeRequest} from '../../../../../data/models/dictionaries/requests/UpdateEmployeeRequest';
import {Loader} from '../../../../../children/components/loader/loader';
import {NgIf} from '@angular/common';

@Component({
    selector: 'app-update-employee-admin',
    imports: [
        BackHeader,
        EmployeeFormComponent,
        Loader,
        NgIf
    ],
    templateUrl: './update-employee-admin.html',
    styleUrl: './update-employee-admin.css',
})
export class UpdateEmployeeAdmin implements OnInit {
    public isLoading: boolean = true;
    public employee: EmployeeDto | undefined;
    private employeeId: number | null = null;

    private readonly _dictManager: DictManagerService = inject(DictManagerService);
    private readonly _router: Router = inject(Router);
    private readonly _route: ActivatedRoute = inject(ActivatedRoute);
    private readonly _destroyRef: DestroyRef = inject(DestroyRef);
    private readonly alerts: TuiAlertService = inject(TuiAlertService);

    public ngOnInit(): void {
        this.employeeId = Number(this._route.snapshot.paramMap.get('id'));

        if (!this.employeeId) {
            this.goBack();
            return;
        }

        this._dictManager.getEmployees().pipe(
            takeUntilDestroyed(this._destroyRef)
        ).subscribe({
            next: (employees: EmployeeDto[]): void => {
                this.employee = employees.find((e: EmployeeDto): boolean => e.id === this.employeeId);
                this.isLoading = false;

                if (!this.employee) {
                    this.alerts.open('Сотрудник не найден', {appearance: 'negative'}).subscribe();
                    this.goBack();
                }
            },
            error: (): void => {
                this.isLoading = false;
                this.alerts.open('Не удалось загрузить данные', {appearance: 'negative'}).subscribe();
                this.goBack();
            }
        });
    }

    protected goBack(): void {
        this._router.navigate(['admin/employees']);
    }

    protected onSave(request: CreateEmployeeRequest): void {
        if (!this.employeeId) {
            return;
        }

        const updateRequest: UpdateEmployeeRequest = {
            firstName: request.firstName,
            lastName: request.lastName,
            middleName: request.middleName,
            email: request.email,
            positionId: request.positionId,
            departmentId: request.departmentId
        };

        this._dictManager.updateEmployee(this.employeeId, updateRequest).pipe(
            takeUntilDestroyed(this._destroyRef)
        ).subscribe({
            next: (response: EmployeeDto): void => {
                this.alerts
                    .open('<strong>Обновлены данные сотрудника</strong>', {
                        appearance: 'positive',
                    })
                    .subscribe();

                this.goBack();
            }
        });
    }

    protected onCancel(): void {
        this.goBack();
    }
}
