import {Component, DestroyRef, inject} from '@angular/core';
import {BackHeader} from "../../../../../../components/back-header/back-header";
import {TuiAlertService} from "@taiga-ui/core";
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {DictManagerService} from '../../../../../../../data/service/dictionaries/dict.manager.service';
import {Router} from '@angular/router';
import {CreateDepartmentRequest} from '../../../../../../../data/models/dictionaries/requests/CreateDepartmentRequest';
import {DepartmentFormComponent} from '../../../../components/department-form/department-form';

@Component({
    selector: 'app-create-department-admin',
    imports: [
        BackHeader,
        DepartmentFormComponent
    ],
    templateUrl: './create-department-admin.html',
    styleUrl: './create-department-admin.css',
})
export class CreateDepartmentAdmin {
    private readonly _dictManager: DictManagerService = inject(DictManagerService);
    private readonly _router: Router = inject(Router);
    private readonly _destroyRef: DestroyRef = inject(DestroyRef);
    private readonly alerts: TuiAlertService = inject(TuiAlertService);

    protected goBack(): void {
        this._router.navigate(['admin/dictionaries/departments']);
    }

    protected onSave(request: CreateDepartmentRequest): void {
        this._dictManager.createDepartment(request).pipe(
            takeUntilDestroyed(this._destroyRef)
        ).subscribe({
            next: (): void => {
                this.alerts
                    .open('<strong>Новое подразделение добавлено</strong>', {
                        appearance: 'positive',
                    })
                    .subscribe();

                this.goBack();
            },
            error: (): void => {
                this.alerts
                    .open('Ошибка при создании', {
                        appearance: 'negative',
                    })
                    .subscribe();
            }
        });
    }

    protected onCancel(): void {
        this.goBack();
    }
}
