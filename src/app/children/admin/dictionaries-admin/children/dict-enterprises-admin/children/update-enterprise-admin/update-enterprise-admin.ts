import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {NgIf} from '@angular/common';
import {BackHeader} from '../../../../../../components/back-header/back-header';
import {EnterpriseFormComponent} from '../../../../components/enterprise-form/enterprise-form';
import {Loader} from '../../../../../../components/loader/loader';
import {EnterpriseDto} from '../../../../../../../data/models/dictionaries/responses/EnterpriseDto';
import {DictManagerService} from '../../../../../../../data/service/dictionaries/dict.manager.service';
import {ActivatedRoute, Router} from '@angular/router';
import {TuiAlertService} from '@taiga-ui/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {CreateEnterpriseRequest} from '../../../../../../../data/models/dictionaries/requests/CreateEnterpriseRequest';
import {UpdateEnterpriseRequest} from '../../../../../../../data/models/dictionaries/requests/UpdateEnterpriseRequest';

@Component({
    selector: 'app-update-enterprise-admin',
    imports: [
        BackHeader,
        EnterpriseFormComponent,
        Loader,
        NgIf
    ],
    templateUrl: './update-enterprise-admin.html',
    styleUrl: './update-enterprise-admin.css',
})
export class UpdateEnterpriseAdmin implements OnInit {
    public isLoading: boolean = true;
    public enterprise: EnterpriseDto | undefined;
    private enterpriseId: number | null = null;

    private readonly _dictManager: DictManagerService = inject(DictManagerService);
    private readonly _router: Router = inject(Router);
    private readonly _route: ActivatedRoute = inject(ActivatedRoute);
    private readonly _destroyRef: DestroyRef = inject(DestroyRef);
    private readonly alerts: TuiAlertService = inject(TuiAlertService);

    public ngOnInit(): void {
        this.enterpriseId = Number(this._route.snapshot.paramMap.get('id'));

        if (!this.enterpriseId) {
            this.goBack();
            return;
        }

        this._dictManager.getEnterprises().pipe(
            takeUntilDestroyed(this._destroyRef)
        ).subscribe({
            next: (enterprises: EnterpriseDto[]): void => {
                this.enterprise = enterprises.find((e: EnterpriseDto): boolean => e.id === this.enterpriseId);
                this.isLoading = false;

                if (!this.enterprise) {
                    this.alerts.open('Предприятие не найдено', {appearance: 'negative'}).subscribe();
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
        this._router.navigate(['admin/dictionaries/enterprises']);
    }

    protected onSave(request: CreateEnterpriseRequest): void {
        if (!this.enterpriseId) {
            return;
        }

        const updateRequest: UpdateEnterpriseRequest = {
            name: request.name,
        };

        this._dictManager.updateEnterprise(this.enterpriseId, updateRequest).pipe(
            takeUntilDestroyed(this._destroyRef)
        ).subscribe({
            next: (): void => {
                this.alerts
                    .open('<strong>Предприятие обновлено</strong>', {
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
