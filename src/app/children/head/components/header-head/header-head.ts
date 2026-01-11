import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import {TuiChevron, TuiTabs} from '@taiga-ui/kit';
import {AuthManagerService} from '../../../../data/service/auth/auth.manager.service';
import {TuiAppearance, TuiDataList, TuiDropdown} from '@taiga-ui/core';
import {FormsModule} from '@angular/forms';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {NgForOf} from '@angular/common';

@Component({
    selector: 'app-header',
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
    ],
    templateUrl: './header-head.html',
    styleUrl: './header-head.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderHead implements OnInit {

    protected readonly tabs = [
        {label: 'Производственный анализ', route: '/department-head/forms'},
        {label: 'Сводный отчет', route: '/department-head/reports'},
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
