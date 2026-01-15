import {ChangeDetectorRef, Component, DestroyRef, inject, OnInit} from '@angular/core';
import {Footer} from "../../components/footer/footer";
import {NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {TuiBadge, TuiTab, TuiTabs} from "@taiga-ui/kit";
import {FormsModule} from '@angular/forms';
import {NgIf} from '@angular/common';
import {filter} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {TuiButton, TuiTextfield} from '@taiga-ui/core';
import {FormsManagerService} from '../../../data/service/forms/forms.manager.service';
import {FormsCountService} from '../../../data/service/forms/forms.count.service';
import {SearchFormsService} from '../../../data/service/forms/search.forms.service';
import {FormCountsDto} from '../../../data/models/forms/responses/FormCountsDto';
import {HeaderHead} from '../components/header-head/header-head';

@Component({
    selector: 'app-dashboard',
    imports: [
        Footer,
        NgIf,
        RouterLinkActive,
        TuiTab,
        RouterLink,
        TuiTabs,
        RouterOutlet,
        TuiBadge,
        TuiTextfield,
        FormsModule,
        HeaderHead,
        TuiButton,
    ],
    templateUrl: './dashboard-head.html',
    styleUrl: './dashboard-head.css',
})
export class DashboardHead implements OnInit {
    protected isFormTypeActive: boolean = false;
    protected progressFormsCount: number = 0;
    protected completedFormsCount: number = 0;
    protected searchValue: string = '';

    private readonly _router: Router = inject(Router);
    private readonly _destroyRef: DestroyRef = inject(DestroyRef);
    private readonly _cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
    private readonly _formsManager: FormsManagerService = inject(FormsManagerService);
    private readonly _formsCountService: FormsCountService = inject(FormsCountService);
    private readonly _searchFormsService: SearchFormsService = inject(SearchFormsService);

    public ngOnInit(): void {
        this.loadFormCounts();

        this.subscribeToFormCounts();
        this.subscribeToRouterEvents();

        this.checkIfFormTypeActive(this._router.url);
    }

    protected goNewForms(): void {
        this._router.navigate(['department-head/forms']);
    }

    protected onSearchChange(value: string): void {
        this._searchFormsService.setSearch(value);
    }

    private checkIfFormTypeActive(url: string): void {
        const allList: boolean = url.includes('/all-list');
        const isProgressList: boolean = url.includes('/progress-list');
        const isCompletedList: boolean = url.includes('/completed-list');

        this.isFormTypeActive = !(allList || isProgressList || isCompletedList);
    }

    private loadFormCounts(): void {
        this._formsManager.getFormCounts().pipe(
            takeUntilDestroyed(this._destroyRef)
        ).subscribe((formCounts: FormCountsDto): void => {
            this._formsCountService.setProgressFormsCount(formCounts.inProgress);
            this._formsCountService.setCompletedFormsCount(formCounts.completed);
        });
    }

    private subscribeToFormCounts(): void {
        this._formsCountService.progressFormsCount$.pipe(
            takeUntilDestroyed(this._destroyRef)
        ).subscribe((count: number): void => {
            this.progressFormsCount = count;
        });

        this._formsCountService.completedFormsCount$.pipe(
            takeUntilDestroyed(this._destroyRef)
        ).subscribe((count: number): void => {
            this.completedFormsCount = count;
        });
    }

    private subscribeToRouterEvents(): void {
        this._router.events.pipe(
            filter((event) => event instanceof NavigationEnd),
            takeUntilDestroyed(this._destroyRef)
        ).subscribe((event: NavigationEnd): void => {
            this.checkIfFormTypeActive(event.url);
        });
    }
}
