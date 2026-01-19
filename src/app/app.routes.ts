import {Routes} from '@angular/router';
import {redirectGuard} from './data/guard/redirect-guard';
import {Auth} from './children/auth/auth';
import {departmentHeadGuard} from './data/guard/department-head-guard';
import {NewFormsHead} from './children/head/dashboard-head/children/new-forms-head/new-forms-head';
import {SummaryReportHead} from './children/head/summary-report-head/summary-report-head';
import {DashboardHead} from './children/head/dashboard-head/dashboard-head';
import {FirstType} from './children/head/dashboard-head/children/new-forms-head/children/first-type/first-type';
import {SecondType} from './children/head/dashboard-head/children/new-forms-head/children/second-type/second-type';
import {ThirdType} from './children/head/dashboard-head/children/new-forms-head/children/third-type/third-type';
import {FourthType} from './children/head/dashboard-head/children/new-forms-head/children/fourth-type/fourth-type';
import {FifthType} from './children/head/dashboard-head/children/new-forms-head/children/fifth-type/fifth-type';
import {DashboardOperator} from './children/operator/dashboard-operator/dashboard-operator';
import {operatorGuard} from './data/guard/operator-guard';
import {
    ProgressFormsOperator
} from './children/operator/dashboard-operator/children/progress-forms-operator/progress-forms-operator';
import {
    CompletedFormsOperator
} from './children/operator/dashboard-operator/children/completed-forms-operator/completed-forms-operator';
import {FormType12} from './children/components/forms-table-edit-check/form-type-1-2/form-type-1-2';
import {AllFormsHead} from './children/head/dashboard-head/children/all-forms-head/all-forms-head';
import {ProgressFormsHead} from './children/head/dashboard-head/children/progress-forms-head/progress-forms-head';
import {CompletedFormsHead} from './children/head/dashboard-head/children/completed-forms-head/completed-forms-head';
import {FormType3} from './children/components/forms-table-edit-check/form-type-3/form-type-3';
import {FormType5} from './children/components/forms-table-edit-check/form-type-5/form-type-5';
import {EmployeesAdmin} from './children/admin/employees-admin/employees-admin';
import {adminGuard} from './data/guard/admin-guard';
import {
    CreateEmployeeAdmin
} from './children/admin/employees-admin/children/create-employee-admin/create-employee-admin';
import {
    UpdateEmployeeAdmin
} from './children/admin/employees-admin/children/update-employee-admin/update-employee-admin';
import {DictionariesAdmin} from './children/admin/dictionaries-admin/dictionaries-admin';
import {DictProductsAdmin} from './children/admin/dictionaries-admin/children/dict-products-admin/dict-products-admin';
import {
    DictEnterprisesAdmin
} from './children/admin/dictionaries-admin/children/dict-enterprises-admin/dict-enterprises-admin';
import {
    DictDepartmentsAdmin
} from './children/admin/dictionaries-admin/children/dict-departments-admin/dict-departments-admin';
import {
    CreateDowntimeReasonGroupAdmin
} from './children/admin/dictionaries-admin/children/dict-downtime-reason-groups-admin/children/create-downtime-reason-group-admin/create-downtime-reason-group-admin';
import {
    DictDowntimeReasonGroupsAdmin
} from './children/admin/dictionaries-admin/children/dict-downtime-reason-groups-admin/dict-downtime-reason-groups-admin';
import {
    UpdateDowntimeReasonGroupAdmin
} from './children/admin/dictionaries-admin/children/dict-downtime-reason-groups-admin/children/update-downtime-reason-group-admin/update-downtime-reason-group-admin';
import {
    CreateProductAdmin
} from './children/admin/dictionaries-admin/children/dict-products-admin/children/create-product-admin/create-product-admin';
import {
    UpdateProductAdmin
} from './children/admin/dictionaries-admin/children/dict-products-admin/children/update-product-admin/update-product-admin';
import {
    CreateEnterpriseAdmin
} from './children/admin/dictionaries-admin/children/dict-enterprises-admin/children/create-enterprise-admin/create-enterprise-admin';
import {
    UpdateEnterpriseAdmin
} from './children/admin/dictionaries-admin/children/dict-enterprises-admin/children/update-enterprise-admin/update-enterprise-admin';
import {
    CreateDepartmentAdmin
} from './children/admin/dictionaries-admin/children/dict-departments-admin/children/create-department-admin/create-department-admin';
import {
    UpdateDepartmentAdmin
} from './children/admin/dictionaries-admin/children/dict-departments-admin/children/update-department-admin/update-department-admin';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
    },
    {
        path: 'login',
        component: Auth,
        canActivate: [redirectGuard],
    },
    {
        path: 'department-head',
        component: DashboardHead,
        canActivate: [departmentHeadGuard],
        children: [
            {
                path: 'all-list',
                component: AllFormsHead
            },
            {
                path: 'progress-list',
                component: ProgressFormsHead
            },
            {
                path: 'completed-list',
                component: CompletedFormsHead
            },
            {
                path: '',
                redirectTo: 'all-list',
                pathMatch: 'full',
            }
        ]
    },
    {
        path: 'department-head/forms',
        component: NewFormsHead,
        children: [
            {
                path: 'type-1',
                component: FirstType,
            },
            {
                path: 'type-2',
                component: SecondType,
            },
            {
                path: 'type-3',
                component: ThirdType,
            },
            {
                path: 'type-4',
                component: FourthType,
            },
            {
                path: 'type-5',
                component: FifthType,
            },
        ]
    },
    {
        path: 'department-head/all-list/form-view/:id',
        component: FormType12
    },
    {
        path: 'department-head/progress-list/form-view/:id',
        component: FormType12
    },
    {
        path: 'department-head/completed-list/form-view/:id',
        component: FormType12
    },
    {
        path: 'department-head/all-list/form-view-3/:id',
        component: FormType3
    },
    {
        path: 'department-head/progress-list/form-view-3/:id',
        component: FormType3
    },
    {
        path: 'department-head/completed-list/form-view-3/:id',
        component: FormType3
    },
    {
        path: 'department-head/all-list/form-view-5/:id',
        component: FormType5
    },
    {
        path: 'department-head/progress-list/form-view-5/:id',
        component: FormType5
    },
    {
        path: 'department-head/completed-list/form-view-5/:id',
        component: FormType5
    },
    {
        path: 'operator',
        component: DashboardOperator,
        canActivate: [operatorGuard],
        children: [
            {
                path: 'progress-list',
                component: ProgressFormsOperator
            },
            {
                path: 'completed-list',
                component: CompletedFormsOperator
            },
            {
                path: '',
                redirectTo: 'progress-list',
                pathMatch: 'full',
            }
        ]
    },
    {
        path: 'operator/progress-list/form-view/:id',
        component: FormType12
    },
    {
        path: 'operator/completed-list/form-view/:id',
        component: FormType12
    },
    {
        path: 'operator/progress-list/form-view-3/:id',
        component: FormType3
    },
    {
        path: 'operator/completed-list/form-view-3/:id',
        component: FormType3
    },
    {
        path: 'operator/progress-list/form-view-5/:id',
        component: FormType5
    },
    {
        path: 'operator/completed-list/form-view-5/:id',
        component: FormType5
    },
    {
        path: 'department-head/reports',
        component: SummaryReportHead,
        canActivate: [departmentHeadGuard],
    },
    {
        path: 'admin/employees',
        component: EmployeesAdmin,
        canActivate: [adminGuard],
        children: [
            {
                path: 'create-employee',
                component: CreateEmployeeAdmin,
            },
            {
                path: 'edit-employee/:id',
                component: UpdateEmployeeAdmin,
            }
        ]
    },
    {
        path: 'admin/dictionaries',
        component: DictionariesAdmin,
        canActivate: [adminGuard],
        children: [
            {
                path: 'products',
                component: DictProductsAdmin
            },
            {
                path: 'products/create',
                component: CreateProductAdmin
            },
            {
                path: 'products/edit/:id',
                component: UpdateProductAdmin
            },
            {
                path: 'enterprises',
                component: DictEnterprisesAdmin
            },
            {
                path: 'enterprises/create',
                component: CreateEnterpriseAdmin
            },
            {
                path: 'enterprises/edit/:id',
                component: UpdateEnterpriseAdmin
            },
            {
                path: 'departments',
                component: DictDepartmentsAdmin
            },
            {
                path: 'departments/create',
                component: CreateDepartmentAdmin
            },
            {
                path: 'departments/edit/:id',
                component: UpdateDepartmentAdmin
            },
            {
                path: 'downtime-reason-groups',
                component: DictDowntimeReasonGroupsAdmin
            },
            {
                path: 'downtime-reason-groups/create',
                component: CreateDowntimeReasonGroupAdmin
            },
            {
                path: 'downtime-reason-groups/edit/:id',
                component: UpdateDowntimeReasonGroupAdmin
            },
        ]
    },
];
