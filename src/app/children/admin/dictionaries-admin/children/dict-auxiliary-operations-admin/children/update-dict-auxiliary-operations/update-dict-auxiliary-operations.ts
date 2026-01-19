import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {NgIf} from '@angular/common';
import {BackHeader} from '../../../../../../components/back-header/back-header';
import {
    AuxiliaryOperationFormComponent
} from '../../../../components/auxiliary-operation-form/auxiliary-operation-form';
import {Loader} from '../../../../../../components/loader/loader';
import {AuxiliaryOperationDto} from '../../../../../../../data/models/dictionaries/responses/AuxiliaryOperationDto';
import {DictManagerService} from '../../../../../../../data/service/dictionaries/dict.manager.service';
import {ActivatedRoute, Router} from '@angular/router';
import {TuiAlertService} from '@taiga-ui/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {
    CreateAuxiliaryOperationRequest
} from '../../../../../../../data/models/dictionaries/requests/CreateAuxiliaryOperationRequest';
import {
    UpdateAuxiliaryOperationRequest
} from '../../../../../../../data/models/dictionaries/requests/UpdateAuxiliaryOperationRequest';

@Component({
    selector: 'app-update-dict-auxiliary-operations',
    imports: [
        BackHeader,
        AuxiliaryOperationFormComponent,
        Loader,
        NgIf
    ],
    templateUrl: './update-dict-auxiliary-operations.html',
    styleUrl: './update-dict-auxiliary-operations.css',
})
export class UpdateDictAuxiliaryOperations implements OnInit {
    public isLoading: boolean = true;
    public operation: AuxiliaryOperationDto | undefined;
    private operationId: number | null = null;

    private readonly _dictManager: DictManagerService = inject(DictManagerService);
    private readonly _router: Router = inject(Router);
    private readonly _route: ActivatedRoute = inject(ActivatedRoute);
    private readonly _destroyRef: DestroyRef = inject(DestroyRef);
    private readonly alerts: TuiAlertService = inject(TuiAlertService);

    public ngOnInit(): void {
        this.operationId = Number(this._route.snapshot.paramMap.get('id'));

        if (!this.operationId) {
            this.goBack();
            return;
        }

        this._dictManager.getAuxiliaryOperations().pipe(
            takeUntilDestroyed(this._destroyRef)
        ).subscribe({
            next: (operations: AuxiliaryOperationDto[]): void => {
                this.operation = operations.find((op: AuxiliaryOperationDto): boolean => op.id === this.operationId);
                this.isLoading = false;

                if (!this.operation) {
                    this.alerts.open('Операция не найдена', {appearance: 'negative'}).subscribe();
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
        this._router.navigate(['admin/dictionaries/auxiliary-operations']);
    }

    protected onSave(request: CreateAuxiliaryOperationRequest): void {
        if (!this.operationId) {
            return;
        }

        const updateRequest: UpdateAuxiliaryOperationRequest = {
            name: request.name,
            durationInSeconds: request.durationInSeconds
        };

        this._dictManager.updateAuxiliaryOperation(this.operationId, updateRequest).pipe(
            takeUntilDestroyed(this._destroyRef)
        ).subscribe({
            next: (): void => {
                this.alerts
                    .open('<strong>Обновлена вспомогательная операция</strong>', {
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
