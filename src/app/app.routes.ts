import {Routes} from '@angular/router';
import {redirectGuard} from './data/guard/redirect-guard';
import {Auth} from './children/auth/auth';

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
];

