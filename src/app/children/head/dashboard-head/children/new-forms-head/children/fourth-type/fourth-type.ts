import {Component} from '@angular/core';
import {BackHeader} from "../../../../../../components/back-header/back-header";
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TuiButton, TuiTextfield} from "@taiga-ui/core";
import {TuiComboBoxModule, TuiTextfieldControllerModule} from "@taiga-ui/legacy";
import {TuiDataListWrapper, TuiFilterByInputPipe, TuiInputDate, TuiStringifyContentPipe} from "@taiga-ui/kit";
import {ProductDto} from '../../../../../../../data/models/dictionaries/responses/ProductDto';
import {CreateFormRequest} from '../../../../../../../data/models/forms/requests/CreateFormRequest';
import {PaTypeDto} from '../../../../../../../data/models/forms/enums/PaTypeDto';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormShortDto} from '../../../../../../../data/models/forms/responses/FormShortDto';
import {OperationDto} from '../../../../../../../data/models/dictionaries/responses/OperationDto';
import {forkJoin} from 'rxjs';
import {BaseFormType} from '../directives/base-form-type';

@Component({
    selector: 'app-fourth-type',
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
    templateUrl: './fourth-type.html',
    styleUrl: './fourth-type.css',
})
export class FourthType extends BaseFormType {

    protected productsAndOperations: (ProductDto | OperationDto)[] = [];

    protected readonly controlProductOrOperation = new FormControl<ProductDto | OperationDto | null>(null);

    protected readonly stringifyProductOrOperation: (item: (ProductDto | OperationDto)) => string = (item: ProductDto | OperationDto): string => {
        if (this.isOperation(item)) {
            return `${item.name || 'Неизвестно'}`;
        } else {
            return `${item.name || 'Неизвестно'}`;
        }
    };

    protected isOperation(item: any): item is OperationDto {
        return 'duration' in item && 'basedOnType' in item;
    }

    protected isProduct(item: any): item is ProductDto {
        return 'tactTime' in item && 'enterpriseId' in item;
    }

    protected isCompletedCreateForm(): boolean {
        if (!this.controlOperators.value ||
            !this.controlShifts.value ||
            !this.controlProductOrOperation.value ||
            !this.controlDate.value) {
            return true;
        }

        return false;
    }

    protected override loadAdditionalData() {
        forkJoin({
            products: this._dictManager.getProducts(),
            operations: this._dictManager.getOperations()
        }).pipe(
            takeUntilDestroyed(this._destroyRef)
        ).subscribe({
            next: (result): void => {
                this.productsAndOperations = [
                    ...result.products,
                    ...result.operations
                ];

                this._cdr.detectChanges();
            }
        });
    }

    protected createForm(): void {
        if (!this.controlOperators.value ||
            !this.controlShifts.value ||
            !this.controlProductOrOperation.value ||
            !this.controlDate.value) {
            return;
        }

        const selectedItem: ProductDto | OperationDto = this.controlProductOrOperation.value;

        const req: CreateFormRequest = {
            paType: PaTypeDto.LessThanOnePerHour,
            shiftId: this.controlShifts.value!.id,
            assigneeId: this.controlOperators.value!.id,
            formDate: this.formatTuiDayToIsoString(this.controlDate.value!),
            product: null,
            products: null,
            operationOrProduct: {
                operationId: this.isOperation(selectedItem) ? selectedItem.id : null,
                productId: this.isProduct(selectedItem) ? selectedItem.id : null,
                operationName: this.isOperation(selectedItem) ? selectedItem.name : null,
                productName: this.isProduct(selectedItem) ? selectedItem.name : null
            }
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
