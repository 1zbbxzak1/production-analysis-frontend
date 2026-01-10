import {Routes} from '@angular/router';
import {redirectGuard} from './data/guard/redirect-guard';
import {Auth} from './children/auth/auth';
import {departmentHeadGuard} from './data/guard/department-head-guard';
import {Forms} from './children/head/forms/forms';
import {Reports} from './children/head/reports/reports';
import {Archive} from './children/head/archive/archive';
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
        children: [
            {
                path: 'forms',
                component: Forms,
            },
            {
                path: 'archive',
                component: Archive,
            },
            {
                path: '',
                redirectTo: 'forms',
                pathMatch: 'full',
            }
        ]
    },
    {
        path: 'department-head/reports',
        component: Reports,
        canActivate: [departmentHeadGuard],
    },
];

