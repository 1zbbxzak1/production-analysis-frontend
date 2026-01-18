import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subject} from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class FormsCountService {
    private progressFormsCountSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    public progressFormsCount$: Observable<number> = this.progressFormsCountSubject.asObservable();

    private completedFormsCountSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    public completedFormsCount$: Observable<number> = this.completedFormsCountSubject.asObservable();

    private formDeletedSubject: Subject<number> = new Subject<number>();
    public formDeleted$: Observable<number> = this.formDeletedSubject.asObservable();

    public setProgressFormsCount(count: number): void {
        this.progressFormsCountSubject.next(count);
    }

    public setCompletedFormsCount(count: number): void {
        this.completedFormsCountSubject.next(count);
    }

    public getProgressFormsCount(): number {
        return this.progressFormsCountSubject.value;
    }

    public getCompletedFormsCount(): number {
        return this.completedFormsCountSubject.value;
    }

    public reset(): void {
        this.progressFormsCountSubject.next(0);
        this.completedFormsCountSubject.next(0);
    }

    public notifyFormDeleted(formId: number): void {
        this.formDeletedSubject.next(formId);
    }
}
