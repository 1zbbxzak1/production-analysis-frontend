import {ChangeDetectorRef, Component, DestroyRef, inject, OnInit} from '@angular/core';
import {Footer} from '../../../../components/footer/footer';
import {HeaderOperator} from '../../../components/header-operator/header-operator';
import {BackHeader} from '../../../../components/back-header/back-header';
import {ActivatedRoute, Router} from '@angular/router';
import {FormsManagerService} from '../../../../../data/service/forms/forms.manager.service';
import {FormDto} from '../../../../../data/models/forms/responses/FormDto';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {Loader} from '../../../../components/loader/loader';
import {NgClass, NgForOf, NgIf, NgStyle} from '@angular/common';
import {TuiDataListWrapper, TuiFilterByInputPipe, TuiStringifyContentPipe} from '@taiga-ui/kit';
import {FormRowDto} from '../../../../../data/models/forms/responses/FormRowDto';
import {forkJoin, tap} from 'rxjs';
import {DictManagerService} from '../../../../../data/service/dictionaries/dict.manager.service';
import {EmployeeDto} from '../../../../../data/models/dictionaries/responses/EmployeeDto';
import {TuiComboBoxModule, TuiInputModule, TuiTextfieldControllerModule} from '@taiga-ui/legacy';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {TuiButton, TuiTextfieldOptionsDirective} from '@taiga-ui/core';
import {DowntimeReasonGroupDto} from '../../../../../data/models/dictionaries/responses/DowntimeReasonGroupDto';
import {HeaderFormOperator} from '../components/header-form-operator/header-form-operator';

@Component({
    selector: 'app-form-edit-operator',
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
        HeaderFormOperator,
        NgClass,
        TuiButton,
    ],
    templateUrl: './form-edit-operator.html',
    styleUrl: './form-edit-operator.css',
})
export class FormEditOperator implements OnInit {

    public isLoading: boolean = true;

    protected columnHeaders: string[] = [
        'Время работы, час',
        'План, шт',
        'План накоп, шт',
        'Факт, шт',
        'Факт накоп, шт',
        'Отклонен шт',
        'Отклонен накоп, шт',
        'Простой мин',
        'Ответственный за простой',
        'Группы причин',
        'Причины отклонения, принятые меры'
    ];

    protected formId: number = 0;
    protected formInfo: FormDto | null = null;
    protected formRows: FormRowDto[] | null = null;
    protected employees: EmployeeDto[] | null = null;
    protected employeeControls: Map<number, FormControl<EmployeeDto | null>> = new Map(); // key: row.order
    protected downtimeReasonGroups: DowntimeReasonGroupDto[] | null = null;
    protected downtimeReasonGroupControls: Map<number, FormControl<DowntimeReasonGroupDto | null>> = new Map(); // key: row.order

    private columnAlignments: ('left' | 'center' | 'right')[] = [
        'center', 'right', 'right', 'right', 'right', 'right', 'right', 'right', 'right', 'right', 'left'
    ];

    private readonly _destroyRef: DestroyRef = inject(DestroyRef);
    private readonly _cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
    private readonly _router: Router = inject(Router);
    private readonly _route: ActivatedRoute = inject(ActivatedRoute);
    private readonly _dictManager: DictManagerService = inject(DictManagerService);
    private readonly _formsManager: FormsManagerService = inject(FormsManagerService);

    protected get isThirdColumnValid(): boolean {
        if (!this.formRows || this.formRows.length === 0 || !this.formInfo) {
            return false;
        }

        const thirdColumnKey = this.getFieldKeyByIndex(3);
        if (!thirdColumnKey) return false;

        return this.formRows
            .filter((row: FormRowDto): boolean => !this.isBreakRow(row.values)) // игнорируем break‑строки
            .every((row: FormRowDto): boolean => {
                const value = row.values?.[thirdColumnKey]?.value;
                return value !== undefined && value !== null && value !== '';
            });
    }

    public ngOnInit(): void {
        const getId: string = this._route.snapshot.paramMap.get('id')!;
        this.formId = parseInt(getId);

        this.loadFormData();
    }

