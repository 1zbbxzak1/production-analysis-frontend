import {Component, DestroyRef, inject} from '@angular/core';
import {BackHeader} from "../../../../components/back-header/back-header";
import {TuiAlertService} from "@taiga-ui/core";
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {DictManagerService} from '../../../../../data/service/dictionaries/dict.manager.service';
import {Router} from '@angular/router';
import {CreateEmployeeRequest} from '../../../../../data/models/dictionaries/requests/CreateEmployeeRequest';
import {EmployeeDto} from '../../../../../data/models/dictionaries/responses/EmployeeDto';
import {EmployeeFormComponent} from '../../components/employee-form/employee-form';

@Component({
    selector: 'app-create-employee-admin',
    imports: [
        BackHeader,
        EmployeeFormComponent
    ],
    templateUrl: './create-employee-admin.html',
    styleUrl: './create-employee-admin.css',
})
export class CreateEmployeeAdmin {
    private readonly _dictManager: DictManagerService = inject(DictManagerService);
    private readonly _router: Router = inject(Router);
    private readonly _destroyRef: DestroyRef = inject(DestroyRef);
    private readonly alerts: TuiAlertService = inject(TuiAlertService);

    protected goBack(): void {
        this._router.navigate(['admin/employees']);
    }

    protected onSave(request: CreateEmployeeRequest): void {
        this._dictManager.createEmployee(request).pipe(
            takeUntilDestroyed(this._destroyRef)
        ).subscribe({
            next: (response: EmployeeDto): void => {
                this.alerts
                    .open('<strong>Добавлен новый сотрудник</strong>', {
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
