import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class SearchFormsService {
    private searchSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
    public searchValue$: Observable<string> = this.searchSubject.asObservable();

    setSearch(value: string): void {
        this.searchSubject.next(value);
    }
}
