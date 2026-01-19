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
import {DowntimeReasonGroupDto} from '../../../../../data/models/dictionaries/responses/DowntimeReasonGroupDto';
import {BackHeader} from '../../../../components/back-header/back-header';

@Component({
    selector: 'app-dict-downtime-reason-groups-admin',
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
    templateUrl: './dict-downtime-reason-groups-admin.html',
    styleUrl: './dict-downtime-reason-groups-admin.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DictDowntimeReasonGroupsAdmin implements OnInit {
    public isLoading: boolean = false;
    public items: DowntimeReasonGroupDto[] = [];
    public totalItems: number = 0;
    public currentPage: number = 0;
    public searchValue: string = '';
    public emptyMessage: string = 'Групп причин пока нет';
    public emptyDescription: string = 'Вы пока не создали группы причин простоев.';

    protected hoveredItemId: number | null = null;
    protected isButtonHovered: boolean = false;
    protected readonly itemsPerPage: number = 10;

    private readonly _dictManager: DictManagerService = inject(DictManagerService);
    private readonly _router: Router = inject(Router);
    private readonly _destroyRef: DestroyRef = inject(DestroyRef);
    private readonly _cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
    private readonly alerts: TuiAlertService = inject(TuiAlertService);
    private filteredItems: DowntimeReasonGroupDto[] = [];

    protected get safeItems(): DowntimeReasonGroupDto[] {
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
        this._router.navigate(['admin/dictionaries/downtime-reason-groups/create']);
    }

    protected goEdit(id: number): void {
        this._router.navigate([`admin/dictionaries/downtime-reason-groups/edit/${id}`]);
    }

    protected deleteItem(id: number): void {
        this._dictManager.deleteDowntimeReasonGroup(id).pipe(
            takeUntilDestroyed(this._destroyRef)
        ).subscribe((): void => {
            this.items = this.items.filter((item: DowntimeReasonGroupDto): boolean => item.id !== id);
            this.alerts.open('<strong>Группа причин удалена</strong>', {appearance: 'positive'}).subscribe();
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

    protected onRowMouseEnter(itemId: number): void {
        if (!this.isButtonHovered) {
            this.hoveredItemId = itemId;
        }
    }

    protected onRowMouseLeave(): void {
        this.hoveredItemId = null;
    }

    protected isItemHovered(itemId: number): boolean {
        return this.hoveredItemId === itemId;
    }

    protected shouldShowHoverImage(itemId: number): boolean {
        return this.isItemHovered(itemId) && this.isButtonHovered;
    }

    private loadData(): void {
        this.isLoading = true;
        this._dictManager.getDowntimeReasonGroups().pipe(
            takeUntilDestroyed(this._destroyRef),
            finalize((): void => {
                this.isLoading = false;
                this._cdr.detectChanges();
            })
        ).subscribe((items: DowntimeReasonGroupDto[]): void => {
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
            this.filteredItems = this.items.filter((item: DowntimeReasonGroupDto): boolean | undefined =>
                (item.name?.toLowerCase().includes(lowerSearch)) ||
                (item.description?.toLowerCase().includes(lowerSearch))
            );
        }
        this.totalItems = this.filteredItems.length;
    }
}
