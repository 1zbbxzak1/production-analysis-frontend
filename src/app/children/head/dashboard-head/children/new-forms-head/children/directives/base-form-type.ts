import {ChangeDetectorRef, DestroyRef, Directive, inject, OnInit} from '@angular/core';
import {EmployeeDto} from '../../../../../../../data/models/dictionaries/responses/EmployeeDto';
import {ShiftDto} from '../../../../../../../data/models/dictionaries/responses/ShiftDto';
import {TuiDay} from '@taiga-ui/cdk';
import {FormControl} from '@angular/forms';
import {DictManagerService} from '../../../../../../../data/service/dictionaries/dict.manager.service';
import {FormsManagerService} from '../../../../../../../data/service/forms/forms.manager.service';
import {Router} from '@angular/router';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Directive()
export abstract class BaseFormType implements OnInit {
    protected operators: EmployeeDto[] = [];
    protected shifts: ShiftDto[] = [];

    protected readonly today: TuiDay = TuiDay.currentLocal();

    protected readonly controlOperators: FormControl = new FormControl(null);
    protected readonly controlShifts: FormControl = new FormControl(null);
    protected readonly controlDate: FormControl = new FormControl(null);

    protected readonly _dictManager: DictManagerService = inject(DictManagerService);
    protected readonly _formsManager: FormsManagerService = inject(FormsManagerService);
    protected readonly _destroyRef: DestroyRef = inject(DestroyRef);
    protected readonly _cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
    protected readonly _router: Router = inject(Router);

    ngOnInit(): void {
        this.loadEmployees();
        this.loadShifts();
        this.loadAdditionalData();
    }

    protected readonly stringify: (item: EmployeeDto) => string = (item: EmployeeDto): string =>
        item.fullName || 'Неизвестно';

    protected readonly stringifyShift: (shift: ShiftDto) => string = (shift: ShiftDto): string =>
        `№${shift.name}: ${this.formatTime(shift.startTime)}` || 'Неизвестно';

    // Переопределить в подклассах для загрузки специфических данных
    protected loadAdditionalData(): void {
    }

    // Переопределить в подклассах
    protected abstract createForm(): void;

    protected goBack(): void {
        this._router.navigate(['department-head/forms']);
    }

    protected formatTime(time: string): string {
        if (!time) return 'Неизвестно';
        const parts: string[] = time.split(':');
        if (parts.length >= 2) {
            return `${parts[0]}:${parts[1]}`;
        }
        return time;
    }

    protected formatTuiDayToIsoString(day: TuiDay): string {
        const date: Date = day.toLocalNativeDate();
        const utcDate = new Date(
            Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0)
        );
        return utcDate.toISOString();
    }

    private loadEmployees(): void {
        this._dictManager.getEmployees().pipe(
            takeUntilDestroyed(this._destroyRef)
        ).subscribe((employees: EmployeeDto[]): void => {
            this.operators = employees;
            this._cdr.detectChanges();
        });
    }

    private loadShifts(): void {
        this._dictManager.getShifts().pipe(
            takeUntilDestroyed(this._destroyRef)
        ).subscribe((shifts: ShiftDto[]): void => {
            this.shifts = shifts;
            this._cdr.detectChanges();
        });
    }
}

