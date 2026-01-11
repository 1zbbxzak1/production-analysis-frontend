import {ChangeDetectorRef, Component, DestroyRef, inject, OnInit} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TuiDay} from '@taiga-ui/cdk';
import {Router} from '@angular/router';
import {BackHeader} from '../components/back-header/back-header';
import {TuiButton, TuiTextfield} from '@taiga-ui/core';
import {TuiComboBoxModule, TuiTextfieldControllerModule} from '@taiga-ui/legacy';
import {TuiDataListWrapper, TuiFilterByInputPipe, TuiInputDate, TuiStringifyContentPipe} from '@taiga-ui/kit';
import {EmployeeDto} from '../../../../../data/models/dictionaries/responses/EmployeeDto';
import {ShiftDto} from '../../../../../data/models/dictionaries/responses/ShiftDto';
import {ProductDto} from '../../../../../data/models/dictionaries/responses/ProductDto';
import {DictManagerService} from '../../../../../data/service/dictionaries/dict.manager.service';
import {FormsManagerService} from '../../../../../data/service/forms/forms.manager.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormShortDto} from '../../../../../data/models/forms/responses/FormShortDto';
import {PaTypeDto} from '../../../../../data/models/forms/enums/PaTypeDto';
import {CreateFormRequest} from '../../../../../data/models/forms/requests/CreateFormRequest';

@Component({
    selector: 'app-second-type',
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
    ],
    templateUrl: './second-type.html',
    styleUrl: './second-type.css',
})
export class SecondType implements OnInit {

    protected operators: EmployeeDto[] = [];
    protected shifts: ShiftDto[] = [];
    protected product: ProductDto[] = [];

    protected readonly today = TuiDay.currentLocal();

    protected readonly controlOperators = new FormControl<EmployeeDto | null>(null);
    protected readonly controlShifts = new FormControl<ShiftDto | null>(null);
    protected readonly controlProduct = new FormControl<ProductDto | null>(null);
    protected readonly controlDate = new FormControl<TuiDay | null>(null);
    protected readonly controlWorkCapacity = new FormControl<number | null>(null);
    protected readonly controlDailyRate = new FormControl<number | null>(null);

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

    protected createForm(): void {
        if (!this.controlOperators.value ||
            !this.controlShifts.value ||
            !this.controlProduct.value ||
            !this.controlDate.value ||
            !this.controlWorkCapacity.value ||
            !this.controlDailyRate.value) {
            return;
        }

        const req: CreateFormRequest = {
            paType: PaTypeDto.SingleProductWithWorkstationCapacity,
            shiftId: this.controlShifts.value!.id,
            assigneeId: this.controlOperators.value!.id,
            product: {
                productId: this.controlProduct.value!.id,
                cycleTime: null,
                workstationCapacity: this.controlWorkCapacity.value!,
                dailyRate: this.controlDailyRate.value!
            },
            products: null,
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

    protected goBack(): void {
        this._router.navigate(['department-head']);
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
