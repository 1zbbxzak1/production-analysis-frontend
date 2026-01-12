import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class LoaderService {
    private loadingSubject = new BehaviorSubject<boolean>(false);

    public loading$: Observable<boolean> = this.loadingSubject.asObservable();

    private autoTimeout: any = null;

    public show(): void {
        this.loadingSubject.next(true);

        if (this.autoTimeout) {
            clearTimeout(this.autoTimeout);
        }

        this.autoTimeout = setTimeout(() => {
            this.hide();
        }, 300);
    }

    public hide(): void {
        if (this.autoTimeout) {
            clearTimeout(this.autoTimeout);
        }

        this.loadingSubject.next(false);
    }

    public isLoading(): boolean {
        return this.loadingSubject.value;
    }

    public setLoading(value: boolean): void {
        if (value) {
            this.show();
        } else {
            this.hide();
        }
    }
}
