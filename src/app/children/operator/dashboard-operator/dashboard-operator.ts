import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {HeaderOperator} from '../components/header-operator/header-operator';
import {Footer} from '../../components/footer/footer';
import {NgIf} from '@angular/common';
import {NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {TuiBadge, TuiTab, TuiTabs} from '@taiga-ui/kit';
import {filter} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormsCountService} from '../../../data/service/forms/forms.count.service';
import {TuiTextfield} from '@taiga-ui/core';
import {FormsModule} from '@angular/forms';
import {SearchFormsService} from '../../../data/service/forms/search.forms.service';
import {FormsManagerService} from '../../../data/service/forms/forms.manager.service';
import {FormCountsDto} from '../../../data/models/forms/responses/FormCountsDto';

@Component({
    selector: 'app-dashboard-operator',
    imports: [
        HeaderOperator,
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
    ],
    templateUrl: './dashboard-operator.html',
    styleUrl: './dashboard-operator.css',
})
export class DashboardOperator implements OnInit {
    protected isFormTypeActive: boolean = false;
    protected progressFormsCount: number = 0;
    protected completedFormsCount: number = 0;
    protected searchValue: string = '';

    private readonly _router: Router = inject(Router);
    private readonly _destroyRef: DestroyRef = inject(DestroyRef);
    private readonly _formsManager: FormsManagerService = inject(FormsManagerService);
    private readonly _formsCountService: FormsCountService = inject(FormsCountService);
    private readonly _searchFormsService: SearchFormsService = inject(SearchFormsService);

    public ngOnInit(): void {
        this.loadFormCounts();

        this.subscribeToFormCounts();
        this.subscribeToRouterEvents();

        this.checkIfFormTypeActive(this._router.url);
    }

    protected onSearchChange(value: string): void {
        this._searchFormsService.setSearch(value);
    }

    private checkIfFormTypeActive(url: string): void {
        const isProgressList: boolean = url.includes('/progress-list');
        const isCompletedList: boolean = url.includes('/completed-list');

        this.isFormTypeActive = !(isProgressList || isCompletedList);
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
