import {CanActivateFn, Router} from '@angular/router';
import {Observable, of} from 'rxjs';
import {inject} from '@angular/core';
import {AuthManagerService} from '../service/auth/auth.manager.service';

export const rolesGuard: CanActivateFn = (): Observable<boolean> => {
    const router: Router = inject(Router);
    const authManager: AuthManagerService = inject(AuthManagerService);

    const isAuthorized: string | null = authManager.getAccessToken();
    const roles: string[] | null = authManager.getUserRoles();

    if (!isAuthorized) {
        router.navigate(['/']);
        return of(false);
    }

    const allowedRoles: string[] = ['Operator', 'DepartmentHead', 'Admin'];
    const hasAccess: boolean = roles?.some((role: string): boolean => allowedRoles.includes(role))!;

    if (!hasAccess) {
        router.navigate(['/']);
        return of(false);
    }

    return of(true);
};
