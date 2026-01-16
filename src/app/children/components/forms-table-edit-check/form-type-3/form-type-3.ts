import {Component, OnInit} from '@angular/core';
import {BaseFormTypeTables} from '../directives/base-form-type-tables';
import {BackHeader} from '../../back-header/back-header';
import {CompletedFormPopUp} from '../components/completed-form-pop-up/completed-form-pop-up';
import {Footer} from '../../footer/footer';
import {HeaderForm} from '../components/header-form/header-form';
import {HeaderOperator} from '../../../operator/components/header-operator/header-operator';
import {Loader} from '../../loader/loader';
import {NgClass, NgForOf, NgIf, NgStyle} from '@angular/common';
import {TuiButton, TuiTextfieldOptionsDirective} from '@taiga-ui/core';
import {TuiComboBoxModule, TuiInputModule, TuiTextfieldControllerModule} from '@taiga-ui/legacy';
import {TuiDataListWrapper, TuiFilterByInputPipe, TuiStringifyContentPipe} from '@taiga-ui/kit';
import {ReactiveFormsModule} from '@angular/forms';
import {FormRowDto} from '../../../../data/models/forms/responses/FormRowDto';
import {ProductContextDto} from '../../../../data/models/forms/ProductContextDto';
import {FormFieldDto} from '../../../../data/models/forms/FormFieldDto';

@Component({
    selector: 'app-form-type-3',
    imports: [
        Footer,
        HeaderOperator,
        BackHeader,
        Loader,
        NgIf,
        NgForOf,
        NgStyle,
        TuiInputModule,
        TuiDataListWrapper,
        ReactiveFormsModule,
        TuiComboBoxModule,
        TuiStringifyContentPipe,
        TuiFilterByInputPipe,
        TuiTextfieldControllerModule,
        TuiTextfieldOptionsDirective,
        HeaderForm,
        TuiButton,
        CompletedFormPopUp,
        NgClass
    ],
    templateUrl: './form-type-3.html',
    styleUrls: ['./form-type-3.css'],
})
export class FormType3 extends BaseFormTypeTables implements OnInit {

    protected columnAlignments: ('left' | 'center' | 'right')[] = [
        'center', 'right', 'right', 'right', 'right', 'right', 'right', 'right', 'right', 'right', 'left'
    ];

    protected getTableColumns(): FormFieldDto[] {
        return this.formInfo!.template!.tableColumns?.slice(1) || [];
    }

    /**
     * Получает название продукта по productId
     */
    protected getProductName(productId: number | null): string {
        if (!productId || !this.formInfo?.context) {
            return '';
        }

        // Проверяем массив products
        if (this.formInfo.context.products && this.formInfo.context.products.length > 0) {
            const product: ProductContextDto | undefined = this.formInfo.context.products.find((p: ProductContextDto): boolean => p.productId === productId);
            if (product?.productName) {
                return product.productName;
            }
        }

        // Проверяем одиночный product
        if (this.formInfo.context.product && this.formInfo.context.product.productId === productId) {
            return this.formInfo.context.product.productName || '';
        }

        return '';
    }

    /**
     * Проверяет, является ли строка первой строкой группы продукта
     */
    protected isFirstRowOfProduct(rowIndex: number): boolean {
        if (!this.formRows || rowIndex < 0 || rowIndex >= this.formRows.length) {
            return false;
        }

        const currentRow: FormRowDto = this.formRows[rowIndex];

        if (this.isBreakRow(currentRow.values)) {
            return false;
        }

        if (!currentRow.productId) {
            return false;
        }

        // Ищем предыдущую non-break строку с productId
        for (let i = rowIndex - 1; i >= 0; i--) {
            const prevRow: FormRowDto = this.formRows[i];

            // Если встретили break-строку БЕЗ productId - это точка разрыва, текущая строка - первая
            if (this.isBreakRow(prevRow.values) && !prevRow.productId) {
                return true;
            }

            // Пропускаем остальные break-строки
            if (this.isBreakRow(prevRow.values)) {
                continue;
            }

            // Если предыдущая строка имеет тот же productId - это не первая
            if (prevRow.productId === currentRow.productId) {
                return false;
            }

            // Если другой productId - это первая строка нашей группы
            return true;
        }

        return true;
    }

    /**
     * Вычисляет rowspan для объединения ячейки продукта
     * ОСТАНАВЛИВАЕТСЯ на break-строках БЕЗ productId (и НЕ считает их)
     */
    protected getProductRowspan(rowIndex: number): number {
        if (!this.formRows || rowIndex < 0 || rowIndex >= this.formRows.length) {
            return 1;
        }

        const currentRow: FormRowDto = this.formRows[rowIndex];
        const productId: number | null = currentRow.productId;

        if (!productId) {
            return 1;
        }

        let count: number = 1;

        for (let i = rowIndex + 1; i < this.formRows.length; i++) {
            const row: FormRowDto = this.formRows[i];

            // Если это break-строка БЕЗ productId - ПРЕРЫВАЕМ (и не считаем в rowspan)
            if (this.isBreakRow(row.values) && !row.productId) {
                break;
            }

            // Если это break-строка С productId - проверяем, есть ли после неё ещё строки с нашим productId
            if (this.isBreakRow(row.values)) {
                let hasMoreWithSameProduct: boolean = false;

                for (let j = i + 1; j < this.formRows.length; j++) {
                    // Пропускаем break-строки БЕЗ productId
                    if (this.isBreakRow(this.formRows[j].values) && !this.formRows[j].productId) {
                        break;
                    }
                    // Пропускаем остальные break-строки
                    if (this.isBreakRow(this.formRows[j].values)) {
                        continue;
                    }
                    hasMoreWithSameProduct = this.formRows[j].productId === productId;
                    break;
                }

                if (hasMoreWithSameProduct) {
                    count++;
                    continue;
                } else {
                    break;
                }
            }

            // Если это строка с тем же productId
            if (row.productId === productId) {
                count++;
                continue;
            }

            // Если это строка с другим productId (или null) - прерываем
            break;
        }

        return count;
    }

    /**
     * Вычисляет высоту для ячейки продукта
     * ОСТАНАВЛИВАЕТСЯ на break-строках БЕЗ productId (и НЕ считает их)
     */
    protected getProductLabelHeight(rowIndex: number): string {
        if (!this.formRows || rowIndex < 0 || rowIndex >= this.formRows.length) {
            return '44px';
        }

        const currentRow: FormRowDto = this.formRows[rowIndex];
        const productId: number | null = currentRow.productId;

        if (!productId) {
            return '44px';
        }

        const normalRowHeight = 44;
        const breakRowHeight = 32;

        let totalHeight: number = 0;

        for (let i = rowIndex; i < this.formRows.length; i++) {
            const row: FormRowDto = this.formRows[i];

            // Если это break-строка БЕЗ productId - ПРЕРЫВАЕМ (и не считаем высоту)
            if (this.isBreakRow(row.values) && !row.productId) {
                break;
            }

            if (this.isBreakRow(row.values)) {
                totalHeight += breakRowHeight;
                continue;
            }

            if (row.productId !== productId) {
                break;
            }

            totalHeight += normalRowHeight;
        }

        return `${totalHeight}px`;
    }

}
