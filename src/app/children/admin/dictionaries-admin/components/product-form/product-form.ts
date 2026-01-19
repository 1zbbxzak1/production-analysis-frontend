import {Component, DestroyRef, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {TuiButton, TuiDataList, TuiTextfield} from "@taiga-ui/core";
import {TuiComboBoxModule, TuiTextfieldControllerModule} from "@taiga-ui/legacy";
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {TuiDataListWrapper} from '@taiga-ui/kit';
import {ProductDto} from '../../../../../data/models/dictionaries/responses/ProductDto';
import {CreateProductRequest} from '../../../../../data/models/dictionaries/requests/CreateProductRequest';
import {EnterpriseDto} from '../../../../../data/models/dictionaries/responses/EnterpriseDto';
import {DictManagerService} from '../../../../../data/service/dictionaries/dict.manager.service';

@Component({
    selector: 'app-product-form',
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
    templateUrl: './product-form.html',
    styleUrl: './product-form.css',
})
export class ProductFormComponent implements OnInit {
    @Input()
    public submitLabel: string = 'Сохранить';
    @Input()
    public initialData?: ProductDto;
    @Output()
    public save: EventEmitter<CreateProductRequest> = new EventEmitter<CreateProductRequest>();
    @Output()
    public cancel: EventEmitter<void> = new EventEmitter<void>();
    public readonly controlName: FormControl<string | null> = new FormControl<string | null>(null, Validators.required);
    public readonly controlTactTime: FormControl<number | null> = new FormControl<number | null>(null, Validators.required);
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
        return this.controlName.invalid || this.controlTactTime.invalid || this.controlEnterprise.invalid;
    }

    protected onSubmit(): void {
        if (this.isFormInvalid()) {
            return;
        }

        const req: CreateProductRequest = {
            name: this.controlName.value!,
            tactTimeInSeconds: this.controlTactTime.value!,
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

    private patchForm(data: ProductDto): void {
        this.controlName.setValue(data.name);

        if (data.tactTime) {
            const parts: number[] = data.tactTime.split(':').map(Number);
            if (parts.length === 3) {
                const seconds: number = parts[0] * 3600 + parts[1] * 60 + parts[2];
                this.controlTactTime.setValue(seconds);
            }
        }

        const enterprise: EnterpriseDto | undefined = this.enterprises.find((e: EnterpriseDto): boolean => e.id === data.enterpriseId);
        if (enterprise) {
            this.controlEnterprise.setValue(enterprise);
        }
    }
}
