import {ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit} from '@angular/core';
import {BackHeader} from "../../back-header/back-header";
import {CompletedFormPopUp} from "../components/completed-form-pop-up/completed-form-pop-up";
import {Footer} from "../../footer/footer";
import {HeaderForm} from "../components/header-form/header-form";
import {HeaderOperator} from "../../../operator/components/header-operator/header-operator";
import {Loader} from "../../loader/loader";
import {NgClass, NgForOf, NgIf, NgStyle} from "@angular/common";
import {TuiButton, TuiTextfieldOptionsDirective} from "@taiga-ui/core";
import {TuiComboBoxModule, TuiInputModule, TuiTextfieldControllerModule} from "@taiga-ui/legacy";
import {TuiDataListWrapper, TuiFilterByInputPipe, TuiStringifyContentPipe} from "@taiga-ui/kit";
import {BaseFormTypeTables} from '../directives/base-form-type-tables';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {EmployeeDto} from '../../../../data/models/dictionaries/responses/EmployeeDto';
import {DowntimeReasonGroupDto} from '../../../../data/models/dictionaries/responses/DowntimeReasonGroupDto';
import {FormRowDto} from '../../../../data/models/forms/responses/FormRowDto';

@Component({
    selector: 'app-form-type-5',
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
    templateUrl: './form-type-5.html',
    styleUrl: './form-type-5.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormType5 extends BaseFormTypeTables implements OnInit {

    protected override employeeColumnIndex: number = 7;
    protected override reasonColumnIndex: number = 8;
    protected columnAlignments: ('left' | 'center' | 'right')[] = [
        'left', 'right', 'right', 'right', 'right', 'right', 'right', 'right', 'right', 'left'
    ];
    private readonly _localDestroyRef: DestroyRef = inject(DestroyRef);

    protected override get isThirdColumnValid(): boolean {
        if (!this.formRows || this.formRows.length === 0 || !this.formInfo) {
            return false;
        }

        const col2Key: string | null = this.getFieldKeyByIndex(2); // Время начала Факт
        const col4Key: string | null = this.getFieldKeyByIndex(4); // Время окончания Факт

        if (!col2Key || !col4Key) return false;

        return this.formRows
            .filter((row: FormRowDto): boolean => !row.isAuxiliaryOperation)
            .every((row: FormRowDto): boolean => {
                const val2: any = row.values?.[col2Key]?.value;
                const val4: any = row.values?.[col4Key]?.value;

                const valid2: boolean = val2 !== undefined && val2 !== null && val2 !== '';
                const valid4: boolean = val4 !== undefined && val4 !== null && val4 !== '';

                return valid2 && valid4;
            });
    }

    public override ngOnInit(): void {
        super.ngOnInit();
    }

    protected override getEmployeeControl(row: FormRowDto): FormControl<EmployeeDto | null> {
        const rowOrder: number = row.order;
        const existingControl: FormControl<EmployeeDto | null> | undefined = this.employeeControls.get(rowOrder);

        if (existingControl && (existingControl as any).__formType4Initialized) {
            return existingControl;
        }

        const employeeColumnKey: string | null = this.getFieldKeyByIndex(this.employeeColumnIndex);
        const employeeName: any = employeeColumnKey ? row.values?.[employeeColumnKey]?.value : null;
        const employee: EmployeeDto | null = employeeName && this.employees
            ? this.employees.find((e: EmployeeDto): boolean => this.formatFullNameLocal(e.fullName) === employeeName) || null
            : null;

        const control = new FormControl<EmployeeDto | null>(employee);
        (control as any).__formType4Initialized = true;

        control.valueChanges
            .pipe(takeUntilDestroyed(this._localDestroyRef))
            .subscribe((emp: EmployeeDto | null): void => {
                const formattedName: string = emp ? this.formatFullNameLocal(emp.fullName) : '';
                this.setRowCellValue(row, this.employeeColumnIndex, formattedName);
            });

        this.employeeControls.set(rowOrder, control);
        return control;
    }

    protected override getReasonControl(row: FormRowDto): FormControl<DowntimeReasonGroupDto | null> {
        const rowOrder: number = row.order;
        const existingControl: FormControl<DowntimeReasonGroupDto | null> | undefined = this.downtimeReasonGroupControls.get(rowOrder);

        if (existingControl && (existingControl as any).__formType4Initialized) {
            return existingControl;
        }

        const reasonColumnKey: string | null = this.getFieldKeyByIndex(this.reasonColumnIndex);
        const reasonName: any = reasonColumnKey ? row.values?.[reasonColumnKey]?.value : null;
        const reason: DowntimeReasonGroupDto | null = reasonName && this.downtimeReasonGroups
            ? this.downtimeReasonGroups.find((e: DowntimeReasonGroupDto): boolean => e.name === reasonName) || null
            : null;

        const control = new FormControl<DowntimeReasonGroupDto | null>(reason);
        (control as any).__formType4Initialized = true;

        control.valueChanges
            .pipe(takeUntilDestroyed(this._localDestroyRef))
            .subscribe((reasonGroup: DowntimeReasonGroupDto | null): void => {
                this.setRowCellValue(row, this.reasonColumnIndex, reasonGroup?.name || '');
            });

        this.downtimeReasonGroupControls.set(rowOrder, control);
        return control;
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

        if ([1, 2, 3, 4].includes(columnIndex)) {
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
        const firstSpaceIndex: number = value.indexOf(' ');
        if (firstSpaceIndex === -1) {
            return value;
        }
        return value.substring(firstSpaceIndex + 1);
    }

    private formatFullNameLocal(fullName: string | null): string {
        if (!fullName) return '';

        const parts: string[] = fullName.trim().split(/\s+/);

        if (parts.length === 0) return '';
        if (parts.length === 1) return parts[0];
        if (parts.length === 2) return `${parts[0]} ${parts[1].charAt(0)}.`;
        if (parts.length >= 3) return `${parts[0]} ${parts[1].charAt(0)}.${parts[2].charAt(0)}.`;
        return fullName;
    }

    private formatTime(value: string): string {
        if (!value) {
            return '';
        }

        const match: RegExpMatchArray | null = value.match(/^(\d{2}:\d{2}):\d{2}$/);
        return match ? match[1] : value;
    }
}