    /**
     * Получает ключ поля по индексу колонки из template.tableColumns
     */
    // protected getFieldKeyByIndex(columnIndex: number): string | null {
    //     if (!this.formInfo?.template?.tableColumns || columnIndex < 0 || columnIndex >= this.formInfo.template.tableColumns.length) {
    //         return null;
    //     }
    //     return this.formInfo.template.tableColumns[columnIndex].id.toString();
    // }

    protected getFieldKeyByIndex(columnIndex: number): string | null {
        if (
            !this.columnHeaders ||
            columnIndex < 0 ||
            columnIndex >= this.columnHeaders.length
        ) {
            return null;
        }

        return (columnIndex + 1).toString();
    }

    protected setRowCellValue(row: FormRowDto, columnIndex: number, value: string): void {
        const fieldKey = this.getFieldKeyByIndex(columnIndex);
        if (!fieldKey) return;

        if (!row.values) row.values = {};
        if (!row.values[fieldKey]) row.values[fieldKey] = {value: null, cumulativeValue: null};
        row.values[fieldKey].value = value;

        this._cdr.detectChanges();
    }

    protected getRowCellValue(values: Record<string, any> | null, columnIndex: number): string {
        if (!values) return '';
        const fieldKey = this.getFieldKeyByIndex(columnIndex);
        if (!fieldKey) return '';
        const value = values[fieldKey];
        if (!value) return '';
        // Если значение - объект с полем value (FormRowValueDto), возвращаем value
        // Если значение - примитив, возвращаем его напрямую
        if (typeof value === 'object' && 'value' in value) {
            return value.value !== undefined && value.value !== null ? String(value.value) : '';
        }
        return String(value);
    }

    /**
     * Получает значение из totalValues (числовые ключи, значения - числа)
     */
    protected getTotalValue(columnIndex: number): string {
        if (!this.formInfo?.totalValues) return '';
        const fieldKey = this.getFieldKeyByIndex(columnIndex);
        if (!fieldKey) return '';
        const fieldId = Number(fieldKey);
        const value = this.formInfo.totalValues[fieldId];
        return value !== undefined && value !== null ? String(value) : '';
    }

    protected hasInputValue(row: FormRowDto, columnIndex: number): boolean {
        const fieldKey = this.getFieldKeyByIndex(columnIndex);
        if (!fieldKey) return false;
        const value = row.values?.[fieldKey]?.value;
        return value !== undefined && value !== null && value !== '';
    }

    protected getJustifyContent(columnIndex: number): string {
        const align = this.columnAlignments[columnIndex] || 'left';
        return align === 'left' ? 'flex-start' : align === 'right' ? 'flex-end' : 'center';
    }

    protected getAlignText(columnIndex: number): string {
        const align = this.columnAlignments[columnIndex] || 'left';
        return align;
    }

    protected getEmployeeControl(row: FormRowDto): FormControl<EmployeeDto | null> {
        const rowOrder = row.order;
        if (!this.employeeControls.has(rowOrder)) {
            const control = new FormControl<EmployeeDto | null>(null);

            control.valueChanges
                .pipe(takeUntilDestroyed(this._destroyRef))
                .subscribe((employee: EmployeeDto | null) => {
                    const employeeId = employee?.id?.toString() || '';
                    this.setRowCellValue(row, 8, employeeId);
                });

            this.employeeControls.set(rowOrder, control);
        }
        return this.employeeControls.get(rowOrder)!;
    }

    protected getReasonControl(row: FormRowDto): FormControl<DowntimeReasonGroupDto | null> {
        const rowOrder = row.order;
        if (!this.downtimeReasonGroupControls.has(rowOrder)) {
            const control = new FormControl<DowntimeReasonGroupDto | null>(null);

            control.valueChanges
                .pipe(takeUntilDestroyed(this._destroyRef))
                .subscribe((reason: DowntimeReasonGroupDto | null) => {
                    const reasonId = reason?.id?.toString() || '';
                    this.setRowCellValue(row, 9, reasonId);
                });

            this.downtimeReasonGroupControls.set(rowOrder, control);
        }
        return this.downtimeReasonGroupControls.get(rowOrder)!;
    }

