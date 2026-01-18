import {
    ChangeDetectorRef,
    Component,
    DestroyRef,
    EventEmitter,
    inject,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges
} from '@angular/core';
import {FormShortDto} from '../../../data/models/forms/responses/FormShortDto';
import {Router} from '@angular/router';
import {SearchFormsService} from '../../../data/service/forms/search.forms.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {debounceTime} from 'rxjs';
import {PA_TYPE_DESCRIPTIONS} from '../../../data/models/forms/enums/PaTypeDescriptions';
import {Loader} from '../loader/loader';
import {NgForOf, NgIf} from '@angular/common';
import {TuiBadge, TuiPagination} from '@taiga-ui/kit';
import {
    TuiAlertService,
    TuiDataListComponent,
    TuiDropdown,
    TuiDropdownOpen,
    TuiDropdownOptionsDirective,
    TuiOption
} from '@taiga-ui/core';
import {FormsManagerService} from '../../../data/service/forms/forms.manager.service';
import {FormsCountService} from '../../../data/service/forms/forms.count.service';
import {PaTypeDto} from '../../../data/models/forms/enums/PaTypeDto';

@Component({
    selector: 'app-forms-table',
    imports: [
        Loader,
        NgIf,
        NgForOf,
        TuiPagination,
        TuiBadge,
        TuiDataListComponent,
        TuiDropdownOpen,
        TuiDropdownOptionsDirective,
        TuiOption,
        TuiDropdown
    ],
    templateUrl: './forms-table.html',
    styleUrl: './forms-table.css',
})
export class FormsTable implements OnInit, OnChanges {

    @Input()
    public isHead: boolean = false;
    @Input()
    public url: string = 'operator';
    @Input()
    public forms: FormShortDto[] = [];
    @Input()
    public isLoading: boolean = false;
    @Input()
    public navigateRoute: string = '';
    @Input()
    public emptyMessage: string = 'Форм пока нет';
    @Input()
    public emptyDescription: string = '';
    @Input()
    public totalItems: number = 0;
    @Input()
    public currentPage: number = 0;

    @Output()
    public pageChange: EventEmitter<number> = new EventEmitter<number>();

    protected filteredForms: FormShortDto[] = [];
    protected open: boolean = false;
    protected hoveredFormId: number | null = null;
    protected isButtonHovered: boolean = false;
    protected readonly itemsPerPage: number = 10;

    private readonly _router: Router = inject(Router);
    private readonly _formsManager: FormsManagerService = inject(FormsManagerService);
    private readonly _formsCountService: FormsCountService = inject(FormsCountService);
    private readonly _searchFormsService: SearchFormsService = inject(SearchFormsService);
    private readonly _destroyRef: DestroyRef = inject(DestroyRef);
    private readonly _cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
    private readonly alerts: TuiAlertService = inject(TuiAlertService);

    protected get safeFormItems(): FormShortDto[] {
        return this.filteredForms;
    }

    protected get totalPages(): number {
        return Math.ceil(this.totalItems / this.itemsPerPage);
    }

    protected get shouldShowPagination(): boolean {
        return this.totalItems > this.itemsPerPage;
    }

    public ngOnInit(): void {
        this._searchFormsService.searchValue$.pipe(
            takeUntilDestroyed(this._destroyRef),
            debounceTime(300)
        ).subscribe((searchValue: string): void => {
            this.applyFilter(searchValue);
        });
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes['forms'] || changes['currentPage']) {
            this.updateFilteredForms();
            this._cdr.detectChanges();
        }
    }

    protected onPageChange(page: number): void {
        this.pageChange.emit(page);
    }

    protected goToFormById(formId: number): void {
        const form: FormShortDto | undefined = this.forms.find((f: FormShortDto): boolean => f.id === formId);

        if (!form) {
            return; // Форма не найдена
        }

        if (form.paType === PaTypeDto.MultipleProductsWithCycleTime) {
            this._router.navigate([`${this.url}/${this.navigateRoute}/form-view-3`, formId]);
        } else {
            this._router.navigate([`${this.url}/${this.navigateRoute}/form-view`, formId]);
        }
    }

    protected onClick(): void {
        this.open = false;
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

    protected formatFullName(fullName: string | null): string {
        if (!fullName) {
            return '';
        }

        const parts: string[] = fullName.trim().split(/\s+/);

        if (parts.length === 0) {
            return '';
        }

        if (parts.length === 1) {
            return parts[0];
        }

        if (parts.length === 2) {
            return `${parts[0]} ${parts[1].charAt(0)}.`;
        }

        if (parts.length >= 3) {
            return `${parts[0]} ${parts[1].charAt(0)}.${parts[2].charAt(0)}.`;
        }

        return fullName;
    }

    protected onMouseEnter(formId: number): void {
        if (!this.isButtonHovered) {
            this.hoveredFormId = formId;
        }
    }

    protected onMouseLeave(): void {
        if (!this.isButtonHovered) {
            this.hoveredFormId = null;
        }
    }

    protected isFormHovered(formId: number): boolean {
        return this.hoveredFormId === formId;
    }

    protected onButtonMouseEnter(formId: number, event: MouseEvent): void {
        event.stopPropagation();
        this.isButtonHovered = true;
        this.hoveredFormId = formId;
    }

    protected onButtonMouseLeave(event: MouseEvent): void {
        event.stopPropagation();
        this.isButtonHovered = false;
        this.hoveredFormId = null;
    }

    protected shouldShowHoverImage(formId: number): boolean {
        return this.isFormHovered(formId) && this.isButtonHovered;
    }

    protected deleteForm(formId: number): void {
        this._formsManager.deleteForm(formId).pipe(
            takeUntilDestroyed(this._destroyRef),
        ).subscribe((): void => {
            this._formsCountService.notifyFormDeleted(formId);

            this.alerts
                .open('<strong>Форма удалена</strong>', {
                    appearance: 'positive',
                })
                .subscribe();

            this._cdr.detectChanges();
        })
    }

    private updateFilteredForms(): void {
        if (!this.forms || this.forms.length === 0) {
            this.filteredForms = [];
            return;
        }

        this.filteredForms = this.forms.filter((item: FormShortDto): boolean => item !== null) ?? [];
    }

    private applyFilter(searchValue: string): void {
        if (!this.forms || this.forms.length === 0) {
            this.filteredForms = [];
            return;
        }

        if (!searchValue.trim()) {
            this.filteredForms = this.forms.filter((item: FormShortDto): boolean => item !== null) ?? [];
        } else {
            const lowerSearch: string = searchValue.toLowerCase().trim();
            this.filteredForms = this.forms
                .filter((item: FormShortDto): boolean => item !== null)
                .filter((item: FormShortDto): boolean =>
                    this.matchesSearch(item, lowerSearch)
                ) ?? [];
        }

        this._cdr.detectChanges();
    }

    private matchesSearch(form: FormShortDto, search: string): boolean {
        const productName: string = form.productNames!.toLowerCase();
        const paType: string = this.getPaTypeDescription(form.paType).toLowerCase();

        return productName.includes(search) || paType.includes(search);
    }
}
