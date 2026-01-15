import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {FormShortDto} from '../../../../../data/models/forms/responses/FormShortDto';
import {AuthManagerService} from '../../../../../data/service/auth/auth.manager.service';
import {FormsManagerService} from '../../../../../data/service/forms/forms.manager.service';
import {LoaderService} from '../../../../../data/service/loader/loader.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {SearchFormsFilterDto} from '../../../../../data/models/forms/requests/SearchFormsFilterDto';
import {FormShortDtoPaginatedResponse} from '../../../../../data/models/forms/responses/FormShortDtoPaginatedResponse';
import {FormStatus} from '../../../../../data/models/forms/enums/FormStatus';
import {FormsTable} from '../../../../components/forms-table/forms-table';

@Component({
    selector: 'app-progress-forms-head',
    imports: [
        FormsTable
    ],
    templateUrl: './progress-forms-head.html',
    styleUrl: './progress-forms-head.css',
})
export class ProgressFormsHead implements OnInit {
    protected forms: FormShortDto[] = [];
    protected isLoading: boolean = false;

    protected totalItems: number = 0;
    protected currentPage: number = 1;
    protected pageSize: number = 10;

    private departmentId: number | null = null;
    private readonly _authManager: AuthManagerService = inject(AuthManagerService);
    private readonly _formsManager: FormsManagerService = inject(FormsManagerService);
    private readonly _destroyRef: DestroyRef = inject(DestroyRef);
    private readonly _loaderService: LoaderService = inject(LoaderService);

    public ngOnInit(): void {
        this._loaderService.loading$.pipe(
            takeUntilDestroyed(this._destroyRef)
        ).subscribe((isLoading: boolean): void => {
            this.isLoading = isLoading;
        });

        this.waitForDepartmentIdAndLoadForms();
    }

    protected onPageChange(page: number): void {
        this.currentPage = page + 1;
        this.searchForms();
    }

    private waitForDepartmentIdAndLoadForms(): void {
        let attempts: number = 0;
        const maxAttempts = 50;

        const checkAndLoadForms: () => void = (): void => {
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
            departmentId: null,
            status: FormStatus.InProgress,
            pageNumber: this.currentPage,
            pageSize: this.pageSize,
        };

        this._formsManager.searchForms(req).pipe(
            takeUntilDestroyed(this._destroyRef)
        ).subscribe((formsInfo: FormShortDtoPaginatedResponse): void => {
            this.forms = formsInfo.items ?? [];

            this.totalItems = formsInfo.totalCount ?? 0;

            setTimeout((): void => {
                this._loaderService.hide();
            }, 300);
        });
    }
}
