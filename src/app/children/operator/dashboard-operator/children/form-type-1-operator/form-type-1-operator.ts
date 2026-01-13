import {ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject, OnInit} from '@angular/core';
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
import {debounceTime, distinctUntilChanged, forkJoin, Observable, Subject, switchMap, tap} from 'rxjs';
import {DictManagerService} from '../../../../../data/service/dictionaries/dict.manager.service';
import {EmployeeDto} from '../../../../../data/models/dictionaries/responses/EmployeeDto';
import {TuiComboBoxModule, TuiInputModule, TuiTextfieldControllerModule} from '@taiga-ui/legacy';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {TuiAlertService, TuiButton, TuiTextfieldOptionsDirective} from '@taiga-ui/core';
import {DowntimeReasonGroupDto} from '../../../../../data/models/dictionaries/responses/DowntimeReasonGroupDto';
import {HeaderFormOperator} from '../components/header-form-operator/header-form-operator';
import {UpdateFormRowResponse} from '../../../../../data/models/forms/responses/UpdateFormRowResponse';
import {CompletedFormPopUp} from '../components/completed-form-pop-up/completed-form-pop-up';

@Component({
    selector: 'app-form-type-1-operator',
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
        CompletedFormPopUp
    ],
    templateUrl: './form-type-1-operator.html',
    styleUrl: './form-type-1-operator.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormType1Operator implements OnInit {

    public isLoading: boolean = true;
    protected modalStates = {
        complete: false,
    }

    protected formId: number = 0;
    protected isCompleted: boolean = false;
    protected formInfo: FormDto | null = null;
    protected formRows: FormRowDto[] | null = null;
    protected employees: EmployeeDto[] | null = null;
    protected employeeControls: Map<number, FormControl<EmployeeDto | null>> = new Map(); // key: row.order
    protected downtimeReasonGroups: DowntimeReasonGroupDto[] | null = null;
    protected downtimeReasonGroupControls: Map<number, FormControl<DowntimeReasonGroupDto | null>> = new Map(); // key: row.order

    private columnAlignments: ('left' | 'center' | 'right')[] = [
        'center', 'right', 'right', 'right', 'right', 'right', 'right', 'right', 'right', 'right', 'left'
    ];

    private changedRowValues: Map<number, Record<number, any>> = new Map();
    private rowChangeSubject: Subject<{ rowOrder: number, changes: Record<number, any> }> = new Subject();

    private readonly _destroyRef: DestroyRef = inject(DestroyRef);
    private readonly _cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
    private readonly _router: Router = inject(Router);
    private readonly _route: ActivatedRoute = inject(ActivatedRoute);
    private readonly _dictManager: DictManagerService = inject(DictManagerService);
    private readonly _formsManager: FormsManagerService = inject(FormsManagerService);
    private readonly alerts: TuiAlertService = inject(TuiAlertService);

    protected get isThirdColumnValid(): boolean {
        if (!this.formRows || this.formRows.length === 0 || !this.formInfo) {
            return false;
        }

        const thirdColumnKey: string | null = this.getFieldKeyByIndex(3);
        if (!thirdColumnKey) return false;

        return this.formRows
            .filter((row: FormRowDto): boolean => !this.isBreakRow(row.values)) // игнорируем break‑строки
            .every((row: FormRowDto): boolean => {
                const value: any = row.values?.[thirdColumnKey]?.value;
                return value !== undefined && value !== null && value !== '';
            });
    }

    public ngOnInit(): void {
        this.initializeAutoSave();

        const getId: string = this._route.snapshot.paramMap.get('id')!;
        this.formId = parseInt(getId);

        this.loadFormData();
    }

    protected getFieldKeyByIndex(columnIndex: number): string | null {
        if (!this.formInfo?.template?.tableColumns || columnIndex < 0 || columnIndex >= this.formInfo.template.tableColumns.length) {
            return null;
        }
        return this.formInfo.template.tableColumns[columnIndex].id.toString();
    }

    protected setRowCellValue(row: FormRowDto, columnIndex: number, value: string): void {
        const fieldKey = this.getFieldKeyByIndex(columnIndex);
        if (!fieldKey) return;

        if (!row.values) row.values = {};

        if (!row.values[fieldKey]) row.values[fieldKey] = {value: null};
        row.values[fieldKey].value = value;

        if (this.hasInputValue(row, columnIndex)) {
            this.trackRowChange(row.order, fieldKey, value);
        }

        this._cdr.detectChanges();
    }

    protected getRowCellValue(values: Record<string, any> | null, columnIndex: number): string {
        if (!values) return '';

        const fieldKey: string | null = this.getFieldKeyByIndex(columnIndex);
        if (!fieldKey) return '';

        const value: any = values[fieldKey];
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

        const fieldKey: string | null = this.getFieldKeyByIndex(columnIndex);
        if (!fieldKey) return '';

        const fieldId: number = Number(fieldKey);
        const value: any = this.formInfo.totalValues[fieldId];

        return value !== undefined && value !== null ? String(value) : '';
    }

    protected hasInputValue(row: FormRowDto, columnIndex: number): boolean {
        const fieldKey: string | null = this.getFieldKeyByIndex(columnIndex);
        if (!fieldKey) return false;

        const value: any = row.values?.[fieldKey]?.value;

        return value !== undefined && value !== null && value !== '';
    }

    protected getJustifyContent(columnIndex: number): string {
        const align: "left" | "center" | "right" = this.columnAlignments[columnIndex] || 'left';
        return align === 'left' ? 'flex-start' : align === 'right' ? 'flex-end' : 'center';
    }

    protected getAlignText(columnIndex: number): string {
        const align: "left" | "center" | "right" = this.columnAlignments[columnIndex] || 'left';
        return align;
    }

    protected getEmployeeControl(row: FormRowDto): FormControl<EmployeeDto | null> {
        const rowOrder: number = row.order;

        if (!this.employeeControls.has(rowOrder)) {
            const control = new FormControl<EmployeeDto | null>(null);

            control.valueChanges
                .pipe(takeUntilDestroyed(this._destroyRef))
                .subscribe((employee: EmployeeDto | null): void => {
                    const employeeName: string = employee ? this.formatFullName(employee.fullName) : '';

                    this.setRowCellValue(row, 8, employeeName);

                    if (this.hasInputValue(row, 8)) {
                        const fieldKey: string | null = this.getFieldKeyByIndex(8);
                        if (fieldKey) {
                            this.trackRowChange(row.order, fieldKey, employeeName);
                        }
                    }
                });

            this.employeeControls.set(rowOrder, control);
        }
        return this.employeeControls.get(rowOrder)!;
    }

    protected getReasonControl(row: FormRowDto): FormControl<DowntimeReasonGroupDto | null> {
        const rowOrder: number = row.order;
        if (!this.downtimeReasonGroupControls.has(rowOrder)) {
            const control = new FormControl<DowntimeReasonGroupDto | null>(null);

            control.valueChanges
                .pipe(takeUntilDestroyed(this._destroyRef))
                .subscribe((reason: DowntimeReasonGroupDto | null): void => {
                    const reasonName: string = reason?.name || '';

                    this.setRowCellValue(row, 9, reasonName);

                    if (this.hasInputValue(row, 9)) {
                        const fieldKey: string | null = this.getFieldKeyByIndex(9);
                        if (fieldKey) {
                            this.trackRowChange(row.order, fieldKey, reasonName);
                        }
                    }
                });

            this.downtimeReasonGroupControls.set(rowOrder, control);
        }
        return this.downtimeReasonGroupControls.get(rowOrder)!;
    }

    protected readonly stringify: (item: EmployeeDto) => string = (item: EmployeeDto): string =>
        this.formatFullName(item.fullName) || 'Неизвестно';

    protected readonly stringifyReason: (item: DowntimeReasonGroupDto) => string = (item: DowntimeReasonGroupDto): string =>
        item.name || 'Неизвестно';

    protected formatTimeCell(values: Record<string, any> | null, columnIndex: number): string {
        const raw: string = this.getRowCellValue(values, columnIndex);

        if (!raw) {
            return '';
        }

        const match: RegExpMatchArray | null = raw.match(/^\s*\d{2}:\d{2}-\d{2}:\d{2}\s+(.+)$/);

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

    protected isCompletedForm(): boolean {
        if (this.formInfo && this.formInfo.status === 0) {
            this.isCompleted = false;
            return false;
        } else {
            this.isCompleted = true;
            return true;
        }
    }

    protected goBack(): void {
        this._router.navigate(['operator/progress-list']);
    }

    protected toggleModal(type: keyof typeof this.modalStates, state: boolean): void {
        this.modalStates[type] = state;

        if (state) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }

    protected completeForm(): void {
        this._formsManager.completeForm(this.formId).pipe(
            takeUntilDestroyed(this._destroyRef)
        ).subscribe((): void => {
            this.goBack();

            this.alerts
                .open('<strong>Форма завершена и сохранена</strong>', {
                    appearance: 'positive',
                })
                .subscribe();

            this._cdr.detectChanges();
        });
    }

    private initializeAutoSave(): void {
        this.rowChangeSubject.pipe(
            debounceTime(500),
            distinctUntilChanged((prev, curr): boolean =>
                prev.rowOrder === curr.rowOrder &&
                JSON.stringify(prev.changes) === JSON.stringify(curr.changes)
            ),
            switchMap(({rowOrder, changes}): Observable<UpdateFormRowResponse> =>
                this._formsManager.updateFormRow(this.formId, rowOrder, {values: changes})
            ),
            tap((): void => {
                this.reloadFormData();
            }),
            takeUntilDestroyed(this._destroyRef)
        ).subscribe();
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
            complete: (): void => this.hideLoader()
        });
    }

    private reloadFormData(): void {
        forkJoin([
            this._formsManager.getFormById(this.formId),
            this._formsManager.getFormRows(this.formId),
        ]).pipe(
            tap(([formInfo, formRows]: [FormDto, FormRowDto[]]): void => {
                this.formInfo = formInfo;
                this.formRows = formRows;

                this.employeeControls.clear();
                this.downtimeReasonGroupControls.clear();
                this.changedRowValues.clear();

                this.initializeEmployeeControls();
                this.initializeReasonControls();

                this._cdr.detectChanges();
            }),
            takeUntilDestroyed(this._destroyRef)
        ).subscribe({
            complete: (): void => {
                this.hideLoader();
            }
        });
    }

    private initializeEmployeeControls(): void {
        if (!this.formRows) return;

        const employeeColumnKey: string | null = this.getFieldKeyByIndex(8);
        if (!employeeColumnKey) return;

        this.formRows.forEach((row: FormRowDto): void => {
            const employeeName: any = row.values?.[employeeColumnKey]?.value;

            const employee: EmployeeDto | undefined | null = employeeName && this.employees
                ? this.employees.find((e: EmployeeDto): boolean => this.formatFullName(e.fullName) === employeeName)
                : null;

            const control = new FormControl<EmployeeDto | null>(employee || null);

            control.valueChanges
                .pipe(takeUntilDestroyed(this._destroyRef))
                .subscribe((emp: EmployeeDto | null): void => {
                    const formattedName: string = emp ? this.formatFullName(emp.fullName) : '';
                    this.setRowCellValue(row, 8, formattedName);
                });

            this.employeeControls.set(row.order, control);
        });
    }

    private initializeReasonControls(): void {
        if (!this.formRows) return;

        const reasonColumnKey: string | null = this.getFieldKeyByIndex(9);
        if (!reasonColumnKey) return;

        this.formRows.forEach((row: FormRowDto): void => {
            const reasonName: any = row.values?.[reasonColumnKey]?.value;

            const reason: DowntimeReasonGroupDto | undefined | null = reasonName && this.downtimeReasonGroups
                ? this.downtimeReasonGroups.find((e: DowntimeReasonGroupDto): boolean => e.name === reasonName)
                : null;

            const control = new FormControl<DowntimeReasonGroupDto | null>(reason || null);

            control.valueChanges
                .pipe(takeUntilDestroyed(this._destroyRef))
                .subscribe((reasonGroup: DowntimeReasonGroupDto | null): void => {
                    this.setRowCellValue(row, 9, reasonGroup?.name || '');
                });

            this.downtimeReasonGroupControls.set(row.order, control);
        });
    }

    private trackRowChange(rowOrder: number, indicatorId: string, value: any): void {
        if (!this.changedRowValues.has(rowOrder)) {
            this.changedRowValues.set(rowOrder, {});
        }

        const rowChanges: Record<number, any> = this.changedRowValues.get(rowOrder)!;
        rowChanges[Number(indicatorId)] = value;

        this.rowChangeSubject.next({
            rowOrder,
            changes: rowChanges
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
