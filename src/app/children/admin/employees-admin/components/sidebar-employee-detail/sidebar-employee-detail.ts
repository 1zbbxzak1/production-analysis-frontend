import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {EmployeeDto} from '../../../../../data/models/dictionaries/responses/EmployeeDto';
import {DepartmentDto} from '../../../../../data/models/dictionaries/responses/DepartmentDto';
import {TuiDrawer} from '@taiga-ui/kit';
import {NgIf} from '@angular/common';
import {TuiButton} from '@taiga-ui/core';

@Component({
    selector: 'app-sidebar-employee-detail',
    standalone: true,
    imports: [
        TuiDrawer,
        NgIf,
        TuiButton
    ],
    templateUrl: './sidebar-employee-detail.html',
    styleUrl: './sidebar-employee-detail.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarEmployeeDetail {
    @Input()
    public employee: EmployeeDto | null = null;
    @Input()
    public departments: DepartmentDto[] = [];
    @Input()
    public open: boolean = false;
    @Output()
    public openChange: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output()
    public edit: EventEmitter<number> = new EventEmitter<number>();
    @Output()
    public delete: EventEmitter<number> = new EventEmitter<number>();

    protected get fullName(): string {
        if (!this.employee || !this.employee.fullName) {
            return 'Отсутствует';
        }
        return this.employee.fullName;
    }

    protected get surname(): string {
        return this.fullName !== 'Отсутствует' ? this.fullName.split(' ')[0] : 'Отсутствует';
    }

    protected get name(): string {
        return this.fullName !== 'Отсутствует' ? this.fullName.split(' ')[1] || '—' : '—';
    }

    protected get patronymic(): string {
        return this.fullName !== 'Отсутствует' ? this.fullName.split(' ')[2] || '—' : '—';
    }

    protected get email(): string {
        return this.employee?.email || 'Отсутствует';
    }

    protected get position(): string {
        return this.employee?.position || '—';
    }

    protected get department(): string {
        if (!this.employee || !this.employee.departmentId) {
            return '—';
        }
        const department: DepartmentDto | undefined = this.departments.find((d: DepartmentDto): boolean => d.id === this.employee?.departmentId);
        return department && department.name ? department.name : '—';
    }

    protected onOpenChange(open: boolean): void {
        this.open = open;
        this.openChange.emit(open);
    }

    protected onEdit(): void {
        if (this.employee) {
            this.edit.emit(this.employee.id);
        }
    }

    protected onDelete(): void {
        if (this.employee) {
            this.delete.emit(this.employee.id);
        }
    }
}
