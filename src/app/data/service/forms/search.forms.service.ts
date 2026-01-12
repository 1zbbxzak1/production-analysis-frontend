import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class SearchFormsService {
    private searchSubject = new BehaviorSubject<string>('');
    public searchValue$ = this.searchSubject.asObservable();

    setSearch(value: string): void {
        this.searchSubject.next(value);
    }
}
