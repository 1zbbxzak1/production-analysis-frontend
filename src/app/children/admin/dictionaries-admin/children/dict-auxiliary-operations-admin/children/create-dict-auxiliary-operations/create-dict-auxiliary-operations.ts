import {Component, DestroyRef, inject} from '@angular/core';
import {BackHeader} from '../../../../../../components/back-header/back-header';
import {
    AuxiliaryOperationFormComponent
} from '../../../../components/auxiliary-operation-form/auxiliary-operation-form';
import {DictManagerService} from '../../../../../../../data/service/dictionaries/dict.manager.service';
import {Router} from '@angular/router';
import {TuiAlertService} from '@taiga-ui/core';
import {
    CreateAuxiliaryOperationRequest
} from '../../../../../../../data/models/dictionaries/requests/CreateAuxiliaryOperationRequest';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-create-dict-auxiliary-operations',
    imports: [
        BackHeader,
        AuxiliaryOperationFormComponent
    ],
    templateUrl: './create-dict-auxiliary-operations.html',
    styleUrl: './create-dict-auxiliary-operations.css',
})
export class CreateDictAuxiliaryOperations {
    private readonly _dictManager: DictManagerService = inject(DictManagerService);
    private readonly _router: Router = inject(Router);
    private readonly _destroyRef: DestroyRef = inject(DestroyRef);
    private readonly alerts: TuiAlertService = inject(TuiAlertService);

    protected goBack(): void {
        this._router.navigate(['admin/dictionaries/auxiliary-operations']);
    }

    protected onSave(request: CreateAuxiliaryOperationRequest): void {
        this._dictManager.createAuxiliaryOperation(request).pipe(
            takeUntilDestroyed(this._destroyRef)
        ).subscribe({
            next: (): void => {
                this.alerts
                    .open('<strong>Добавлено время работы</strong>', {
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
