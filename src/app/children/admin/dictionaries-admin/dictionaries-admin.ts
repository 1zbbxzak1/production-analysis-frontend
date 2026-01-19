import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {Footer} from "../../components/footer/footer";
import {HeaderAdmin} from "../components/header-admin/header-admin";
import {Loader} from "../../components/loader/loader";
import {NgForOf, NgIf} from "@angular/common";
import {NavigationEnd, Router, RouterOutlet} from "@angular/router";
import {filter} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

interface DictionaryItem {
    name: string;
    link: string;
}

@Component({
    selector: 'app-dictionaries-admin',
    imports: [
        Footer,
        HeaderAdmin,
        Loader,
        NgForOf,
        NgIf,
        RouterOutlet,
    ],
    templateUrl: './dictionaries-admin.html',
    styleUrl: './dictionaries-admin.css',
})
export class DictionariesAdmin implements OnInit {
    public isLoading: boolean = false;
    public isChildRouteActive: boolean = false;

    public readonly dictionaries: DictionaryItem[] = [
        {name: 'Продукция', link: 'products'},
        {name: 'Предприятия', link: 'enterprises'},
        {name: 'Подразделения', link: 'departments'},
        {name: 'Смены', link: 'shifts'},
        {name: 'Группы причин', link: 'downtime-reason-groups'},
        {name: 'Время работы', link: 'auxiliary-operations'},
    ];

    private readonly _router: Router = inject(Router);
    private readonly _destroyRef: DestroyRef = inject(DestroyRef);

    public ngOnInit(): void {
        this.checkRoute();
        this._router.events
            .pipe(
                filter(event => event instanceof NavigationEnd),
                takeUntilDestroyed(this._destroyRef)
            )
            .subscribe((): void => {
                this.checkRoute();
            });
    }

    protected onRowClick(item: DictionaryItem): void {
        this._router.navigate([`admin/dictionaries/${item.link}`]);
    }

    private checkRoute(): void {
        const currentUrl: string = this._router.url;
        this.isChildRouteActive = this.dictionaries.some((dict: DictionaryItem): boolean => currentUrl.includes(`/${dict.link}`));
    }
}
