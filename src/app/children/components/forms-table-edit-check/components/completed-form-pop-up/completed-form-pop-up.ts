import {Component, EventEmitter, Input, Output} from '@angular/core';
import {TuiButton} from '@taiga-ui/core';
import {NgIf} from '@angular/common';

@Component({
    selector: 'app-completed-form-pop-up',
    imports: [
        TuiButton,
        NgIf
    ],
    templateUrl: './completed-form-pop-up.html',
    styleUrl: './completed-form-pop-up.css',
})
export class CompletedFormPopUp {
    @Input()
    public isVisible: boolean = false;
    @Output()
    public complete: EventEmitter<void> = new EventEmitter<void>();
    @Output()
    protected close: EventEmitter<void> = new EventEmitter<void>();

    protected closeModal(): void {
        this.close.emit();
    }

    protected confirm(): void {
        this.complete.emit();
    }
}
