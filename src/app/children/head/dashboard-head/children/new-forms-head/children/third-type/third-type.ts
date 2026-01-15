import {Component, inject} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TuiComboBoxModule, TuiTextfieldControllerModule} from "@taiga-ui/legacy";
import {ProductDto} from '../../../../../../../data/models/dictionaries/responses/ProductDto';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {CreateFormRequest} from '../../../../../../../data/models/forms/requests/CreateFormRequest';
import {PaTypeDto} from '../../../../../../../data/models/forms/enums/PaTypeDto';
import {FormShortDto} from '../../../../../../../data/models/forms/responses/FormShortDto';
import {BaseFormType} from '../directives/base-form-type';
import {TableItem} from './interfaces/TableItem';
import {BackHeader} from '../../../../../../components/back-header/back-header';
import {TuiDataListWrapper, TuiFilterByInputPipe, TuiInputDate, TuiStringifyContentPipe} from '@taiga-ui/kit';
import {TuiAlertService, TuiButton, TuiTextfield} from '@taiga-ui/core';
import {NgForOf, NgIf} from '@angular/common';
import {ProductContextRequest} from '../../../../../../../data/models/forms/requests/ProductContextRequest';

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
export class ThirdType extends BaseFormType {

    protected product: ProductDto[] = [];

    protected tableItems: TableItem[] = [
        {
            product: new FormControl<ProductDto | null>(null),
            cycleTime: new FormControl<number | null>(null),
            dailyPace: new FormControl<number | null>(null),
        }
    ];

    private readonly alerts: TuiAlertService = inject(TuiAlertService);

    protected readonly stringifyProduct: (product: ProductDto) => string = (product: ProductDto): string =>
        product.name || 'Неизвестно';

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

    protected isCompletedCreateForm(): boolean {
        if (!this.controlOperators.value ||
            !this.controlShifts.value ||
            !this.controlDate.value) {
            return true;
        }

        return false;
    }

    protected override loadAdditionalData(): void {
        this._dictManager.getProducts().pipe(
            takeUntilDestroyed(this._destroyRef)
        ).subscribe((products: ProductDto[]): void => {
            this.product = products;

            this._cdr.detectChanges();
        });
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

        const products: ProductContextRequest[] = this.tableItems.map((item: TableItem) => ({
            productId: item.product.value!.id,
            cycleTime: item.cycleTime.value!,
            workstationCapacity: null,
            dailyRate: item.dailyPace.value!
        }));

        const req: CreateFormRequest = {
            paType: PaTypeDto.MultipleProductsWithCycleTime,
            shiftId: this.controlShifts.value!.id,
            assigneeId: this.controlOperators.value!.id,
            formDate: this.formatTuiDayToIsoString(this.controlDate.value!),
            product: null,
            products: products,
            operationOrProduct: null
        };

        this._formsManager.createNewForm(req).pipe(
            takeUntilDestroyed(this._destroyRef)
        ).subscribe({
            next: (response: FormShortDto): void => {
                this.alerts
                    .open('<strong>Форма "Несколько номенклатур" создана</strong>', {
                        appearance: 'positive',
                    })
                    .subscribe();

                this._router.navigate(['department-head']);
            }
        });
    }
}