    protected readonly stringify = (item: EmployeeDto): string =>
        this.formatFullName(item.fullName) || 'Неизвестно';

    protected readonly stringifyReason = (item: DowntimeReasonGroupDto): string =>
        item.name || 'Неизвестно';

    protected formatTimeCell(values: Record<string, any> | null, columnIndex: number): string {
        const raw: string = this.getRowCellValue(values, columnIndex);

        if (!raw) {
            return '';
        }

        const match = raw.match(/^\s*\d{2}:\d{2}-\d{2}:\d{2}\s+(.+)$/);

        if (match && match[1]) {
            return match[1].trim();
        }

        return raw;
    }

    protected isBreakRow(values: Record<string, any> | null): boolean {
        const raw: string = this.getRowCellValue(values, 0); // индекс 0 = первый столбец "Время работы, час"
        if (!raw) {
            return false;
        }

        const formatted: string = this.formatTimeCell(values, 0);

        return formatted !== raw;
    }

    protected goBack(): void {
        this._router.navigate(['operator/progress-list']);
    }

    private loadFormData(): void {
        forkJoin([
            this._formsManager.getFormById(this.formId),
            this._formsManager.getFormRows(this.formId),
            this._dictManager.getEmployees(),
            this._dictManager.getDowntimeReasonGroups()
        ]).pipe(
            tap(([formInfo, formRows, employees, reason]: [FormDto, FormRowDto[], EmployeeDto[], DowntimeReasonGroupDto[]]): void => {
                this.formInfo = formInfo;
                this.formRows = formRows;
                this.employees = employees;
                this.downtimeReasonGroups = reason;

                this.initializeEmployeeControls();
                this.initializeReasonControls();
            }),
            takeUntilDestroyed(this._destroyRef)
        ).subscribe({
            complete: () => this.hideLoader()
        });
    }

    private initializeEmployeeControls(): void {
        if (!this.formRows) return;

        const employeeColumnKey = this.getFieldKeyByIndex(8);
        if (!employeeColumnKey) return;

        this.formRows.forEach((row) => {
            const employeeId = row.values?.[employeeColumnKey]?.value;
            const employee = employeeId && this.employees
                ? this.employees.find(e => e.id === employeeId || e.id === Number(employeeId))
                : null;

            const control = new FormControl<EmployeeDto | null>(employee || null);

            control.valueChanges
                .pipe(takeUntilDestroyed(this._destroyRef))
                .subscribe((emp: EmployeeDto | null) => {
                    this.setRowCellValue(row, 8, emp?.id?.toString() || '');
                });

            this.employeeControls.set(row.order, control);
        });
    }

    private initializeReasonControls(): void {
        if (!this.formRows) return;

        const reasonColumnKey = this.getFieldKeyByIndex(9);
        if (!reasonColumnKey) return;

        this.formRows.forEach((row) => {
            const reasonId = row.values?.[reasonColumnKey]?.value;
            const reason = reasonId && this.downtimeReasonGroups
                ? this.downtimeReasonGroups.find(e => e.id === reasonId || e.id === Number(reasonId))
                : null;

            const control = new FormControl<DowntimeReasonGroupDto | null>(reason || null);

            control.valueChanges
                .pipe(takeUntilDestroyed(this._destroyRef))
                .subscribe((reasonGroup: DowntimeReasonGroupDto | null) => {
                    this.setRowCellValue(row, 9, reasonGroup?.id?.toString() || '');
                });

            this.downtimeReasonGroupControls.set(row.order, control);
        });
    }

    private formatFullName(fullName: string | null): string {
        if (!fullName) {
            return '';
        }

        const parts: string[] = fullName.trim().split(/\s+/);

        if (parts.length === 0) {
            return '';
        }

        if (parts.length === 1) {
            return parts[0];
        }

        if (parts.length === 2) {
            return `${parts[0]} ${parts[1].charAt(0)}.`;
        }

        if (parts.length >= 3) {
            return `${parts[0]} ${parts[1].charAt(0)}.${parts[2].charAt(0)}.`;
        }

        return fullName;
    }

    private hideLoader(): void {
        setTimeout(() => {
            this.isLoading = false;
            this._cdr.detectChanges();
        }, 500);
    }
}
