import {
    ChangeDetectorRef,
    Component,
    DestroyRef,
    EventEmitter,
    inject,
    OnChanges,
    OnInit,
    SimpleChanges
} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {debounceTime, filter, finalize, forkJoin} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {
    TuiAlertService,
    TuiButton,
    TuiTextfieldComponent,
    TuiTextfieldDirective,
    TuiTextfieldOptionsDirective
} from '@taiga-ui/core';
import {Loader} from '../../components/loader/loader';
import {SidebarEmployeeDetail} from './components/sidebar-employee-detail/sidebar-employee-detail';
import {TuiPagination} from '@taiga-ui/kit';
import {SearchFormsService} from '../../../data/service/forms/search.forms.service';
import {HeaderAdmin} from '../components/header-admin/header-admin';
import {DictManagerService} from '../../../data/service/dictionaries/dict.manager.service';
import {EmployeeDto} from '../../../data/models/dictionaries/responses/EmployeeDto';
import {DepartmentDto} from '../../../data/models/dictionaries/responses/DepartmentDto';
import {Footer} from '../../components/footer/footer';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NavigationEnd, Router, RouterOutlet} from '@angular/router';

@Component({
    selector: 'app-employees-admin',
    imports: [
        Loader,
        SidebarEmployeeDetail,
        NgIf,
        NgForOf,
        TuiPagination,
        HeaderAdmin,
        Footer,
        TuiButton,
        ReactiveFormsModule,
        TuiTextfieldComponent,
        TuiTextfieldDirective,
        TuiTextfieldOptionsDirective,
        FormsModule,
        RouterOutlet
    ],
    templateUrl: './employees-admin.html',
    styleUrl: './employees-admin.css',
})
export class EmployeesAdmin implements OnInit, OnChanges {
    public url: string = 'admin';
    public employees: EmployeeDto[] = [];
    public departments: DepartmentDto[] = [];
    public isLoading: boolean = false;
    public emptyMessage: string = 'Сотрудников пока нет';
    public emptyDescription: string = 'Вы пока не создали сотрудников. Как только появятся новые сотрудники, они отобразятся здесь автоматически.';
    public totalItems: number = 0;
    public currentPage: number = 0;
    public searchValue: string = '';
    public isChildRouteActive: boolean = false;

    public pageChange: EventEmitter<number> = new EventEmitter<number>();

    protected filteredEmployees: EmployeeDto[] = [];
    protected open: boolean = false;
    protected showSidebar: boolean = false;
    protected selectedEmployee: EmployeeDto | null = null;

    protected readonly itemsPerPage: number = 10;


    private readonly _dictManager: DictManagerService = inject(DictManagerService);
    private readonly _searchFormsService: SearchFormsService = inject(SearchFormsService);
    private readonly _router: Router = inject(Router);
    private readonly _destroyRef: DestroyRef = inject(DestroyRef);
    private readonly _cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
    private readonly alerts: TuiAlertService = inject(TuiAlertService);

    protected get safeEmployeeItems(): EmployeeDto[] {
        const startIndex: number = this.currentPage * this.itemsPerPage;
        return this.filteredEmployees.slice(startIndex, startIndex + this.itemsPerPage);
    }

    protected get totalPages(): number {
        return Math.ceil(this.totalItems / this.itemsPerPage);
    }

    protected get shouldShowPagination(): boolean {
        return this.totalItems > this.itemsPerPage;
    }

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

