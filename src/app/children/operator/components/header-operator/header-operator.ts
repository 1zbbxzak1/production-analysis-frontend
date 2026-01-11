import {Component, inject, OnInit} from '@angular/core';
import {TuiAppearance, TuiButton, TuiDataList, TuiDropdown} from "@taiga-ui/core";
import {TuiChevron} from "@taiga-ui/kit";
import {FormsModule} from '@angular/forms';
import {AuthManagerService} from '../../../../data/service/auth/auth.manager.service';

@Component({
    selector: 'app-header-operator',
    imports: [
        FormsModule,
        TuiDropdown,
        TuiDataList,
        TuiChevron,
        TuiAppearance,
        TuiButton,
    ],
    templateUrl: './header-operator.html',
    styleUrl: './header-operator.css',
})
export class HeaderOperator implements OnInit {
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
