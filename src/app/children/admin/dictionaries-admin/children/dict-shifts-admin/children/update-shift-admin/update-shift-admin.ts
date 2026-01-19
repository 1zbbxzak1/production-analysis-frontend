import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {NgIf} from '@angular/common';
import {BackHeader} from '../../../../../../components/back-header/back-header';
import {ShiftFormComponent} from '../../../../components/shift-form/shift-form';
import {Loader} from '../../../../../../components/loader/loader';
import {ShiftDto} from '../../../../../../../data/models/dictionaries/responses/ShiftDto';
import {DictManagerService} from '../../../../../../../data/service/dictionaries/dict.manager.service';
import {ActivatedRoute, Router} from '@angular/router';
import {TuiAlertService} from '@taiga-ui/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {CreateShiftRequest} from '../../../../../../../data/models/dictionaries/requests/CreateShiftRequest';
import {UpdateShiftRequest} from '../../../../../../../data/models/dictionaries/requests/UpdateShiftRequest';

@Component({
    selector: 'app-update-shift-admin',
    imports: [
        BackHeader,
        ShiftFormComponent,
        Loader,
        NgIf
    ],
    templateUrl: './update-shift-admin.html',
    styleUrl: './update-shift-admin.css',
})
export class UpdateShiftAdmin implements OnInit {
    public isLoading: boolean = true;
    public shift: ShiftDto | undefined;
    private shiftId: number | null = null;

    private readonly _dictManager: DictManagerService = inject(DictManagerService);
    private readonly _router: Router = inject(Router);
    private readonly _route: ActivatedRoute = inject(ActivatedRoute);
    private readonly _destroyRef: DestroyRef = inject(DestroyRef);
    private readonly alerts: TuiAlertService = inject(TuiAlertService);

    public ngOnInit(): void {
        this.shiftId = Number(this._route.snapshot.paramMap.get('id'));

        if (!this.shiftId) {
            this.goBack();
            return;
        }

        this._dictManager.getShifts().pipe(
            takeUntilDestroyed(this._destroyRef)
        ).subscribe({
            next: (shifts: ShiftDto[]): void => {
                this.shift = shifts.find((s: ShiftDto): boolean => s.id === this.shiftId);
                this.isLoading = false;

                if (!this.shift) {
                    this.alerts.open('Смена не найдена', {appearance: 'negative'}).subscribe();
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
        this._router.navigate(['admin/dictionaries/shifts']);
    }

    protected onSave(request: CreateShiftRequest): void {
        if (!this.shiftId) {
            return;
        }

        const updateRequest: UpdateShiftRequest = {
            name: request.name,
            startTime: request.startTime
        };

        this._dictManager.updateShift(this.shiftId, updateRequest).pipe(
            takeUntilDestroyed(this._destroyRef)
        ).subscribe({
            next: (): void => {
                this.alerts
                    .open('<strong>Смена обновлена</strong>', {
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
