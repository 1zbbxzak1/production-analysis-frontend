import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {NgIf} from '@angular/common';
import {BackHeader} from '../../../../../../components/back-header/back-header';
import {
    DowntimeReasonGroupFormComponent
} from '../../../../components/downtime-reason-group-form/downtime-reason-group-form';
import {Loader} from '../../../../../../components/loader/loader';
import {DowntimeReasonGroupDto} from '../../../../../../../data/models/dictionaries/responses/DowntimeReasonGroupDto';
import {DictManagerService} from '../../../../../../../data/service/dictionaries/dict.manager.service';
import {ActivatedRoute, Router} from '@angular/router';
import {TuiAlertService} from '@taiga-ui/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {
    CreateDowntimeReasonGroupRequest
} from '../../../../../../../data/models/dictionaries/requests/CreateDowntimeReasonGroupRequest';
import {
    UpdateDowntimeReasonGroupRequest
} from '../../../../../../../data/models/dictionaries/requests/UpdateDowntimeReasonGroupRequest';

@Component({
    selector: 'app-update-downtime-reason-group-admin',
    imports: [
        BackHeader,
        DowntimeReasonGroupFormComponent,
        Loader,
        NgIf
    ],
    templateUrl: './update-downtime-reason-group-admin.html',
    styleUrl: './update-downtime-reason-group-admin.css',
})
export class UpdateDowntimeReasonGroupAdmin implements OnInit {
    public isLoading: boolean = true;
    public group: DowntimeReasonGroupDto | undefined;
    private groupId: number | null = null;

    private readonly _dictManager: DictManagerService = inject(DictManagerService);
    private readonly _router: Router = inject(Router);
    private readonly _route: ActivatedRoute = inject(ActivatedRoute);
    private readonly _destroyRef: DestroyRef = inject(DestroyRef);
    private readonly alerts: TuiAlertService = inject(TuiAlertService);

    public ngOnInit(): void {
        this.groupId = Number(this._route.snapshot.paramMap.get('id'));

        if (!this.groupId) {
            this.goBack();
            return;
        }

        this._dictManager.getDowntimeReasonGroups().pipe(
            takeUntilDestroyed(this._destroyRef)
        ).subscribe({
            next: (groups: DowntimeReasonGroupDto[]): void => {
                this.group = groups.find((g: DowntimeReasonGroupDto): boolean => g.id === this.groupId);
                this.isLoading = false;

                if (!this.group) {
                    this.alerts.open('Группа не найдена', {appearance: 'negative'}).subscribe();
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
        this._router.navigate(['admin/dictionaries/downtime-reason-groups']);
    }

    protected onSave(request: CreateDowntimeReasonGroupRequest): void {
        if (!this.groupId) {
            return;
        }

        const updateRequest: UpdateDowntimeReasonGroupRequest = {
            name: request.name,
            description: request.description
        };

        this._dictManager.updateDowntimeReasonGroup(this.groupId, updateRequest).pipe(
            takeUntilDestroyed(this._destroyRef)
        ).subscribe({
            next: (): void => {
                this.alerts
                    .open('<strong>Обновлена группа причин</strong>', {
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
