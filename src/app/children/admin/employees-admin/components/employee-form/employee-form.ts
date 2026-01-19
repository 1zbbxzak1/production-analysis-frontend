import {ChangeDetectorRef, Component, DestroyRef, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TuiButton, TuiTextfield} from "@taiga-ui/core";
import {TuiComboBoxModule, TuiTextfieldControllerModule} from "@taiga-ui/legacy";
import {TuiDataListWrapper, TuiFilterByInputPipe, TuiStringifyContentPipe} from "@taiga-ui/kit";
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {DictManagerService} from '../../../../../data/service/dictionaries/dict.manager.service';
import {PositionDto} from '../../../../../data/models/dictionaries/responses/PositionDto';
import {DepartmentDto} from '../../../../../data/models/dictionaries/responses/DepartmentDto';
import {forkJoin} from 'rxjs';
import {CreateEmployeeRequest} from '../../../../../data/models/dictionaries/requests/CreateEmployeeRequest';
import {EmployeeDto} from '../../../../../data/models/dictionaries/responses/EmployeeDto';

@Component({
    selector: 'app-employee-form',
    imports: [
        TuiDataListWrapper,
        TuiComboBoxModule,
        ReactiveFormsModule,
        TuiTextfieldControllerModule,
        TuiStringifyContentPipe,
        TuiFilterByInputPipe,
        TuiTextfield,
        FormsModule,
        TuiButton,
    ],
    templateUrl: './employee-form.html',
    styleUrl: './employee-form.css',
})
export class EmployeeFormComponent implements OnInit {
    @Input()
    public submitLabel: string = 'Добавить';
    @Input()
    public initialData?: EmployeeDto;
    @Output()
    public save: EventEmitter<CreateEmployeeRequest> = new EventEmitter<CreateEmployeeRequest>();
    @Output()
    public cancel: EventEmitter<void> = new EventEmitter<void>();

    public positions: PositionDto[] = [];
    public departments: DepartmentDto[] = [];

    public readonly controlLastName: FormControl<string | null> = new FormControl<string | null>(null);
    public readonly controlFirstName: FormControl<string | null> = new FormControl<string | null>(null);
    public readonly controlMiddleName: FormControl<string | null> = new FormControl<string | null>(null);
    public readonly controlEmail: FormControl<string | null> = new FormControl<string | null>(null);

    public readonly controlPosition: FormControl<PositionDto | null> = new FormControl<PositionDto | null>(null);
    public readonly controlDepartment: FormControl<DepartmentDto | null> = new FormControl<DepartmentDto | null>(null);

    private readonly _dictManager: DictManagerService = inject(DictManagerService);
    private readonly _destroyRef: DestroyRef = inject(DestroyRef);
    private readonly _cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

    public ngOnInit(): void {
        forkJoin([
            this._dictManager.getPositions(),
            this._dictManager.getDepartments()
        ]).pipe(
            takeUntilDestroyed(this._destroyRef)
        ).subscribe(([positions, departments]: [PositionDto[], DepartmentDto[]]): void => {
            this.positions = positions;
            this.departments = departments;

            if (this.initialData) {
                this.patchForm(this.initialData);
            }

            this._cdr.detectChanges();
        });
    }

    protected readonly stringifyPosition: (item: PositionDto) => string = (item: PositionDto): string =>
        item.name;

    protected readonly stringifyDepartment: (item: DepartmentDto) => string = (item: DepartmentDto): string =>
        item.name || '';

    protected isFormInvalid(): boolean {
        return !this.controlLastName.value ||
            !this.controlFirstName.value ||
            !this.controlPosition.value ||
            !this.controlDepartment.value;
    }

    protected onSubmit(): void {
        if (this.isFormInvalid()) {
            return;
        }

        const req: CreateEmployeeRequest = {
            firstName: this.controlFirstName.value!,
            lastName: this.controlLastName.value!,
            middleName: this.controlMiddleName.value,
            email: this.controlEmail.value,
            positionId: this.controlPosition.value!.id,
            departmentId: this.controlDepartment.value!.id
        };

        this.save.emit(req);
    }

    protected onCancel(): void {
        this.cancel.emit();
    }

    private patchForm(data: EmployeeDto): void {
        this.controlFirstName.setValue(this.getFirstName(data.fullName));
        this.controlLastName.setValue(this.getLastName(data.fullName));
        this.controlMiddleName.setValue(this.getMiddleName(data.fullName));
        this.controlEmail.setValue(data.email);

        const position: PositionDto | undefined = this.positions.find((p: PositionDto): boolean => p.name === data.position);
        if (position) {
            this.controlPosition.setValue(position);
        }

        const department: DepartmentDto | undefined = this.departments.find((d: DepartmentDto): boolean => d.id === data.departmentId);
        if (department) {
            this.controlDepartment.setValue(department);
        }
    }

    private getLastName(fullName: string | null): string | null {
        if (!fullName) return null;
        return fullName.split(' ')[0] || null;
    }

    private getFirstName(fullName: string | null): string | null {
        if (!fullName) return null;
        return fullName.split(' ')[1] || null;
    }

    private getMiddleName(fullName: string | null): string | null {
        if (!fullName) return null;
        return fullName.split(' ').slice(2).join(' ') || null;
    }
}
