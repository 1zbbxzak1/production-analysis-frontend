import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TuiButton, TuiTextfield} from "@taiga-ui/core";
import {TuiTextareaModule, TuiTextfieldControllerModule} from "@taiga-ui/legacy";
import {DowntimeReasonGroupDto} from '../../../../../data/models/dictionaries/responses/DowntimeReasonGroupDto';
import {
    CreateDowntimeReasonGroupRequest
} from '../../../../../data/models/dictionaries/requests/CreateDowntimeReasonGroupRequest';

@Component({
    selector: 'app-downtime-reason-group-form',
    imports: [
        ReactiveFormsModule,
        TuiTextfieldControllerModule,
        TuiTextfield,
        TuiTextareaModule,
        FormsModule,
        TuiButton,
    ],
    templateUrl: './downtime-reason-group-form.html',
    styleUrl: './downtime-reason-group-form.css',
})
export class DowntimeReasonGroupFormComponent implements OnInit {
    @Input()
    public submitLabel: string = 'Сохранить';
    @Input()
    public initialData?: DowntimeReasonGroupDto;
    @Output()
    public save: EventEmitter<CreateDowntimeReasonGroupRequest> = new EventEmitter<CreateDowntimeReasonGroupRequest>();
    @Output()
    public cancel: EventEmitter<void> = new EventEmitter<void>();

    public readonly controlName: FormControl<string | null> = new FormControl<string | null>(null);
    public readonly controlDescription: FormControl<string | null> = new FormControl<string | null>(null);

    public ngOnInit(): void {
        if (this.initialData) {
            this.patchForm(this.initialData);
        }
    }

    protected isFormInvalid(): boolean {
        return !this.controlName.value;
    }

    protected onSubmit(): void {
        if (this.isFormInvalid()) {
            return;
        }

        const req: CreateDowntimeReasonGroupRequest = {
            name: this.controlName.value!,
            description: this.controlDescription.value!
        };

        this.save.emit(req);
    }

    protected onCancel(): void {
        this.cancel.emit();
    }

    private patchForm(data: DowntimeReasonGroupDto): void {
        this.controlName.setValue(data.name);
        this.controlDescription.setValue(data.description);
    }
}
