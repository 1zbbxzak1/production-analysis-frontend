import {CanActivateFn, Router} from '@angular/router';
import {Observable, of} from 'rxjs';
import {inject} from '@angular/core';
import {AuthManagerService} from '../service/auth/auth.manager.service';

export const departmentHeadGuard: CanActivateFn = (): Observable<boolean> => {
    const router: Router = inject(Router);
    const authManager: AuthManagerService = inject(AuthManagerService);

    const isAuthorized: string | null = authManager.getAccessToken();
    const roles: string[] | null = authManager.getUserRoles();

    if (!isAuthorized) {
        router.navigate(['/']);
        return of(false);
    }

    const hasAccess: boolean = roles?.includes('DepartmentHead') ?? false;

    if (!hasAccess) {
        router.navigate(['/']);
        return of(false);
    }

    return of(true);
};
