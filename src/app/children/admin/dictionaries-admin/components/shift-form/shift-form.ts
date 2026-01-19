import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { TuiButton, TuiTextfield } from "@taiga-ui/core";
import { TuiTextfieldControllerModule } from "@taiga-ui/legacy";
import { CreateShiftRequest } from '../../../../../data/models/dictionaries/requests/CreateShiftRequest';
import { ShiftDto } from '../../../../../data/models/dictionaries/responses/ShiftDto';
import { TuiTime } from '@taiga-ui/cdk';
import { TuiInputTime } from '@taiga-ui/kit';

@Component({
    selector: 'app-shift-form',
    imports: [
        ReactiveFormsModule,
        TuiTextfieldControllerModule,
        TuiTextfield,
        FormsModule,
        TuiButton,
        TuiInputTime
    ],
    templateUrl: './shift-form.html',
    styleUrl: './shift-form.css',
})
export class ShiftFormComponent implements OnInit {
    @Input()
    public submitLabel: string = 'Сохранить';
    @Input()
    public initialData?: ShiftDto;
    @Output()
    public save: EventEmitter<CreateShiftRequest> = new EventEmitter<CreateShiftRequest>();
    @Output()
    public cancel: EventEmitter<void> = new EventEmitter<void>();

    public readonly controlName: FormControl<string | null> = new FormControl<string | null>(null, Validators.required);
    public readonly controlStartTime: FormControl<TuiTime | null> = new FormControl<TuiTime | null>(null, Validators.required);

    public ngOnInit(): void {
        if (this.initialData) {
            this.patchForm(this.initialData);
        }
    }

    protected isFormInvalid(): boolean {
        return this.controlName.invalid || this.controlStartTime.invalid;
    }

    protected onSubmit(): void {
        if (this.isFormInvalid()) {
            return;
        }

        const time: TuiTime = this.controlStartTime.value!;
        const timeString: string = time.toString() + ':00';

        const req: CreateShiftRequest = {
            name: this.controlName.value!,
            startTime: timeString
        };

        this.save.emit(req);
    }

    protected onCancel(): void {
        this.cancel.emit();
    }

    private patchForm(data: ShiftDto): void {
        this.controlName.setValue(data.name);
        if (data.startTime) {
            const parts: string[] = data.startTime.split(':');
            if (parts.length >= 2) {
                this.controlStartTime.setValue(new TuiTime(Number(parts[0]), Number(parts[1])));
            }
        }
    }
}
