import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {TuiButton, TuiTextfield} from "@taiga-ui/core";
import {TuiTextfieldControllerModule} from "@taiga-ui/legacy";
import {AuxiliaryOperationDto} from '../../../../../data/models/dictionaries/responses/AuxiliaryOperationDto';
import {
    CreateAuxiliaryOperationRequest
} from '../../../../../data/models/dictionaries/requests/CreateAuxiliaryOperationRequest';


@Component({
    selector: 'app-auxiliary-operation-form',
    imports: [
        ReactiveFormsModule,
        TuiTextfieldControllerModule,
        TuiTextfield,
        FormsModule,
        TuiButton,
    ],
    templateUrl: './auxiliary-operation-form.html',
    styleUrl: './auxiliary-operation-form.css',
})
export class AuxiliaryOperationFormComponent implements OnInit {
    @Input()
    public submitLabel: string = 'Сохранить';
    @Input()
    public initialData?: AuxiliaryOperationDto;
    @Output()
    public save: EventEmitter<CreateAuxiliaryOperationRequest> = new EventEmitter<CreateAuxiliaryOperationRequest>();
    @Output()
    public cancel: EventEmitter<void> = new EventEmitter<void>();

    public readonly controlName: FormControl<string | null> = new FormControl<string | null>(null, Validators.required);
    public readonly controlDuration: FormControl<number | null> = new FormControl<number | null>(null, Validators.required);

    public ngOnInit(): void {
        if (this.initialData) {
            this.patchForm(this.initialData);
        }
    }

    protected isFormInvalid(): boolean {
        return this.controlName.invalid || this.controlDuration.invalid;
    }

    protected onSubmit(): void {
        if (this.isFormInvalid()) {
            return;
        }

        const req: CreateAuxiliaryOperationRequest = {
            name: this.controlName.value!,
            durationInSeconds: this.controlDuration.value!
        };

        this.save.emit(req);
    }

    protected onCancel(): void {
        this.cancel.emit();
    }

    private patchForm(data: AuxiliaryOperationDto): void {
        this.controlName.setValue(data.name);
        if (data.duration) {
            const parts: number[] = data.duration.split(':').map(Number);
            if (parts.length >= 2) {
                const seconds: number = parts[0] * 3600 + parts[1] * 60 + (parts.length > 2 ? parts[2] : 0);
                this.controlDuration.setValue(seconds);
            }
        }
    }
}
