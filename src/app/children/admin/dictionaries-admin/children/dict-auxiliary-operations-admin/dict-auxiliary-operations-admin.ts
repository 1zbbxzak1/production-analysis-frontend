import {ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject, OnInit} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {Router} from '@angular/router';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {finalize} from 'rxjs';
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
import {AuxiliaryOperationDto} from '../../../../../data/models/dictionaries/responses/AuxiliaryOperationDto';
import {BackHeader} from '../../../../components/back-header/back-header';

@Component({
    selector: 'app-dict-auxiliary-operations-admin',
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
    templateUrl: './dict-auxiliary-operations-admin.html',
    styleUrl: './dict-auxiliary-operations-admin.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DictAuxiliaryOperationsAdmin implements OnInit {
    public isLoading: boolean = false;
    public items: AuxiliaryOperationDto[] = [];
    public totalItems: number = 0;
    public currentPage: number = 0;
    public searchValue: string = '';
    public emptyMessage: string = 'Вспомогательных операций пока нет';
    public emptyDescription: string = 'Вы пока не создали вспомогательные операции.';

    protected hoveredItemId: number | null = null;
    protected isButtonHovered: boolean = false;
    protected readonly itemsPerPage: number = 10;

    private readonly _dictManager: DictManagerService = inject(DictManagerService);
    private readonly _router: Router = inject(Router);
    private readonly _destroyRef: DestroyRef = inject(DestroyRef);
    private readonly _cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
    private readonly alerts: TuiAlertService = inject(TuiAlertService);
    private filteredItems: AuxiliaryOperationDto[] = [];

    protected get safeItems(): AuxiliaryOperationDto[] {
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
        this._router.navigate(['admin/dictionaries/auxiliary-operations/create']);
    }

    protected goEdit(id: number): void {
        this._router.navigate([`admin/dictionaries/auxiliary-operations/edit/${id}`]);
    }

    protected deleteItem(id: number): void {
        this._dictManager.deleteAuxiliaryOperation(id).pipe(
            takeUntilDestroyed(this._destroyRef)
        ).subscribe((): void => {
            this.items = this.items.filter((item: AuxiliaryOperationDto): boolean => item.id !== id);
            this.alerts.open('<strong>Время работы удалено</strong>', {appearance: 'positive'}).subscribe();
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

    protected formatDuration(time: string | null): string {
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
        this._dictManager.getAuxiliaryOperations().pipe(
            takeUntilDestroyed(this._destroyRef),
            finalize((): void => {
                this.isLoading = false;
                this._cdr.detectChanges();
            })
        ).subscribe((items: AuxiliaryOperationDto[]): void => {
            this.items = items;
            this.totalItems = items.length;
            this.updateFilteredItems();
        });
    }

    private updateFilteredItems(): void {
        if (!this.searchValue.trim()) {
            this.filteredItems = this.items;
        } else {
            const lowerSearch: string = this.searchValue.toLowerCase().trim();
            this.filteredItems = this.items.filter((item: AuxiliaryOperationDto): boolean | undefined =>
                (item.name?.toLowerCase().includes(lowerSearch)) ||
                (item.duration?.toLowerCase().includes(lowerSearch))
            );
        }
        this.totalItems = this.filteredItems.length;
    }
}
