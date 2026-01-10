import {Routes} from '@angular/router';
import {redirectGuard} from './data/guard/redirect-guard';
import {Auth} from './children/auth/auth';
import {departmentHeadGuard} from './data/guard/department-head-guard';
import {Reports} from './children/head/reports/reports';
import {Dashboard} from './children/head/dashboard/dashboard';

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
        component: Dashboard,
        canActivate: [departmentHeadGuard],
    },
    {
        path: 'department-head/reports',
        component: Reports,
        canActivate: [departmentHeadGuard],
    },
];

