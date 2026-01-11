import {ChangeDetectorRef, Component, DestroyRef, inject, OnInit} from '@angular/core';
import {FormShortDtoPaginatedResponse} from '../../../../../data/models/forms/responses/FormShortDtoPaginatedResponse';
import {AuthManagerService} from '../../../../../data/service/auth/auth.manager.service';
import {FormsManagerService} from '../../../../../data/service/forms/forms.manager.service';
import {Router} from '@angular/router';
import {LoaderService} from '../../../../../data/service/loader/loader.service';
import {FormShortDto} from '../../../../../data/models/forms/responses/FormShortDto';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {PA_TYPE_DESCRIPTIONS} from '../../../../../data/models/forms/enums/PaTypeDescriptions';
import {SearchFormsFilterDto} from '../../../../../data/models/forms/requests/SearchFormsFilterDto';
import {FormStatus} from '../../../../../data/models/forms/enums/FormStatus';
import {Loader} from '../../../../components/loader/loader';
import {NgForOf, NgIf} from '@angular/common';
import {TuiBlockStatus} from '@taiga-ui/layout';

@Component({
    selector: 'app-complete-operator',
    imports: [
        NgForOf,
        TuiBlockStatus,
        NgIf,
        Loader,
    ],
    templateUrl: './complete-operator.html',
    styleUrl: './complete-operator.css',
})
export class CompleteOperator implements OnInit {
    protected forms: FormShortDtoPaginatedResponse | null = null;
    protected isLoading: boolean = false;

    private departmentId: number | null = null;
    private readonly _authManager: AuthManagerService = inject(AuthManagerService);
    private readonly _formsManager: FormsManagerService = inject(FormsManagerService);
    private readonly _destroyRef: DestroyRef = inject(DestroyRef);
    private readonly _cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
    private readonly _router: Router = inject(Router);
    private readonly _loaderService: LoaderService = inject(LoaderService);

    protected get safeFormItems(): FormShortDto[] {
        return this.forms?.items?.filter((item: FormShortDto): item is FormShortDto => item !== null) ?? [];
    }

    public ngOnInit(): void {
        this._loaderService.loading$.pipe(
            takeUntilDestroyed(this._destroyRef)
        ).subscribe((isLoading: boolean): void => {
            this.isLoading = isLoading;
        });

        this.waitForDepartmentIdAndLoadForms();
    }

    protected goToFormById(formId: number): void {
        this._router.navigate(['operator/completed-list/form-view', formId]);
    }

    protected formatDate(dateString: string): string {
        if (!dateString) {
            return '';
        }

        try {
            const date = new Date(dateString);
            const day: string = String(date.getDate()).padStart(2, '0');
            const month: string = String(date.getMonth() + 1).padStart(2, '0');
            const year: number = date.getFullYear();

            return `${day}.${month}.${year}`;
        } catch (error) {
            return dateString;
        }
    }

    protected getPaTypeDescription(paType: number): string {
        return PA_TYPE_DESCRIPTIONS[paType] || 'Неизвестный тип';
    }

    private waitForDepartmentIdAndLoadForms(): void {
        let attempts: number = 0;
        const maxAttempts = 50;

        const checkAndLoadForms = (): void => {
            const departmentIdStr: string | null = this._authManager.getDepartmentId();

            if (departmentIdStr) {
                this.departmentId = parseInt(departmentIdStr, 10);
                this.searchForms();
            } else if (attempts < maxAttempts) {
                attempts++;
                setTimeout(checkAndLoadForms, 100);
            } else {
                this._loaderService.hide();
            }
        };

        checkAndLoadForms();
    }

    private searchForms(): void {
        if (!this.departmentId) {
            this._loaderService.hide();
            return;
        }

        this._loaderService.show();

        const req: SearchFormsFilterDto = {
            departmentId: this.departmentId,
            status: FormStatus.Completed,
            pageNumber: 1,
            pageSize: 100,
        }

        this._formsManager.searchForms(req).pipe(
            takeUntilDestroyed(this._destroyRef)
        ).subscribe((formsInfo: FormShortDtoPaginatedResponse): void => {
            this.forms = formsInfo;

            this._cdr.detectChanges();

            setTimeout((): void => {
                this._loaderService.hide();
            }, 100);
        })
    }
}
