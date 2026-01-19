import {Component, DestroyRef, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {TuiButton, TuiDataList, TuiTextfield} from "@taiga-ui/core";
import {TuiComboBoxModule, TuiTextfieldControllerModule} from "@taiga-ui/legacy";
import {TuiDataListWrapper} from "@taiga-ui/kit";
import {CreateDepartmentRequest} from '../../../../../data/models/dictionaries/requests/CreateDepartmentRequest';
import {DepartmentDto} from '../../../../../data/models/dictionaries/responses/DepartmentDto';
import {EnterpriseDto} from '../../../../../data/models/dictionaries/responses/EnterpriseDto';
import {DictManagerService} from '../../../../../data/service/dictionaries/dict.manager.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-department-form',
    imports: [
        ReactiveFormsModule,
        TuiTextfieldControllerModule,
        TuiTextfield,
        FormsModule,
        TuiButton,
        TuiComboBoxModule,
        TuiDataListWrapper,
        TuiDataList
    ],
    templateUrl: './department-form.html',
    styleUrl: './department-form.css',
})
export class DepartmentFormComponent implements OnInit {
    @Input()
    public submitLabel: string = 'Сохранить';
    @Input()
    public initialData?: DepartmentDto;
    @Output()
    public save: EventEmitter<CreateDepartmentRequest> = new EventEmitter<CreateDepartmentRequest>();
    @Output()
    public cancel: EventEmitter<void> = new EventEmitter<void>();
    public readonly controlName: FormControl<string | null> = new FormControl<string | null>(null, Validators.required);
    public readonly controlEnterprise: FormControl<EnterpriseDto | null> = new FormControl<EnterpriseDto | null>(null, Validators.required);
    public enterprises: EnterpriseDto[] = [];
    public isLoadingEnterprises: boolean = false;
    private readonly _dictManager: DictManagerService = inject(DictManagerService);
    private readonly _destroyRef: DestroyRef = inject(DestroyRef);

    public readonly stringify: (item: EnterpriseDto) => string = (item: EnterpriseDto): string => item.name || '';

    public ngOnInit(): void {
        this.loadEnterprises();
    }

    protected isFormInvalid(): boolean {
        return this.controlName.invalid || this.controlEnterprise.invalid;
    }

    protected onSubmit(): void {
        if (this.isFormInvalid()) {
            return;
        }

        const req: CreateDepartmentRequest = {
            name: this.controlName.value!,
            enterpriseId: this.controlEnterprise.value!.id
        };

        this.save.emit(req);
    }

    protected onCancel(): void {
        this.cancel.emit();
    }

    private loadEnterprises(): void {
        this.isLoadingEnterprises = true;
        this._dictManager.getEnterprises().pipe(
            takeUntilDestroyed(this._destroyRef)
        ).subscribe((enterprises: EnterpriseDto[]): void => {
            this.enterprises = enterprises;
            this.isLoadingEnterprises = false;

            if (this.initialData) {
                this.patchForm(this.initialData);
            }
        });
    }

    private patchForm(data: DepartmentDto): void {
        this.controlName.setValue(data.name);
        const enterprise: EnterpriseDto | undefined = this.enterprises.find((e: EnterpriseDto): boolean => e.id === data.enterpriseId);
        if (enterprise) {
            this.controlEnterprise.setValue(enterprise);
        }
    }
}
