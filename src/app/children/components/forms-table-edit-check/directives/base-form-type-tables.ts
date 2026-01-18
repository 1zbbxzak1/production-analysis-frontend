import {ChangeDetectorRef, DestroyRef, Directive, inject, OnInit} from '@angular/core';
import {FormDto} from '../../../../data/models/forms/responses/FormDto';
import {FormRowDto} from '../../../../data/models/forms/responses/FormRowDto';
import {EmployeeDto} from '../../../../data/models/dictionaries/responses/EmployeeDto';
import {DowntimeReasonGroupDto} from '../../../../data/models/dictionaries/responses/DowntimeReasonGroupDto';
import {FormControl} from '@angular/forms';
import {debounceTime, distinctUntilChanged, forkJoin, Observable, Subject, switchMap, tap} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthManagerService} from '../../../../data/service/auth/auth.manager.service';
import {DictManagerService} from '../../../../data/service/dictionaries/dict.manager.service';
import {FormsManagerService} from '../../../../data/service/forms/forms.manager.service';
import {TuiAlertService} from '@taiga-ui/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {UpdateFormRowResponse} from '../../../../data/models/forms/responses/UpdateFormRowResponse';

@Directive()
export abstract class BaseFormTypeTables implements OnInit {

    public isLoading: boolean = true;
    protected modalStates: { complete: boolean } = {
        complete: false,
    }

    protected formId: number = 0;
    protected userRoles: string | null = null;
    protected isCompleted: boolean = false;
    protected formInfo: FormDto | null = null;
    protected formRows: FormRowDto[] | null = null;
    protected employees: EmployeeDto[] | null = null;
    protected downtimeReasonGroups: DowntimeReasonGroupDto[] | null = null;

    protected employeeControls: Map<number, FormControl<EmployeeDto | null>> = new Map();
    protected downtimeReasonGroupControls: Map<number, FormControl<DowntimeReasonGroupDto | null>> = new Map(); // key: row.order
    protected employeeColumnIndex: number = 8;
    protected reasonColumnIndex: number = 9;
    private changedRowValues: Map<number, Record<number, any>> = new Map();
    private rowChangeSubject: Subject<{ rowOrder: number, changes: Record<number, any> }> = new Subject();
    private readonly _destroyRef: DestroyRef = inject(DestroyRef);
    private readonly _cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
    private readonly _router: Router = inject(Router);
    private readonly _route: ActivatedRoute = inject(ActivatedRoute);
    private readonly _authManager: AuthManagerService = inject(AuthManagerService);
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

    protected get isCompletedForm(): boolean {
        if (!this.formInfo) {
            return false;
        }

        const isHeadOrAdmin: boolean = this.userRoles === 'DepartmentHead' || this.userRoles === 'Admin';

        if (this.formInfo.status === 0) {
            // В работе: блокируем ТОЛЬКО для head/admin
            return isHeadOrAdmin;
        }

        return this.formInfo.status === 1;
    }

    public ngOnInit(): void {
        this.initializeAutoSave();

        const getId: string = this._route.snapshot.paramMap.get('id')!;
        this.formId = parseInt(getId);

        this.userRoles = this._authManager.getUserRole();

        this.loadFormData();
    }

    protected goBack(): void {
        if (this.userRoles === 'DepartmentHead') {
            this._router.navigate(['department-head/all-list']);
        }
        this._router.navigate(['operator/progress-list']);
    }

    protected readonly stringify: (item: EmployeeDto) => string = (item: EmployeeDto): string =>
        this.formatFullName(item.fullName) || 'Неизвестно';

    protected readonly stringifyReason: (item: DowntimeReasonGroupDto) => string = (item: DowntimeReasonGroupDto): string =>
        item.name || 'Неизвестно';

    protected getFieldKeyByIndex(columnIndex: number): string | null {
        if (!this.formInfo?.template?.tableColumns || columnIndex < 0 || columnIndex >= this.formInfo.template.tableColumns.length) {
            return null;
        }
        return this.formInfo.template.tableColumns[columnIndex].id.toString();
    }

