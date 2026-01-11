import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {Footer} from "../../components/footer/footer";
import {HeaderHead} from "../components/header-head/header-head";
import {NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {TuiTabs} from "@taiga-ui/kit";
import {FormsModule} from '@angular/forms';
import {NgIf} from '@angular/common';
import {filter} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-dashboard',
    imports: [
        Footer,
        HeaderHead,
        TuiTabs,
        FormsModule,
        RouterLinkActive,
        RouterLink,
        RouterOutlet,
        NgIf
    ],
    templateUrl: './dashboard-head.html',
    styleUrl: './dashboard-head.css',
})
export class DashboardHead implements OnInit {
    protected isFormTypeActive: boolean = false;
    private readonly _router: Router = inject(Router);
    private readonly _destroyRef: DestroyRef = inject(DestroyRef);

    public ngOnInit(): void {
        this.checkIfFormTypeActive(this._router.url);

        this._router.events.pipe(
            filter((event) => event instanceof NavigationEnd),
            takeUntilDestroyed(this._destroyRef)
        ).subscribe((event: NavigationEnd) => {
            this.checkIfFormTypeActive(event.url);
        });
    }

    private checkIfFormTypeActive(url: string): void {
        this.isFormTypeActive = /type-\d/.test(url);
    }
}
