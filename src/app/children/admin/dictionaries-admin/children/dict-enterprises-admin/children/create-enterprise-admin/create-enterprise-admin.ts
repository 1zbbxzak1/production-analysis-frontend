import {Component, DestroyRef, inject} from '@angular/core';
import {BackHeader} from "../../../../../../components/back-header/back-header";
import {TuiAlertService} from "@taiga-ui/core";
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {DictManagerService} from '../../../../../../../data/service/dictionaries/dict.manager.service';
import {Router} from '@angular/router';
import {CreateEnterpriseRequest} from '../../../../../../../data/models/dictionaries/requests/CreateEnterpriseRequest';
import {EnterpriseFormComponent} from '../../../../components/enterprise-form/enterprise-form';

@Component({
    selector: 'app-create-enterprise-admin',
    imports: [
        BackHeader,
        EnterpriseFormComponent
    ],
    templateUrl: './create-enterprise-admin.html',
    styleUrl: './create-enterprise-admin.css',
})
export class CreateEnterpriseAdmin {
    private readonly _dictManager: DictManagerService = inject(DictManagerService);
    private readonly _router: Router = inject(Router);
    private readonly _destroyRef: DestroyRef = inject(DestroyRef);
    private readonly alerts: TuiAlertService = inject(TuiAlertService);

    protected goBack(): void {
        this._router.navigate(['admin/dictionaries/enterprises']);
    }

    protected onSave(request: CreateEnterpriseRequest): void {
        this._dictManager.createEnterprise(request).pipe(
            takeUntilDestroyed(this._destroyRef)
        ).subscribe({
            next: (): void => {
                this.alerts
                    .open('<strong>Предприятие добавлено</strong>', {
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
