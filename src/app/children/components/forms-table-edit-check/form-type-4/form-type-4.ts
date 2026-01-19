import {Component, OnInit} from '@angular/core';
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
import {BaseFormTypeTables} from '../directives/base-form-type-tables';
import {FormRowDto} from '../../../../data/models/forms/responses/FormRowDto';

@Component({
    selector: 'app-form-type-4',
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
    templateUrl: './form-type-4.html',
    styleUrl: './form-type-4.css',
})
export class FormType4 extends BaseFormTypeTables implements OnInit {

    protected override employeeColumnIndex: number = 13;
    protected override reasonColumnIndex: number = 14;

    protected columnAlignments: ('left' | 'center' | 'right')[] = [
        'center', 'left', 'right', 'right', 'right', 'right', 'right', 'right', 'right', 'right', 'right', 'right', 'right', 'right', 'right', 'left'
    ];

    protected override get isThirdColumnValid(): boolean {
        if (!this.formRows || this.formRows.length === 0 || !this.formInfo) {
            return false;
        }

        const col3Key: string | null = this.getFieldKeyByIndex(3); // Время начала Факт
        const col5Key: string | null = this.getFieldKeyByIndex(5); // Время окончания Факт
        const col8Key: string | null = this.getFieldKeyByIndex(8); // Факт, шт

        if (!col3Key || !col5Key || !col8Key) return false;

        return this.formRows
            .filter((row: FormRowDto): boolean => !row.isAuxiliaryOperation)
            .every((row: FormRowDto): boolean => {
                const val3: any = row.values?.[col3Key]?.value;
                const val5: any = row.values?.[col5Key]?.value;
                const val8: any = row.values?.[col8Key]?.value;

                const valid3: boolean = val3 !== undefined && val3 !== null && val3 !== '';
                const valid5: boolean = val5 !== undefined && val5 !== null && val5 !== '';
                const valid8: boolean = val8 !== undefined && val8 !== null && val8 !== '';

                return valid3 && valid5 && valid8;
            });
    }

    /**
     * Проверяет, является ли строка первой в группе по groupKey
     */
    protected isFirstRowOfGroup(rowIndex: number): boolean {
        if (!this.formRows || rowIndex < 0 || rowIndex >= this.formRows.length) {
            return false;
        }

        const currentRow: FormRowDto = this.formRows[rowIndex];

        // break-строки не участвуют в группировке
        if (this.isBreakRow(currentRow.values)) {
            return false;
        }

        const currentGroupKey: number | null = currentRow.groupKey;

        // Если нет groupKey - не группируем
        if (currentGroupKey === null || currentGroupKey === undefined) {
            return false;
        }

        // Первая строка всегда первая в группе
        if (rowIndex === 0) {
            return true;
        }

        // Ищем предыдущую non-break строку
        for (let i = rowIndex - 1; i >= 0; i--) {
            const prevRow: FormRowDto = this.formRows[i];

            // Пропускаем break-строки
            if (this.isBreakRow(prevRow.values)) {
                continue;
            }

            // Если предыдущая строка имеет тот же groupKey - это не первая
            if (prevRow.groupKey === currentGroupKey) {
                return false;
            }

            // Если другой groupKey - это первая строка нашей группы
            return true;
        }

        return true;
    }

    /**
     * Вычисляет rowspan для объединения ячейки по groupKey
     */
    protected getGroupRowspan(rowIndex: number): number {
        if (!this.formRows || rowIndex < 0 || rowIndex >= this.formRows.length) {
            return 1;
        }

        const currentRow: FormRowDto = this.formRows[rowIndex];
        const groupKey: number | null = currentRow.groupKey;

        if (groupKey === null || groupKey === undefined) {
            return 1;
        }

        let count: number = 0;

        for (let i = rowIndex; i < this.formRows.length; i++) {
            const row: FormRowDto = this.formRows[i];

            // break-строка прерывает группу
            if (this.isBreakRow(row.values)) {
                break;
            }

            // Другой groupKey - конец группы
            if (row.groupKey !== groupKey) {
                break;
            }

            count++;
        }

        return count;
    }

    /**
     * Вычисляет высоту для объединённой ячейки группы
     */
    protected getGroupCellHeight(rowIndex: number): string {
        if (!this.formRows || rowIndex < 0 || rowIndex >= this.formRows.length) {
            return '44px';
        }

        const currentRow: FormRowDto = this.formRows[rowIndex];
        const groupKey: number | null = currentRow.groupKey;

        if (groupKey === null || groupKey === undefined) {
            return '44px';
        }

        const normalRowHeight = 44.8;
        let totalHeight: number = 0;

        for (let i = rowIndex; i < this.formRows.length; i++) {
            const row: FormRowDto = this.formRows[i];

            if (this.isBreakRow(row.values)) {
                break;
            }

            if (row.groupKey !== groupKey) {
                break;
            }

            totalHeight += normalRowHeight;
        }

        return `${totalHeight}px`;
    }

    protected getStandardColumnStyle(i: number): Record<string, string> {
        return {
            'justify-content': this.getJustifyContent(this.columnAlignments, i),
            'text-align': this.getAlignText(this.columnAlignments, i),
            'grid-column': `${i + 1}`,
            'grid-row': '1 / span 2',
            'height': '100%'
        };
    }

    protected getGroupHeaderStyle(startColumn: number): Record<string, string> {
        return {
            'justify-content': 'center',
            'text-align': 'center',
            'grid-column': `${startColumn} / span 2`,
            'grid-row': '1',
            'border-bottom': '1px solid var(--day-base-base-04)'
        };
    }

    protected getSubColumnStyle(i: number): Record<string, string> {
        return {
            'justify-content': this.getJustifyContent(this.columnAlignments, i),
            'text-align': this.getAlignText(this.columnAlignments, i),
            'grid-column': `${i + 1}`,
            'grid-row': '2'
        };
    }

    protected override getRowCellValue(values: Record<string, any> | null, columnIndex: number): string {
        const value: string = super.getRowCellValue(values, columnIndex);

        if ([2, 3, 4, 5].includes(columnIndex)) {
            return this.formatTime(value);
        }

        return value;
    }

    protected getBreakRowText(value: string | undefined | null): string {
        if (!value) {
            return '';
        }
        // Ожидаемый формат: "HH:mm-HH:mm Текст"
        // Находим первый пробел и возвращаем все после него
        const firstSpaceIndex = value.indexOf(' ');
        if (firstSpaceIndex === -1) {
            return value;
        }
        return value.substring(firstSpaceIndex + 1);
    }

    private formatTime(value: string): string {
        if (!value) {
            return '';
        }

        const match: RegExpMatchArray | null = value.match(/^(\d{2}:\d{2}):\d{2}$/);
        return match ? match[1] : value;
    }
}