        this.loadData();
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes['employees'] || changes['currentPage']) {
            this.updateFilteredEmployees();
            this._cdr.detectChanges();
        }
    }

    protected onPageChange(page: number): void {
        this.currentPage = page;
        this.pageChange.emit(page);
    }

    protected onSearchChange(searchQuery: string | null): void {
        this.searchValue = searchQuery || '';
        this.currentPage = 0;
        this.applyFilter(this.searchValue);
    }

    protected goCreateEmployee(): void {
        this._router.navigate(['admin/employees/create-employee']);
    }

    protected goEditEmployee(id: number): void {
        this._router.navigate([`admin/employees/edit-employee/${id}`]);
    }

    protected formatFullName(fullName: string | null): string {
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

    protected getDepartmentName(departmentId: number): string {
        const department: DepartmentDto | undefined = this.departments.find((d: DepartmentDto): boolean => d.id === departmentId);
        return department ? (department.name || '') : '';
    }


    protected onRowClick(employee: EmployeeDto): void {
        this.selectedEmployee = employee;
        this.showSidebar = true;
    }

    protected onCloseSidebar(): void {
        this.showSidebar = false;
        this.selectedEmployee = null;
    }

    protected onEditFromSidebar(id: number): void {
        this.goEditEmployee(id);
        this.onCloseSidebar();
    }

    protected onDeleteFromSidebar(id: number): void {
        this.deleteEmployee(id);
        this.onCloseSidebar();
    }


    protected deleteEmployee(employeeId: number): void {
        this._dictManager.deleteEmployee(employeeId).pipe(
            takeUntilDestroyed(this._destroyRef),
        ).subscribe((): void => {
            this.employees = this.employees.filter((e: EmployeeDto): boolean => e.id !== employeeId);
            this.totalItems = this.employees.length;
            this.updateFilteredEmployees();

            this.alerts
                .open('<strong>Сотрудник удален</strong>', {
                    appearance: 'positive',
                })
                .subscribe();

            this._cdr.detectChanges();
        })
    }

    private loadData(): void {
        forkJoin([
            this._dictManager.getEmployees(),
            this._dictManager.getDepartments()
        ]).pipe(
            takeUntilDestroyed(this._destroyRef),
            finalize((): void => {
                this.isLoading = false;
                this._cdr.detectChanges();
            })
        ).subscribe({
            next: ([employees, departments]: [EmployeeDto[], DepartmentDto[]]): void => {
                this.employees = employees;
                this.departments = departments;
                this.totalItems = employees.length;
                this.updateFilteredEmployees();
            },
            error: (): void => {
                this.alerts.open('Не удалось загрузить данные', {appearance: 'negative', label: 'Ошибка'}).subscribe();
            }
        });

        this._searchFormsService.searchValue$.pipe(
            takeUntilDestroyed(this._destroyRef),
            debounceTime(300)
        ).subscribe((searchValue: string): void => {
            this.applyFilter(searchValue);
        });
    }

    private updateFilteredEmployees(): void {
        if (!this.employees || this.employees.length === 0) {
            this.filteredEmployees = [];
            return;
        }

        this.applyFilter(this.searchValue);
    }

    private applyFilter(searchValue: string): void {
        if (!this.employees || this.employees.length === 0) {
            this.filteredEmployees = [];
            this.totalItems = 0;
            return;
        }

        let filtered: EmployeeDto[];

        if (!searchValue.trim()) {
            filtered = this.employees;
        } else {
            const lowerSearch: string = searchValue.toLowerCase().trim();
            filtered = this.employees
                .filter((item: EmployeeDto): boolean =>
                    this.matchesSearch(item, lowerSearch)
                );
        }

        this.filteredEmployees = filtered;
        this.totalItems = filtered.length;

        const maxPage: number = Math.ceil(this.totalItems / this.itemsPerPage) - 1;
        if (this.currentPage > maxPage) {
            this.currentPage = 0;
        }

        this._cdr.detectChanges();
    }

    private matchesSearch(employee: EmployeeDto, search: string): boolean {
        const fullName: string = (employee.fullName || '').toLowerCase();
        const email: string = (employee.email || '').toLowerCase();
        const position: string = (employee.position || '').toLowerCase();
        const department: string = this.getDepartmentName(employee.departmentId).toLowerCase();

        return fullName.includes(search) ||
            email.includes(search) ||
            position.includes(search) ||
            department.includes(search);
    }

    private checkRoute(): void {
        const wasChildActive: boolean = this.isChildRouteActive;
        this.isChildRouteActive = this._router.url.includes('/create-employee') ||
            this._router.url.includes('/edit-employee');

        if (wasChildActive && !this.isChildRouteActive) {
            this.loadData();
        }
    }
}
