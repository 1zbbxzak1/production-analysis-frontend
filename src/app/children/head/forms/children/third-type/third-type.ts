import {ChangeDetectorRef, Component, DestroyRef, inject, OnInit} from '@angular/core';
import {BackHeader} from "../components/back-header/back-header";
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TuiButton, TuiTextfield} from "@taiga-ui/core";
import {TuiComboBoxModule, TuiTextfieldControllerModule} from "@taiga-ui/legacy";
import {TuiDataListWrapper, TuiFilterByInputPipe, TuiInputDate, TuiStringifyContentPipe} from "@taiga-ui/kit";
import {TuiDay} from '@taiga-ui/cdk';
import {Router} from '@angular/router';
import {NgForOf, NgIf} from '@angular/common';
import {ProductDto} from '../../../../../data/models/dictionaries/responses/ProductDto';
import {EmployeeDto} from '../../../../../data/models/dictionaries/responses/EmployeeDto';
import {ShiftDto} from '../../../../../data/models/dictionaries/responses/ShiftDto';
import {DictManagerService} from '../../../../../data/service/dictionaries/dict.manager.service';
import {FormsManagerService} from '../../../../../data/service/forms/forms.manager.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {CreateFormRequest} from '../../../../../data/models/forms/requests/CreateFormRequest';
import {PaTypeDto} from '../../../../../data/models/forms/enums/PaTypeDto';
import {FormShortDto} from '../../../../../data/models/forms/responses/FormShortDto';
import {ProductContextDto} from '../../../../../data/models/forms/ProductContextDto';


interface TableItem {
    product: FormControl<ProductDto | null>;
    cycleTime: FormControl<number | null>;
    dailyPace: FormControl<number | null>;
}

@Component({
    selector: 'app-third-type',
    imports: [
        BackHeader,
        TuiDataListWrapper,
        TuiComboBoxModule,
        ReactiveFormsModule,
        TuiTextfieldControllerModule,
        TuiStringifyContentPipe,
        TuiFilterByInputPipe,
        TuiTextfield,
        TuiInputDate,
        FormsModule,
        TuiButton,
        NgForOf,
        NgIf,
    ],
    templateUrl: './third-type.html',
    styleUrl: './third-type.css',
})
export class ThirdType implements OnInit {

    protected operators: EmployeeDto[] = [];
    protected shifts: ShiftDto[] = [];
    protected product: ProductDto[] = [];

    protected readonly today = TuiDay.currentLocal();

    protected readonly controlOperators = new FormControl<EmployeeDto | null>(null);
    protected readonly controlShifts = new FormControl<ShiftDto | null>(null);
    protected readonly controlDate = new FormControl<TuiDay | null>(null);
    protected tableItems: TableItem[] = [
        {
            product: new FormControl<ProductDto | null>(null),
            cycleTime: new FormControl<number | null>(null),
            dailyPace: new FormControl<number | null>(null),
        }
    ];

    private readonly _dictManager: DictManagerService = inject(DictManagerService);
    private readonly _formsManager: FormsManagerService = inject(FormsManagerService);
    private readonly _destroyRef: DestroyRef = inject(DestroyRef);
    private readonly _cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
    private readonly _router: Router = inject(Router);

    public ngOnInit(): void {
        this.loadEmployees();
        this.loadShifts();
        this.loadProducts();
    }

    protected readonly stringify = (item: EmployeeDto): string =>
        item.fullName || 'Неизвестно';

    protected readonly stringifyShift = (shift: ShiftDto): string =>
        `№${shift.name}: ${this.formatTime(shift.startTime)}` || 'Неизвестно';

    protected readonly stringifyProduct = (product: ProductDto): string =>
        product.name || 'Неизвестно';

    protected goBack(): void {
        this._router.navigate(['department-head']);
    }

    protected addTableRow(): void {
        this.tableItems.push({
            product: new FormControl<ProductDto | null>(null),
            cycleTime: new FormControl<number | null>(null),
            dailyPace: new FormControl<number | null>(null),
        });
    }

    protected deleteTableRow(index: number): void {
        if (this.tableItems.length > 1) {
            this.tableItems.splice(index, 1);
        }
    }

    protected createForm(): void {
        if (!this.controlOperators.value ||
            !this.controlShifts.value ||
            !this.controlDate.value
        ) {
            return;
        }

        const isTableValid: boolean = this.tableItems.every((item: TableItem): boolean => {
            const hasProduct: boolean = item.product.value !== null;
            const hasCycleTime: boolean = item.cycleTime.value !== null && item.cycleTime.value > 0;
            const hasDailyPace: boolean = item.dailyPace.value !== null && item.dailyPace.value > 0;
            return hasProduct && hasCycleTime && hasDailyPace;
        });

        if (!isTableValid) return;

        const products: ProductContextDto[] = this.tableItems.map((item: TableItem) => ({
            productId: item.product.value!.id,
            cycleTime: item.cycleTime.value!,
            workstationCapacity: null,
            dailyRate: item.dailyPace.value!
        }));

        const req: CreateFormRequest = {
            paType: PaTypeDto.MultipleProductsWithCycleTime,
            shiftId: this.controlShifts.value!.id,
            assigneeId: this.controlOperators.value!.id,
            product: null,
            products: products,
            operationOrProduct: null
        };

        this._formsManager.createNewForm(req).pipe(
            takeUntilDestroyed(this._destroyRef)
        ).subscribe({
            next: (response: FormShortDto): void => {
                this._router.navigate(['department-head']);
            }
        });
    }

    private loadEmployees(): void {
        this._dictManager.getEmployees().pipe(
            takeUntilDestroyed(this._destroyRef)
        ).subscribe((employees: EmployeeDto[]): void => {
            this.operators = employees;

            this._cdr.detectChanges();
        });
    }

    private loadShifts(): void {
        this._dictManager.getShifts().pipe(
            takeUntilDestroyed(this._destroyRef)
        ).subscribe((shifts: ShiftDto[]): void => {
            this.shifts = shifts;

            this._cdr.detectChanges();
        });
    }

    private loadProducts(): void {
        this._dictManager.getProducts().pipe(
            takeUntilDestroyed(this._destroyRef)
        ).subscribe((products: ProductDto[]): void => {
            this.product = products;

            this._cdr.detectChanges();
        });
    }

    private formatTime(time: string): string {
        if (!time) return 'Неизвестно';

        const parts: string[] = time.split(':');

        if (parts.length >= 2) {
            return `${parts[0]}:${parts[1]}`;
        }

        return time;
    }
}
