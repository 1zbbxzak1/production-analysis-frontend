import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {TuiButton, TuiTextfield} from "@taiga-ui/core";
import {TuiTextfieldControllerModule} from "@taiga-ui/legacy";
import {CreateEnterpriseRequest} from '../../../../../data/models/dictionaries/requests/CreateEnterpriseRequest';
import {EnterpriseDto} from '../../../../../data/models/dictionaries/responses/EnterpriseDto';

@Component({
    selector: 'app-enterprise-form',
    imports: [
        ReactiveFormsModule,
        TuiTextfieldControllerModule,
        TuiTextfield,
        FormsModule,
        TuiButton
    ],
    templateUrl: './enterprise-form.html',
    styleUrl: './enterprise-form.css',
})
export class EnterpriseFormComponent implements OnInit {
    @Input()
    public submitLabel: string = 'Сохранить';
    @Input()
    public initialData?: EnterpriseDto;
    @Output()
    public save: EventEmitter<CreateEnterpriseRequest> = new EventEmitter<CreateEnterpriseRequest>();
    @Output()
    public cancel: EventEmitter<void> = new EventEmitter<void>();

    public readonly controlName: FormControl<string | null> = new FormControl<string | null>(null, Validators.required);

    public ngOnInit(): void {
        if (this.initialData) {
            this.patchForm(this.initialData);
        }
    }

    protected isFormInvalid(): boolean {
        return this.controlName.invalid;
    }

    protected onSubmit(): void {
        if (this.isFormInvalid()) {
            return;
        }

        const req: CreateEnterpriseRequest = {
            name: this.controlName.value!
        };

        this.save.emit(req);
    }

    protected onCancel(): void {
        this.cancel.emit();
    }

    private patchForm(data: EnterpriseDto): void {
        this.controlName.setValue(data.name);
    }
}
