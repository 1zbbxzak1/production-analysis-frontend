import {Component, inject} from '@angular/core';
import {BackHeader} from '../../../../../../components/back-header/back-header';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TuiAlertService, TuiButton, TuiTextfield} from '@taiga-ui/core';
import {TuiComboBoxModule, TuiTextfieldControllerModule} from '@taiga-ui/legacy';
import {TuiDataListWrapper, TuiFilterByInputPipe, TuiInputDate, TuiStringifyContentPipe} from '@taiga-ui/kit';
import {ProductDto} from '../../../../../../../data/models/dictionaries/responses/ProductDto';
import {CreateFormRequest} from '../../../../../../../data/models/forms/requests/CreateFormRequest';
import {PaTypeDto} from '../../../../../../../data/models/forms/enums/PaTypeDto';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormShortDto} from '../../../../../../../data/models/forms/responses/FormShortDto';
import {BaseFormType} from '../directives/base-form-type';

@Component({
    selector: 'app-fifth-type',
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
    templateUrl: './fifth-type.html',
    styleUrl: './fifth-type.css',
})
export class FifthType extends BaseFormType {

    protected products: ProductDto[] = [];

    protected readonly controlProducts: FormControl<ProductDto | null> = new FormControl<ProductDto | null>(null);

    private readonly alerts: TuiAlertService = inject(TuiAlertService);

    protected isCompletedCreateForm(): boolean {
        if (!this.controlOperators.value ||
            !this.controlShifts.value ||
            !this.controlProducts.value ||
            !this.controlDate.value) {
            return true;
        }

        return false;
    }

    protected override loadAdditionalData(): void {
        this._dictManager.getProducts().pipe(
            takeUntilDestroyed(this._destroyRef)
        ).subscribe((products: ProductDto[]): void => {
            this.products = products;

            this._cdr.detectChanges();
        });
    }

    protected readonly stringifyProduct: (product: ProductDto) => string = (product: ProductDto): string =>
        product.name || 'Неизвестно';

    protected createForm(): void {
        if (!this.controlOperators.value ||
            !this.controlShifts.value ||
            !this.controlProducts.value ||
            !this.controlDate.value) {
            return;
        }

        const req: CreateFormRequest = {
            paType: PaTypeDto.LessThanOnePerShift,
            shiftId: this.controlShifts.value!.id,
            assigneeId: this.controlOperators.value!.id,
            formDate: this.formatTuiDayToIsoString(this.controlDate.value!),
            product: null,
            products: null,
            operationOrProduct: {
                operationId: null,
                productId: this.controlProducts.value!.id
            }
        };

        this._formsManager.createNewForm(req).pipe(
            takeUntilDestroyed(this._destroyRef)
        ).subscribe({
            next: (response: FormShortDto): void => {
                this.alerts
                    .open('<strong>Форма "Менее 1 изделия в смену" создана</strong>', {
                        appearance: 'positive',
                    })
                    .subscribe();

                this._router.navigate(['department-head']);
            }
        });
    }
}
