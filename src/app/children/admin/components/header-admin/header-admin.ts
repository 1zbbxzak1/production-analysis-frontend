import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import {NgForOf} from "@angular/common";
import {RouterLink, RouterLinkActive} from "@angular/router";
import {TuiAppearance, TuiButton, TuiDataList, TuiDropdown} from "@taiga-ui/core";
import {TuiChevron, TuiTabs} from "@taiga-ui/kit";
import {FormsModule} from '@angular/forms';
import {AuthManagerService} from '../../../../data/service/auth/auth.manager.service';

@Component({
    selector: 'app-header-admin',
    imports: [
        TuiTabs,
        FormsModule,
        TuiDropdown,
        TuiDataList,
        TuiChevron,
        NgForOf,
        RouterLink,
        RouterLinkActive,
        TuiAppearance,
        TuiButton,
    ],
    templateUrl: './header-admin.html',
    styleUrl: './header-admin.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderAdmin implements OnInit {

    protected readonly tabs = [
        {label: 'Справочники', route: '/admin/dictionaries'},
        {label: 'Сотрудники', route: '/admin/employees'},
        {label: 'Сводный отчет', route: '/admin/reports'},
    ];
    protected userName: string = 'Пользователь';
    protected open: boolean = false;
    private readonly _auth: AuthManagerService = inject(AuthManagerService);

    public ngOnInit(): void {
        const fullName: string = this._auth.getUserName() || 'Пользователь';
        this.userName = this.removePatronymic(fullName);
    }

    protected logout(): void {
        this.open = false;
        this._auth.logout();
    }

    protected onClick(): void {
        this.open = false;
    }

    private removePatronymic(fullName: string): string {
        const nameParts: string[] = fullName.trim().split(/\s+/);

        if (nameParts.length >= 3) {
            return nameParts.slice(0, 2).join(' ');
        }

        return fullName;
    }
}
