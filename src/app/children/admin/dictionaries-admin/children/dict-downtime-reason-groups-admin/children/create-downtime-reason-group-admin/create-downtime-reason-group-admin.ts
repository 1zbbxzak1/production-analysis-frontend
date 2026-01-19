import {Component, DestroyRef, inject} from '@angular/core';
import {BackHeader} from '../../../../../../components/back-header/back-header';
import {
    DowntimeReasonGroupFormComponent
} from '../../../../components/downtime-reason-group-form/downtime-reason-group-form';
import {DictManagerService} from '../../../../../../../data/service/dictionaries/dict.manager.service';
import {Router} from '@angular/router';
import {TuiAlertService} from '@taiga-ui/core';
import {
    CreateDowntimeReasonGroupRequest
} from '../../../../../../../data/models/dictionaries/requests/CreateDowntimeReasonGroupRequest';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-create-downtime-reason-group-admin',
    imports: [
        BackHeader,
        DowntimeReasonGroupFormComponent
    ],
    templateUrl: './create-downtime-reason-group-admin.html',
    styleUrl: './create-downtime-reason-group-admin.css',
})
export class CreateDowntimeReasonGroupAdmin {
    private readonly _dictManager: DictManagerService = inject(DictManagerService);
    private readonly _router: Router = inject(Router);
    private readonly _destroyRef: DestroyRef = inject(DestroyRef);
    private readonly alerts: TuiAlertService = inject(TuiAlertService);

    protected goBack(): void {
        this._router.navigate(['admin/dictionaries/downtime-reason-groups']);
    }

    protected onSave(request: CreateDowntimeReasonGroupRequest): void {
        this._dictManager.createDowntimeReasonGroup(request).pipe(
            takeUntilDestroyed(this._destroyRef)
        ).subscribe({
            next: (): void => {
                this.alerts
                    .open('<strong>Добавлена группа причин</strong>', {
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
