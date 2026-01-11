import {CanActivateFn, Router} from '@angular/router';
import {Observable, of} from 'rxjs';
import {inject} from '@angular/core';
import {AuthManagerService} from '../service/auth/auth.manager.service';

export const redirectGuard: CanActivateFn = (): Observable<boolean> => {
    const router: Router = inject(Router);
    const authManager: AuthManagerService = inject(AuthManagerService);

    const isAuthorized: string | null = authManager.getAccessToken();
    const roles: string[] | null = authManager.getUserRoles();

    if (isAuthorized) {
        let redirectPath = '/';
        if (roles?.includes('Admin')) {
            redirectPath = '/admin';
        } else if (roles?.includes('DepartmentHead')) {
            redirectPath = '/department-head/forms';
        } else if (roles?.includes('Operator')) {
            redirectPath = '/operator/progress-list';
        }
        router.navigate([redirectPath]);
        return of(false);
    }

    return of(true);
};
