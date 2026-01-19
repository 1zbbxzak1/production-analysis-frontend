import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {NgIf} from '@angular/common';
import {BackHeader} from '../../../../../../components/back-header/back-header';
import {DepartmentFormComponent} from '../../../../components/department-form/department-form';
import {Loader} from '../../../../../../components/loader/loader';
import {DepartmentDto} from '../../../../../../../data/models/dictionaries/responses/DepartmentDto';
import {DictManagerService} from '../../../../../../../data/service/dictionaries/dict.manager.service';
import {ActivatedRoute, Router} from '@angular/router';
import {TuiAlertService} from '@taiga-ui/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {CreateDepartmentRequest} from '../../../../../../../data/models/dictionaries/requests/CreateDepartmentRequest';
import {UpdateDepartmentRequest} from '../../../../../../../data/models/dictionaries/requests/UpdateDepartmentRequest';

@Component({
    selector: 'app-update-department-admin',
    imports: [
        BackHeader,
        DepartmentFormComponent,
        Loader,
        NgIf
    ],
    templateUrl: './update-department-admin.html',
    styleUrl: './update-department-admin.css',
})
export class UpdateDepartmentAdmin implements OnInit {
    public isLoading: boolean = true;
    public department: DepartmentDto | undefined;
    private departmentId: number | null = null;

    private readonly _dictManager: DictManagerService = inject(DictManagerService);
    private readonly _router: Router = inject(Router);
    private readonly _route: ActivatedRoute = inject(ActivatedRoute);
    private readonly _destroyRef: DestroyRef = inject(DestroyRef);
    private readonly alerts: TuiAlertService = inject(TuiAlertService);

    public ngOnInit(): void {
        this.departmentId = Number(this._route.snapshot.paramMap.get('id'));

        if (!this.departmentId) {
            this.goBack();
            return;
        }

        this._dictManager.getDepartments().pipe(
            takeUntilDestroyed(this._destroyRef)
        ).subscribe({
            next: (departments: DepartmentDto[]): void => {
                this.department = departments.find((d: DepartmentDto): boolean => d.id === this.departmentId);
                this.isLoading = false;

                if (!this.department) {
                    this.alerts.open('Подразделение не найдено', {appearance: 'negative'}).subscribe();
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
        this._router.navigate(['admin/dictionaries/departments']);
    }

    protected onSave(request: CreateDepartmentRequest): void {
        if (!this.departmentId) {
            return;
        }

        const updateRequest: UpdateDepartmentRequest = {
            name: request.name,
            enterpriseId: request.enterpriseId
        };

        this._dictManager.updateDepartment(this.departmentId, updateRequest).pipe(
            takeUntilDestroyed(this._destroyRef)
        ).subscribe({
            next: (): void => {
                this.alerts
                    .open('<strong>Подразделение обновлено</strong>', {
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