    protected isBreakRow(values: Record<string, any> | null): boolean {
        const raw: string = this.getRowCellValue(values, 0); // индекс 0 = первый столбец "Время работы, час"
        if (!raw) {
            return false;
        }

        const formatted: string = this.formatTimeCell(values, 0);

        return formatted !== raw;
    }

    protected hasInputValue(row: FormRowDto, columnIndex: number): boolean {
        const fieldKey: string | null = this.getFieldKeyByIndex(columnIndex);
        if (!fieldKey) return false;

        const value: any = row.values?.[fieldKey]?.value;

        return value !== undefined && value !== null && value !== '';
    }

    protected getJustifyContent(columnAlignments: ('left' | 'center' | 'right')[], columnIndex: number): string {
        const align: "left" | "center" | "right" = columnAlignments[columnIndex] || 'left';
        return align === 'left' ? 'flex-start' : align === 'right' ? 'flex-end' : 'center';
    }

    protected getAlignText(columnAlignments: ('left' | 'center' | 'right')[], columnIndex: number): string {
        const align: "left" | "center" | "right" = columnAlignments[columnIndex] || 'left';
        return align;
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

    protected getEmployeeControl(row: FormRowDto): FormControl<EmployeeDto | null> {
        const rowOrder: number = row.order;

        if (!this.employeeControls.has(rowOrder)) {
            const control = new FormControl<EmployeeDto | null>(null);

            control.valueChanges
                .pipe(takeUntilDestroyed(this._destroyRef))
                .subscribe((employee: EmployeeDto | null): void => {
                    const employeeName: string = employee ? this.formatFullName(employee.fullName) : '';

                    this.setRowCellValue(row, this.employeeColumnIndex, employeeName);

                    if (this.hasInputValue(row, this.employeeColumnIndex)) {
                        const fieldKey: string | null = this.getFieldKeyByIndex(this.employeeColumnIndex);
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

                    this.setRowCellValue(row, this.reasonColumnIndex, reasonName);

                    if (this.hasInputValue(row, this.reasonColumnIndex)) {
                        const fieldKey: string | null = this.getFieldKeyByIndex(this.reasonColumnIndex);
                        if (fieldKey) {
                            this.trackRowChange(row.order, fieldKey, reasonName);
                        }
                    }
                });

            this.downtimeReasonGroupControls.set(rowOrder, control);
        }
        return this.downtimeReasonGroupControls.get(rowOrder)!;
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

                this.updateCompletedFlag();

                this.initializeEmployeeControls();
                this.initializeReasonControls();

                this._cdr.markForCheck();
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

                this.updateCompletedFlag();

                this.employeeControls.clear();
                this.downtimeReasonGroupControls.clear();
                this.changedRowValues.clear();

                this.initializeEmployeeControls();
                this.initializeReasonControls();

                this._cdr.markForCheck();
            }),
            takeUntilDestroyed(this._destroyRef)
        ).subscribe({
            complete: (): void => {
                this.hideLoader();
            }
        });
    }

    private updateCompletedFlag(): void {
        const byStatus: null | boolean = this.formInfo && this.formInfo.status !== 0;
        const byRole: boolean = this.userRoles === 'DepartmentHead' || this.userRoles === 'Admin';
        this.isCompleted = byStatus || byRole;
    }

    private initializeEmployeeControls(): void {
        if (!this.formRows) return;

        const employeeColumnKey: string | null = this.getFieldKeyByIndex(this.employeeColumnIndex);
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
                    this.setRowCellValue(row, this.employeeColumnIndex, formattedName);
                });

            this.employeeControls.set(row.order, control);
        });
    }

    private initializeReasonControls(): void {
        if (!this.formRows) return;

        const reasonColumnKey: string | null = this.getFieldKeyByIndex(this.reasonColumnIndex);
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
                    this.setRowCellValue(row, this.reasonColumnIndex, reasonGroup?.name || '');
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

    private hideLoader(): void {
        setTimeout((): void => {
            this.isLoading = false;
            this._cdr.detectChanges();
        }, 500);
    }
}
