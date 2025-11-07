import { TuiRoot } from "@taiga-ui/core";
import {Component, signal, WritableSignal} from '@angular/core';
import {RouterOutlet} from '@angular/router';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, TuiRoot],
    templateUrl: './app.html',
    styleUrl: './app.css'
})
export class App {
    protected readonly title: WritableSignal<string> = signal('production-analysis-frontend');
}
