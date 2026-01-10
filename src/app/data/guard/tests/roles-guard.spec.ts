import {TestBed} from '@angular/core/testing';
import {CanActivateFn, Router} from '@angular/router';
import {rolesGuard} from '../roles-guard';
import {AuthManagerService} from '../../service/auth/auth.manager.service';
import {Observable} from 'rxjs';

describe('rolesGuard', (): void => {
    const executeGuard: CanActivateFn = (...guardParameters) =>
        TestBed.runInInjectionContext(() => rolesGuard(...guardParameters));

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

    it('should return false and redirect to home when user is not authorized', (done: DoneFn): void => {
        mockAuthManagerService.getAccessToken.and.returnValue(null);
        mockAuthManagerService.getUserRoles.and.returnValue(null);

        const result = executeGuard({} as any, {} as any) as Observable<boolean>;

        result.subscribe((value: boolean): void => {
            expect(value).toBe(false);
            expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
            done();
        });
    });

    it('should return false and redirect to home when user does not have any allowed role', (done: DoneFn): void => {
        mockAuthManagerService.getAccessToken.and.returnValue('valid-token');
        mockAuthManagerService.getUserRoles.and.returnValue(['UnknownRole']);

        const result = executeGuard({} as any, {} as any) as Observable<boolean>;

        result.subscribe((value: boolean): void => {
            expect(value).toBe(false);
            expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
            done();
        });
    });

    it('should return false and redirect to home when user roles is null', (done: DoneFn): void => {
        mockAuthManagerService.getAccessToken.and.returnValue('valid-token');
        mockAuthManagerService.getUserRoles.and.returnValue(null);

        const result = executeGuard({} as any, {} as any) as Observable<boolean>;

        result.subscribe((value: boolean): void => {
            expect(value).toBe(false);
            expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
            done();
        });
    });

    it('should return true when user has Operator role', (done: DoneFn): void => {
        mockAuthManagerService.getAccessToken.and.returnValue('valid-token');
        mockAuthManagerService.getUserRoles.and.returnValue(['Operator']);

        const result = executeGuard({} as any, {} as any) as Observable<boolean>;

        result.subscribe((value: boolean): void => {
            expect(value).toBe(true);
            expect(mockRouter.navigate).not.toHaveBeenCalled();
            done();
        });
    });

    it('should return true when user has DepartmentHead role', (done: DoneFn): void => {
        mockAuthManagerService.getAccessToken.and.returnValue('valid-token');
        mockAuthManagerService.getUserRoles.and.returnValue(['DepartmentHead']);

        const result = executeGuard({} as any, {} as any) as Observable<boolean>;

        result.subscribe((value: boolean): void => {
            expect(value).toBe(true);
            expect(mockRouter.navigate).not.toHaveBeenCalled();
            done();
        });
    });

    it('should return true when user has Admin role', (done: DoneFn): void => {
        mockAuthManagerService.getAccessToken.and.returnValue('valid-token');
        mockAuthManagerService.getUserRoles.and.returnValue(['Admin']);

        const result = executeGuard({} as any, {} as any) as Observable<boolean>;

        result.subscribe((value: boolean): void => {
            expect(value).toBe(true);
            expect(mockRouter.navigate).not.toHaveBeenCalled();
            done();
        });
    });

    it('should return true when user has multiple allowed roles', (done: DoneFn): void => {
        mockAuthManagerService.getAccessToken.and.returnValue('valid-token');
        mockAuthManagerService.getUserRoles.and.returnValue(['Operator', 'DepartmentHead', 'Admin']);

        const result = executeGuard({} as any, {} as any) as Observable<boolean>;

        result.subscribe((value: boolean): void => {
            expect(value).toBe(true);
            expect(mockRouter.navigate).not.toHaveBeenCalled();
            done();
        });
    });
});
