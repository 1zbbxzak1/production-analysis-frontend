import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NavigationEnd, Router, RouterOutlet} from '@angular/router';
import {NgIf} from '@angular/common';
import {filter} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-forms',
    imports: [
        FormsModule,
        RouterOutlet,
        NgIf,
    ],
    templateUrl: './new-forms-head.html',
    styleUrl: './new-forms-head.css',
})
export class NewFormsHead implements OnInit {
    protected isFormTypeActive: boolean = false;
    private readonly _router: Router = inject(Router);
    private readonly _destroyRef: DestroyRef = inject(DestroyRef);

    public ngOnInit(): void {
        this.checkIfFormTypeActive(this._router.url);

        this._router.events.pipe(
            filter((event) => event instanceof NavigationEnd),
            takeUntilDestroyed(this._destroyRef)
        ).subscribe((event: NavigationEnd): void => {
            this.checkIfFormTypeActive(event.url);
        });
    }

    protected navigateToFormType(type: string): void {
        this._router.navigate(['/department-head/forms', type]);
    }

    private checkIfFormTypeActive(url: string): void {
        this.isFormTypeActive = /type-\d/.test(url);
    }
}
