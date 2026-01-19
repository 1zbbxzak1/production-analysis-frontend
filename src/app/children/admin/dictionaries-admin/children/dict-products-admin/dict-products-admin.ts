import {ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject, OnInit} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {Router} from '@angular/router';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {finalize, forkJoin} from 'rxjs';
import {
    TuiAlertService,
    TuiButton,
    TuiDataListComponent,
    TuiDropdown,
    TuiDropdownOpen,
    TuiDropdownOptionsDirective,
    TuiOption
} from '@taiga-ui/core';
import {TuiPagination} from '@taiga-ui/kit';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DictManagerService} from '../../../../../data/service/dictionaries/dict.manager.service';
import {ProductDto} from '../../../../../data/models/dictionaries/responses/ProductDto';
import {BackHeader} from '../../../../components/back-header/back-header';

@Component({
    selector: 'app-dict-products-admin',
    imports: [
        NgIf,
        NgForOf,
        BackHeader,
        TuiButton,
        TuiPagination,
        TuiDataListComponent,
        TuiDropdownOpen,
        TuiDropdownOptionsDirective,
        TuiOption,
        TuiDropdown,
        FormsModule,
        ReactiveFormsModule,
    ],
    templateUrl: './dict-products-admin.html',
    styleUrl: './dict-products-admin.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DictProductsAdmin implements OnInit {
    public isLoading: boolean = false;
    public items: ProductDto[] = [];
    public enterprises: Map<number, string> = new Map();
    public totalItems: number = 0;
    public currentPage: number = 0;
    public searchValue: string = '';
    public emptyMessage: string = 'Продуктов пока нет';
    public emptyDescription: string = 'Вы пока не создали продукты.';

    protected hoveredItemId: number | null = null;
    protected isButtonHovered: boolean = false;
    protected readonly itemsPerPage: number = 10;

    private readonly _dictManager: DictManagerService = inject(DictManagerService);
    private readonly _router: Router = inject(Router);
    private readonly _destroyRef: DestroyRef = inject(DestroyRef);
    private readonly _cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
    private readonly alerts: TuiAlertService = inject(TuiAlertService);
    private filteredItems: ProductDto[] = [];

    protected get safeItems(): ProductDto[] {
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
        this._router.navigate(['admin/dictionaries/products/create']);
    }

    protected goEdit(id: number): void {
        this._router.navigate([`admin/dictionaries/products/edit/${id}`]);
    }

    protected deleteItem(id: number): void {
        this._dictManager.deleteProduct(id).pipe(
            takeUntilDestroyed(this._destroyRef)
        ).subscribe((): void => {
            this.items = this.items.filter((item: ProductDto): boolean => item.id !== id);
            this.alerts.open('<strong>Продукция удалена</strong>', {appearance: 'positive'}).subscribe();
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

    protected formatTactTime(time: string | null): string {
        if (!time) {
            return '-';
        }

        const parts: number[] = time.split(':').map(Number);
        if (parts.length !== 3) {
            return time;
        }

        const hours: number = parts[0];
        const minutes: number = parts[1];
        const seconds: number = parts[2];

        const result: string[] = [];

        if (hours > 0) {
            result.push(`${hours} ч`);
        }
        if (minutes > 0) {
            result.push(`${minutes} мин`);
        }
        if (seconds > 0) {
            result.push(`${seconds} сек`);
        }

        return result.length > 0 ? result.join(' ') : '0 сек';
    }

    private loadData(): void {
        this.isLoading = true;
        forkJoin([
            this._dictManager.getProducts(),
            this._dictManager.getEnterprises()
        ]).pipe(
            takeUntilDestroyed(this._destroyRef),
            finalize((): void => {
                this.isLoading = false;
                this._cdr.detectChanges();
            })
        ).subscribe(([products, enterprises]) => {
            this.items = products;
            this.enterprises = new Map(enterprises.map(e => [e.id, e.name || '']));
            this.totalItems = products.length;
            this.updateFilteredItems();
        });
    }

    private updateFilteredItems(): void {
        if (!this.searchValue.trim()) {
            this.filteredItems = this.items;
        } else {
            const lowerSearch: string = this.searchValue.toLowerCase().trim();
            this.filteredItems = this.items.filter((item: ProductDto): boolean | undefined =>
                (item.name?.toLowerCase().includes(lowerSearch))
            );
        }
        this.totalItems = this.filteredItems.length;
    }
}
