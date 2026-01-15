import {Component, inject} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TuiComboBoxModule, TuiTextfieldControllerModule} from '@taiga-ui/legacy';
import {ProductDto} from '../../../../../../../data/models/dictionaries/responses/ProductDto';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormShortDto} from '../../../../../../../data/models/forms/responses/FormShortDto';
import {PaTypeDto} from '../../../../../../../data/models/forms/enums/PaTypeDto';
import {CreateFormRequest} from '../../../../../../../data/models/forms/requests/CreateFormRequest';
import {BaseFormType} from '../directives/base-form-type';
import {BackHeader} from '../../../../../../components/back-header/back-header';
import {TuiDataListWrapper, TuiFilterByInputPipe, TuiInputDate, TuiStringifyContentPipe} from '@taiga-ui/kit';
import {TuiAlertService, TuiButton, TuiTextfield} from '@taiga-ui/core';

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
export class SecondType extends BaseFormType {

    protected product: ProductDto[] = [];

    protected readonly controlProduct: FormControl<ProductDto | null> = new FormControl<ProductDto | null>(null);
    protected readonly controlWorkCapacity: FormControl<number | null> = new FormControl<number | null>(null);
    protected readonly controlDailyRate: FormControl<number | null> = new FormControl<number | null>(null);

    private readonly alerts: TuiAlertService = inject(TuiAlertService);

    protected readonly stringifyProduct: (product: ProductDto) => string = (product: ProductDto): string =>
        product.name || 'Неизвестно';

    protected isCompletedCreateForm(): boolean {
        if (!this.controlOperators.value ||
            !this.controlShifts.value ||
            !this.controlProduct.value ||
            !this.controlDate.value ||
            !this.controlWorkCapacity.value ||
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
            !this.controlWorkCapacity.value ||
            !this.controlDailyRate.value) {
            return;
        }

        const req: CreateFormRequest = {
            paType: PaTypeDto.SingleProductWithWorkstationCapacity,
            shiftId: this.controlShifts.value!.id,
            assigneeId: this.controlOperators.value!.id,
            formDate: this.formatTuiDayToIsoString(this.controlDate.value!),
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
                this.alerts
                    .open('<strong>Форма "По мощности рабочего места" создана</strong>', {
                        appearance: 'positive',
                    })
                    .subscribe();

                this._router.navigate(['department-head']);
            }
        });
    }
}
