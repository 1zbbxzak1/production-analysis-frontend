import {Routes} from '@angular/router';
import {redirectGuard} from './data/guard/redirect-guard';
import {Auth} from './children/auth/auth';
import {departmentHeadGuard} from './data/guard/department-head-guard';
import {NewFormsHead} from './children/head/dashboard-head/children/new-forms-head/new-forms-head';
import {SummaryReportHead} from './children/head/summary-report-head/summary-report-head';
import {JournalFormsHead} from './children/head/dashboard-head/children/journal-forms-head/journal-forms-head';
import {DashboardHead} from './children/head/dashboard-head/dashboard-head';
import {FirstType} from './children/head/dashboard-head/children/new-forms-head/children/first-type/first-type';
import {SecondType} from './children/head/dashboard-head/children/new-forms-head/children/second-type/second-type';
import {ThirdType} from './children/head/dashboard-head/children/new-forms-head/children/third-type/third-type';
import {FourthType} from './children/head/dashboard-head/children/new-forms-head/children/fourth-type/fourth-type';
import {FifthType} from './children/head/dashboard-head/children/new-forms-head/children/fifth-type/fifth-type';
import {DashboardOperator} from './children/operator/dashboard-operator/dashboard-operator';
import {operatorGuard} from './data/guard/operator-guard';
import {ProgressOperator} from './children/operator/dashboard-operator/children/progress-operator/progress-operator';
import {CompleteOperator} from './children/operator/dashboard-operator/children/complete-operator/complete-operator';
import {FormEditOperator} from './children/operator/dashboard-operator/children/form-edit-operator/form-edit-operator';

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
                path: 'forms',
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
                path: 'archive',
                component: JournalFormsHead,
            },
            {
                path: '',
                redirectTo: 'forms',
                pathMatch: 'full',
            }
        ]
    },
    {
        path: 'operator',
        component: DashboardOperator,
        canActivate: [operatorGuard],
        children: [
            {
                path: 'progress-list',
                component: ProgressOperator
            },
            {
                path: 'completed-list',
                component: CompleteOperator
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
        component: FormEditOperator
    },
    {
        path: 'operator/completed-list/form-view/:id',
        component: FormEditOperator
    },
    {
        path: 'department-head/reports',
        component: SummaryReportHead,
        canActivate: [departmentHeadGuard],
    },
];
