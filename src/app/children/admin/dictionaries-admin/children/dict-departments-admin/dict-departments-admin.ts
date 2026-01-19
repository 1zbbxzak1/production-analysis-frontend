import {ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject, OnInit} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {Router} from '@angular/router';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {finalize, forkJoin} from 'rxjs';
import {
    TuiAlertService,
    TuiButton,
    TuiDataList,
    TuiDropdown,
    TuiDropdownOpen,
    TuiDropdownOptionsDirective,
    TuiOption
} from '@taiga-ui/core';
import {TuiPagination} from '@taiga-ui/kit';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DictManagerService} from '../../../../../data/service/dictionaries/dict.manager.service';
import {DepartmentDto} from '../../../../../data/models/dictionaries/responses/DepartmentDto';
import {BackHeader} from '../../../../components/back-header/back-header';
import {EnterpriseDto} from '../../../../../data/models/dictionaries/responses/EnterpriseDto';

@Component({
    selector: 'app-dict-departments-admin',
    imports: [
        NgIf,
        NgForOf,
        BackHeader,
        TuiButton,
        TuiPagination,
        TuiDropdownOpen,
        TuiDropdownOptionsDirective,
        TuiOption,
        TuiDropdown,
        FormsModule,
        ReactiveFormsModule,
        TuiDataList,
    ],
    templateUrl: './dict-departments-admin.html',
    styleUrl: './dict-departments-admin.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DictDepartmentsAdmin implements OnInit {
    public isLoading: boolean = false;
    public items: DepartmentDto[] = [];
    public enterprises: Map<number, string> = new Map();
    public totalItems: number = 0;
    public currentPage: number = 0;
    public searchValue: string = '';
    public emptyMessage: string = 'Цехов пока нет';
    public emptyDescription: string = 'Вы пока не создали цеха.';

    protected hoveredItemId: number | null = null;
    protected isButtonHovered: boolean = false;
    protected readonly itemsPerPage: number = 10;

    private readonly _dictManager: DictManagerService = inject(DictManagerService);
    private readonly _router: Router = inject(Router);
    private readonly _destroyRef: DestroyRef = inject(DestroyRef);
    private readonly _cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
    private readonly alerts: TuiAlertService = inject(TuiAlertService);
    private filteredItems: DepartmentDto[] = [];

    protected get safeItems(): DepartmentDto[] {
        const startIndex: number = this.currentPage * this.itemsPerPage;
        return this.filteredItems.slice(startIndex, startIndex + this.itemsPerPage);
    }

    protected get totalPages(): number {
        return Math.ceil(this.totalItems / this.itemsPerPage);
    }

    protected get shouldShowPagination(): boolean {
        return this.totalItems > this.itemsPerPage;
    }

    public ngOnInit(): void {
        this.loadData();
    }

    protected onPageChange(page: number): void {
        this.currentPage = page;
    }

    protected goBack(): void {
        this._router.navigate(['admin/dictionaries']);
    }

    protected goCreate(): void {
        this._router.navigate(['admin/dictionaries/departments/create']);
    }

    protected goEdit(id: number): void {
        this._router.navigate([`admin/dictionaries/departments/edit/${id}`]);
    }

    protected deleteItem(id: number): void {
        this._dictManager.deleteDepartment(id).pipe(
            takeUntilDestroyed(this._destroyRef)
        ).subscribe((): void => {
            this.items = this.items.filter((item: DepartmentDto): boolean => item.id !== id);
            this.alerts.open('<strong>Подразделение удалено</strong>', {appearance: 'positive'}).subscribe();
            this.totalItems = this.items.length;
            this.updateFilteredItems();
            this._cdr.detectChanges();
        });
    }

    protected onButtonMouseEnter(itemId: number, event: MouseEvent): void {
        event.stopPropagation();
        this.isButtonHovered = true;
        this.hoveredItemId = itemId;
    }

    protected onButtonMouseLeave(event: MouseEvent): void {
        event.stopPropagation();
        this.isButtonHovered = false;
    }

    protected isItemHovered(itemId: number): boolean {
        return this.hoveredItemId === itemId;
    }

    protected shouldShowHoverImage(itemId: number): boolean {
        return this.isItemHovered(itemId) && this.isButtonHovered;
    }

    protected getEnterpriseName(id: number): string {
        return this.enterprises.get(id) || '-';
    }

    private loadData(): void {
        this.isLoading = true;
        forkJoin([
            this._dictManager.getDepartments(),
            this._dictManager.getEnterprises()
        ]).pipe(
            takeUntilDestroyed(this._destroyRef),
            finalize((): void => {
                this.isLoading = false;
                this._cdr.detectChanges();
            })
        ).subscribe(([departments, enterprises]: [DepartmentDto[], EnterpriseDto[]]): void => {
            this.items = departments;
            this.enterprises = new Map(enterprises.map((e: EnterpriseDto): [number, string] => [e.id, e.name || '']));
            this.totalItems = departments.length;
            this.updateFilteredItems();
        });
    }

    private updateFilteredItems(): void {
        if (!this.searchValue.trim()) {
            this.filteredItems = this.items;
        } else {
            const lowerSearch: string = this.searchValue.toLowerCase().trim();
            this.filteredItems = this.items.filter((item: DepartmentDto): boolean | undefined =>
                (item.name?.toLowerCase().includes(lowerSearch))
            );
        }
        this.totalItems = this.filteredItems.length;
    }
}
