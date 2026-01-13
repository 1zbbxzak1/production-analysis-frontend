import {Component} from '@angular/core';
import {BackHeader} from '../../../../../../components/back-header/back-header';
import {TuiDataListWrapper, TuiFilterByInputPipe, TuiInputDate, TuiStringifyContentPipe} from '@taiga-ui/kit';
import {TuiComboBoxModule, TuiTextfieldControllerModule} from '@taiga-ui/legacy';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TuiButton, TuiTextfield} from '@taiga-ui/core';
import {ProductDto} from '../../../../../../../data/models/dictionaries/responses/ProductDto';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {CreateFormRequest} from '../../../../../../../data/models/forms/requests/CreateFormRequest';
import {PaTypeDto} from '../../../../../../../data/models/forms/enums/PaTypeDto';
import {FormShortDto} from '../../../../../../../data/models/forms/responses/FormShortDto';
import {BaseFormType} from '../directives/base-form-type';

@Component({
    selector: 'app-first-type',
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
    templateUrl: './first-type.html',
    styleUrl: './first-type.css',
})
export class FirstType extends BaseFormType {

    protected product: ProductDto[] = [];

    protected readonly controlProduct: FormControl<ProductDto | null> = new FormControl<ProductDto | null>(null);
    protected readonly controlTactTime: FormControl<number | null> = new FormControl<number | null>(null);
    protected readonly controlDailyRate: FormControl<number | null> = new FormControl<number | null>(null);

    protected readonly stringifyProduct: (product: ProductDto) => string = (product: ProductDto): string =>
        product.name || 'Неизвестно';

    protected isCompletedCreateForm(): boolean {
        if (!this.controlOperators.value ||
            !this.controlShifts.value ||
            !this.controlProduct.value ||
            !this.controlDate.value ||
            !this.controlTactTime.value ||
            !this.controlDailyRate.value) {
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
            !this.controlProduct.value ||
            !this.controlDate.value ||
            !this.controlTactTime.value ||
            !this.controlDailyRate.value) {
            return;
        }

        const req: CreateFormRequest = {
            paType: PaTypeDto.SingleProductWithCycleTime,
            shiftId: this.controlShifts.value!.id,
            assigneeId: this.controlOperators.value!.id,
            formDate: this.formatTuiDayToIsoString(this.controlDate.value!),
            product: {
                productId: this.controlProduct.value!.id,
                cycleTime: this.controlTactTime.value!,
                workstationCapacity: null,
                dailyRate: this.controlDailyRate.value!,
                productName: this.controlProduct.value!.name
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
}
