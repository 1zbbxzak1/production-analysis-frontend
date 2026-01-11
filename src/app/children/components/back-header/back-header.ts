import {Component, EventEmitter, Output} from '@angular/core';

@Component({
    selector: 'app-back-header',
    imports: [],
    templateUrl: './back-header.html',
    styleUrl: './back-header.css',
})
export class BackHeader {
    @Output()
    public backClicked = new EventEmitter<void>();
    protected isHovered: boolean = false;

    protected onBackClick(): void {
        this.backClicked.emit();
    }
}
