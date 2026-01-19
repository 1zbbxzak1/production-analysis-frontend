import {Component, DestroyRef, inject} from '@angular/core';
import {BackHeader} from "../../../../../../components/back-header/back-header";
import {TuiAlertService} from "@taiga-ui/core";
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {DictManagerService} from '../../../../../../../data/service/dictionaries/dict.manager.service';
import {Router} from '@angular/router';
import {CreateShiftRequest} from '../../../../../../../data/models/dictionaries/requests/CreateShiftRequest';
import {ShiftFormComponent} from '../../../../components/shift-form/shift-form';

@Component({
    selector: 'app-create-shift-admin',
    imports: [
        BackHeader,
        ShiftFormComponent
    ],
    templateUrl: './create-shift-admin.html',
    styleUrl: './create-shift-admin.css',
})
export class CreateShiftAdmin {
    private readonly _dictManager: DictManagerService = inject(DictManagerService);
    private readonly _router: Router = inject(Router);
    private readonly _destroyRef: DestroyRef = inject(DestroyRef);
    private readonly alerts: TuiAlertService = inject(TuiAlertService);

    protected goBack(): void {
        this._router.navigate(['admin/dictionaries/shifts']);
    }

    protected onSave(request: CreateShiftRequest): void {
        this._dictManager.createShift(request).pipe(
            takeUntilDestroyed(this._destroyRef)
        ).subscribe({
            next: (): void => {
                this.alerts
                    .open('<strong>Смена добавлена</strong>', {
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
