import {Component, Input} from '@angular/core';
import {NgIf} from '@angular/common';

@Component({
    selector: 'app-loader',
    imports: [
        NgIf
    ],
    templateUrl: './loader.html',
    styleUrl: './loader.css',
})
export class Loader {
    @Input()
    public isLoading: boolean | (() => boolean) = false;
    @Input()
    public spinnerClass: string = '';

    public get loading(): boolean {
        if (typeof this.isLoading === 'function') {
            return this.isLoading();
        }
        return this.isLoading as boolean;
    }
}
