import {TestBed} from '@angular/core/testing';
import {CanActivateFn, Router} from '@angular/router';
import {redirectGuard} from '../redirect-guard';
import {AuthManagerService} from '../../service/auth/auth.manager.service';
import {Observable} from 'rxjs';

describe('redirectGuard', (): void => {
    const executeGuard: CanActivateFn = (...guardParameters) =>
        TestBed.runInInjectionContext(() => redirectGuard(...guardParameters));

    let mockRouter: jasmine.SpyObj<Router>;
    let mockAuthManagerService: jasmine.SpyObj<AuthManagerService>;

    beforeEach((): void => {
        mockRouter = jasmine.createSpyObj('Router', ['navigate']);
        mockAuthManagerService = jasmine.createSpyObj('AuthManagerService', ['getAccessToken', 'getUserRoles']);

        TestBed.configureTestingModule({
            providers: [
                {provide: Router, useValue: mockRouter},
                {provide: AuthManagerService, useValue: mockAuthManagerService}
            ]
        });
    });

    it('should be created', (): void => {
        expect(executeGuard).toBeTruthy();
    });

    it('should return true when user is not authorized', (done: DoneFn): void => {
        mockAuthManagerService.getAccessToken.and.returnValue(null);
        mockAuthManagerService.getUserRoles.and.returnValue(null);

        const result = executeGuard({} as any, {} as any) as Observable<boolean>;

        result.subscribe((value: boolean): void => {
            expect(value).toBe(true);
            expect(mockRouter.navigate).not.toHaveBeenCalled();
            done();
        });
    });

    it('should return false and redirect to /admin when user has Admin role', (done: DoneFn): void => {
        mockAuthManagerService.getAccessToken.and.returnValue('valid-token');
        mockAuthManagerService.getUserRoles.and.returnValue(['Admin']);

        const result = executeGuard({} as any, {} as any) as Observable<boolean>;

        result.subscribe((value: boolean): void => {
            expect(value).toBe(false);
            expect(mockRouter.navigate).toHaveBeenCalledWith(['/admin']);
            done();
        });
    });

    it('should return false and redirect to /admin when user has Admin role among multiple roles', (done: DoneFn): void => {
        mockAuthManagerService.getAccessToken.and.returnValue('valid-token');
        mockAuthManagerService.getUserRoles.and.returnValue(['Operator', 'DepartmentHead', 'Admin']);

        const result = executeGuard({} as any, {} as any) as Observable<boolean>;

        result.subscribe((value: boolean): void => {
            expect(value).toBe(false);
            expect(mockRouter.navigate).toHaveBeenCalledWith(['/admin']);
            done();
        });
    });

    it('should return false and redirect to /department-head when user has DepartmentHead role', (done: DoneFn): void => {
        mockAuthManagerService.getAccessToken.and.returnValue('valid-token');
        mockAuthManagerService.getUserRoles.and.returnValue(['DepartmentHead']);

        const result = executeGuard({} as any, {} as any) as Observable<boolean>;

        result.subscribe((value: boolean): void => {
            expect(value).toBe(false);
            expect(mockRouter.navigate).toHaveBeenCalledWith(['/department-head']);
            done();
        });
    });

    it('should return false and redirect to /department-head when user has DepartmentHead role but not Admin', (done: DoneFn): void => {
        mockAuthManagerService.getAccessToken.and.returnValue('valid-token');
        mockAuthManagerService.getUserRoles.and.returnValue(['Operator', 'DepartmentHead']);

        const result = executeGuard({} as any, {} as any) as Observable<boolean>;

        result.subscribe((value: boolean): void => {
            expect(value).toBe(false);
            expect(mockRouter.navigate).toHaveBeenCalledWith(['/department-head']);
            done();
        });
    });

    it('should return false and redirect to /operator when user has Operator role', (done: DoneFn): void => {
        mockAuthManagerService.getAccessToken.and.returnValue('valid-token');
        mockAuthManagerService.getUserRoles.and.returnValue(['Operator']);

        const result = executeGuard({} as any, {} as any) as Observable<boolean>;

        result.subscribe((value: boolean): void => {
            expect(value).toBe(false);
            expect(mockRouter.navigate).toHaveBeenCalledWith(['/operator']);
            done();
        });
    });

    it('should return false and redirect to / when user has unknown role', (done: DoneFn): void => {
        mockAuthManagerService.getAccessToken.and.returnValue('valid-token');
        mockAuthManagerService.getUserRoles.and.returnValue(['UnknownRole']);

        const result = executeGuard({} as any, {} as any) as Observable<boolean>;

        result.subscribe((value: boolean): void => {
            expect(value).toBe(false);
            expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
            done();
        });
    });

    it('should return false and redirect to / when user roles is null', (done: DoneFn): void => {
        mockAuthManagerService.getAccessToken.and.returnValue('valid-token');
        mockAuthManagerService.getUserRoles.and.returnValue(null);

        const result = executeGuard({} as any, {} as any) as Observable<boolean>;

        result.subscribe((value: boolean): void => {
            expect(value).toBe(false);
            expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
            done();
        });
    });
});
