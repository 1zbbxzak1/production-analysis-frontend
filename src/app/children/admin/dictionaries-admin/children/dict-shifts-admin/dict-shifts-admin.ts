import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import {
    TuiAlertService,
    TuiButton,
    TuiDataListComponent,
    TuiDropdown,
    TuiDropdownOpen,
    TuiDropdownOptionsDirective,
    TuiOption
} from '@taiga-ui/core';
import { TuiPagination } from '@taiga-ui/kit';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DictManagerService } from '../../../../../data/service/dictionaries/dict.manager.service';
import { ShiftDto } from '../../../../../data/models/dictionaries/responses/ShiftDto';
import { BackHeader } from '../../../../components/back-header/back-header';

@Component({
    selector: 'app-dict-shifts-admin',
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
    templateUrl: './dict-shifts-admin.html',
    styleUrl: './dict-shifts-admin.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DictShiftsAdmin implements OnInit {
    public isLoading: boolean = false;
    public items: ShiftDto[] = [];
    public totalItems: number = 0;
    public currentPage: number = 0;
    public searchValue: string = '';
    public emptyMessage: string = 'Смен пока нет';
    public emptyDescription: string = 'Вы пока не создали смены.';

    protected hoveredItemId: number | null = null;
    protected isButtonHovered: boolean = false;
    protected readonly itemsPerPage: number = 10;

    private readonly _dictManager: DictManagerService = inject(DictManagerService);
    private readonly _router: Router = inject(Router);
    private readonly _destroyRef: DestroyRef = inject(DestroyRef);
    private readonly _cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
    private readonly alerts: TuiAlertService = inject(TuiAlertService);
    private filteredItems: ShiftDto[] = [];

    protected get safeItems(): ShiftDto[] {
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
        this._router.navigate(['admin/dictionaries/shifts/create']);
    }

    protected goEdit(id: number): void {
        this._router.navigate([`admin/dictionaries/shifts/edit/${id}`]);
    }

    protected deleteItem(id: number): void {
        this._dictManager.deleteShift(id).pipe(
            takeUntilDestroyed(this._destroyRef)
        ).subscribe((): void => {
            this.items = this.items.filter((item: ShiftDto): boolean => item.id !== id);
            this.alerts.open('<strong>Смена удалена</strong>', { appearance: 'positive' }).subscribe();
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

    protected formatTime(time: string | undefined): string {
        if (!time) {
            return '-';
        }
        const parts = time.split(':');
        if (parts.length >= 2) {
            return `${parts[0]}:${parts[1]}`;
        }
        return time;
    }

    protected calculateEndTime(startTime: string | undefined): string {
        if (!startTime) {
            return '-';
        }
        const parts = startTime.split(':');
        if (parts.length < 2) {
            return '-';
        }

        let hours = Number(parts[0]);
        const minutes = parts[1];

        hours = (hours + 8) % 24;

        const formattedHours = hours.toString().padStart(2, '0');
        return `${formattedHours}:${minutes}`;
    }

    private loadData(): void {
        this.isLoading = true;
        this._dictManager.getShifts().pipe(
            takeUntilDestroyed(this._destroyRef),
            finalize((): void => {
                this.isLoading = false;
                this._cdr.detectChanges();
            })
        ).subscribe((items: ShiftDto[]) => {
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
            this.filteredItems = this.items.filter((item: ShiftDto): boolean | undefined =>
                (item.name?.toLowerCase().includes(lowerSearch))
            );
        }
        this.totalItems = this.filteredItems.length;
    }
}
