import {Component, inject, Input, OnInit} from '@angular/core';
import {NgIf} from "@angular/common";
import {TuiBadge} from "@taiga-ui/kit";
import {FormDto} from '../../../../../../data/models/forms/responses/FormDto';
import {PA_TYPE_DESCRIPTIONS} from '../../../../../../data/models/forms/enums/PaTypeDescriptions';
import {AuthManagerService} from '../../../../../../data/service/auth/auth.manager.service';

@Component({
    selector: 'app-header-form-operator',
    imports: [
        NgIf,
        TuiBadge
    ],
    templateUrl: './header-form-operator.html',
    styleUrl: './header-form-operator.css',
})
export class HeaderFormOperator implements OnInit {
    @Input()
    public isLoading: boolean = true;

    @Input()
    public formInfo: FormDto | null = null;

    protected depName: string | null = null;
    protected assigneeName: string | null = null;

    private readonly _authManager: AuthManagerService = inject(AuthManagerService);

    public ngOnInit(): void {
        this.depName = this._authManager.getDepartmentName();
        this.assigneeName = this.formatFullName(this._authManager.getUserName());
    }

    protected getPaTypeDescription(paType?: number): string {
        if (!paType && paType !== 0) {
            return 'Неизвестный тип';
        }
        return PA_TYPE_DESCRIPTIONS[paType] || 'Неизвестный тип';
    }

    protected formatDate(dateString: string): string {
        if (!dateString) {
            return '';
        }

        try {
            const date = new Date(dateString);
            const day: string = String(date.getDate()).padStart(2, '0');
            const month: string = String(date.getMonth() + 1).padStart(2, '0');
            const year: number = date.getFullYear();

            return `${day}.${month}.${year}`;
        } catch (error) {
            return dateString;
        }
    }

    private formatFullName(fullName: string | null): string {
        if (!fullName) {
            return '';
        }

        const parts: string[] = fullName.trim().split(/\s+/);

        if (parts.length === 0) {
            return '';
        }

        if (parts.length === 1) {
            return parts[0];
        }

        if (parts.length === 2) {
            return `${parts[0]} ${parts[1].charAt(0)}.`;
        }

        if (parts.length >= 3) {
            return `${parts[0]} ${parts[1].charAt(0)}.${parts[2].charAt(0)}.`;
        }

        return fullName;
    }
}
