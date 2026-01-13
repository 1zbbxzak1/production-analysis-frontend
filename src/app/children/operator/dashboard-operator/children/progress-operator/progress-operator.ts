import {ChangeDetectorRef, Component, DestroyRef, inject, OnInit} from '@angular/core';
import {FormsManagerService} from '../../../../../data/service/forms/forms.manager.service';
import {Router} from '@angular/router';
import {SearchFormsFilterDto} from '../../../../../data/models/forms/requests/SearchFormsFilterDto';
import {AuthManagerService} from '../../../../../data/service/auth/auth.manager.service';
import {FormStatus} from '../../../../../data/models/forms/enums/FormStatus';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormShortDtoPaginatedResponse} from '../../../../../data/models/forms/responses/FormShortDtoPaginatedResponse';
import {NgForOf, NgIf} from '@angular/common';
import {PA_TYPE_DESCRIPTIONS} from '../../../../../data/models/forms/enums/PaTypeDescriptions';
import {FormShortDto} from '../../../../../data/models/forms/responses/FormShortDto';
import {TuiBlockStatus} from '@taiga-ui/layout';
import {LoaderService} from '../../../../../data/service/loader/loader.service';
import {Loader} from '../../../../components/loader/loader';
import {FormsCountService} from '../../../../../data/service/forms/forms.count.service';
import {SearchFormsService} from '../../../../../data/service/forms/search.forms.service';
import {debounceTime} from 'rxjs';

@Component({
    selector: 'app-progress-operator',
    imports: [
        NgForOf,
        TuiBlockStatus,
        NgIf,
        Loader,
    ],
    templateUrl: './progress-operator.html',
    styleUrl: './progress-operator.css',
})
export class ProgressOperator implements OnInit {
    protected forms: FormShortDtoPaginatedResponse | null = null;
    protected filteredForms: FormShortDto[] = [];
    protected isLoading: boolean = false;

    private departmentId: number | null = null;
    private readonly _authManager: AuthManagerService = inject(AuthManagerService);
    private readonly _formsManager: FormsManagerService = inject(FormsManagerService);
    private readonly _destroyRef: DestroyRef = inject(DestroyRef);
    private readonly _cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
    private readonly _router: Router = inject(Router);
    private readonly _loaderService: LoaderService = inject(LoaderService);
    private readonly _searchFormsService: SearchFormsService = inject(SearchFormsService);
    private readonly _formsCountService: FormsCountService = inject(FormsCountService);

    protected get allFormItems(): FormShortDto[] {
        return this.forms?.items?.filter((item: FormShortDto): item is FormShortDto => item !== null) ?? [];
    }

    protected get safeFormItems(): FormShortDto[] {
        return this.filteredForms;
    }

    public ngOnInit(): void {
        this._loaderService.loading$.pipe(
            takeUntilDestroyed(this._destroyRef)
        ).subscribe((isLoading: boolean): void => {
            this.isLoading = isLoading;
        });

        this.waitForDepartmentIdAndLoadForms();

        this._searchFormsService.searchValue$.pipe(
            takeUntilDestroyed(this._destroyRef),
            debounceTime(300)
        ).subscribe((searchValue: string): void => {
            this.applyFilter(searchValue);
        });
    }

    protected goToFormById(formId: number): void {
        this._router.navigate(['operator/progress-list/form-view', formId]);
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

    private applyFilter(searchValue: string): void {
        if (!this.forms?.items) {
            this.filteredForms = [];
            return;
        }

        if (!searchValue.trim()) {
            this.filteredForms = this.forms.items.filter((item: FormShortDto): boolean => item !== null) ?? [];
        } else {
            const lowerSearch: string = searchValue.toLowerCase().trim();
            this.filteredForms = this.forms.items
                ?.filter((item: FormShortDto): boolean => item !== null)
                ?.filter((item: FormShortDto): boolean =>
                    this.matchesSearch(item, lowerSearch)
                ) ?? [];
        }

        this._cdr.detectChanges();
    }

    private matchesSearch(form: FormShortDto, search: string): boolean {
        const productName: string = form.productNames!.toLowerCase();

        // Поле 4: Тип ПА
        const paType: string = this.getPaTypeDescription(form.paType).toLowerCase();

        return productName.includes(search) || paType.includes(search);
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
            status: FormStatus.InProgress,
            pageNumber: 1,
            pageSize: 100,
        }

        this._formsManager.searchForms(req).pipe(
            takeUntilDestroyed(this._destroyRef)
        ).subscribe((formsInfo: FormShortDtoPaginatedResponse): void => {
            this.forms = formsInfo;

            const formsCount: number = this.allFormItems.length;
            this._formsCountService.setProgressFormsCount(formsCount);

            this._cdr.detectChanges();

            setTimeout((): void => {
                this._loaderService.hide();
            }, 300);
        })
    }
}
