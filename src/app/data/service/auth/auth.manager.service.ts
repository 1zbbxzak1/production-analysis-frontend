import {inject, Injectable} from '@angular/core';
import {AuthService} from './auth.service';
import {CookieService} from 'ngx-cookie-service';
import {LoginRequest} from '../../models/auth/LoginRequest';
import {catchError, forkJoin, map, Observable, of, switchMap, tap, throwError} from 'rxjs';
import {LoginResponse} from '../../models/auth/LoginResponse';
import {HttpErrorResponse} from '@angular/common/http';
import {jwtDecode} from 'jwt-decode';
import {environment} from '../../../../environments/environment';
import {Router} from '@angular/router';
import {EmployeeDto} from '../../models/dictionaries/responses/EmployeeDto';
import {DictManagerService} from '../dictionaries/dict.manager.service';
import CryptoJS from 'crypto-js';
import {DepartmentDto} from '../../models/dictionaries/responses/DepartmentDto';

@Injectable()
export class AuthManagerService {

    private readonly _auth: AuthService = inject(AuthService);
    private readonly _dictManager: DictManagerService = inject(DictManagerService);
    private readonly _router: Router = inject(Router);
    private readonly _cookie: CookieService = inject(CookieService);

    public login(loginReq: LoginRequest): Observable<boolean> {
        return this._auth.login(loginReq).pipe(
            tap((loginRes: LoginResponse): void => {
                this.setAccessToken(loginRes.token);
            }),
            switchMap(() => this.loadAndSaveUserNameAsObservable()),
            map(() => true),
            catchError(err => this.handleLoginError(err))
        );
    }

    public logout(): void {
        this.removeAccessToken();
        this.removeUserName();
        this.removeDepartmentId();
        this.removeDepartmentName();
        this._router.navigate(['/']);
    }

    public getUserRoles(): string[] | null {
        const token: string | null = this.getAccessToken();

        if (token) {
            const decoded: any = jwtDecode(token);
            const rawRoles = decoded?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
            if (!rawRoles) return null;
            return Array.isArray(rawRoles) ? rawRoles : [rawRoles];
        }

        return null;
    }

    public getAccessToken(): string | null {
        const encryptedToken: string = this._cookie.get(environment.tokenName);
        if (!encryptedToken) {
            return null;
        }

        const token: string = this.decrypt(encryptedToken);
        if (!token) return null;

        if (token && this.isTokenExpired(token)) {
            this.logout();
            return null;
        }
        return token;
    }

    public getUserName(): string | null {
        const encryptedUserName: string = this._cookie.get(environment.userName);
        if (!encryptedUserName) {
            return null;
        }

        const userName: string = this.decrypt(encryptedUserName);
        return userName || null;
    }

    public getDepartmentId(): string | null {
        const encryptedDepartmentId: string = this._cookie.get('department_id');
        if (!encryptedDepartmentId) return null;
        return this.decrypt(encryptedDepartmentId) || null;
    }

    public getDepartmentName(): string | null {
        const encryptedDepartmentName: string = this._cookie.get('department_name');
        if (!encryptedDepartmentName) return null;
        return this.decrypt(encryptedDepartmentName) || null;
    }

    private isTokenExpired(token: string): boolean {
        try {
            const decoded: any = jwtDecode(token);
            const currentTime: number = Math.floor(Date.now() / 1000);
            return decoded.exp && currentTime >= decoded.exp;
        } catch {
            return true;
        }
    }

    private handleLoginError(err: HttpErrorResponse): Observable<never> {
        const errorMessage: string = this.getErrorMessage(err);
        return throwError((): Error => new Error(errorMessage));
    }

    private getErrorMessage(err: HttpErrorResponse): string {
        if (err.status === 404) {
            return "Ошибка. Неправильный логин и/или пароль.";
        }
        if (err.status === 500) {
            return "Внутренняя ошибка сервера. Пожалуйста, попробуйте позже.";
        }

        return "Произошла ошибка. Попробуйте еще раз.";
    }

    private setAccessToken(token: string | null): void {
        if (token != null) {
            const encryptedToken: string = this.encrypt(token);
            this._cookie.set(environment.tokenName, encryptedToken, {expires: 1, path: '/'});
        }
    }

    private removeAccessToken(): void {
        this._cookie.delete(environment.tokenName, '/');
    }

    private setUserName(fullName: string): void {
        const encryptedUserName: string = this.encrypt(fullName);
        this._cookie.set(environment.userName, encryptedUserName, {expires: 1, path: '/'});
    }

    private removeUserName(): void {
        this._cookie.delete(environment.userName, '/');
    }

    private setDepartmentId(departmentId: string): void {
        const encryptedDepartmentId: string = this.encrypt(departmentId);
        this._cookie.set(environment.departmentId, encryptedDepartmentId, {expires: 1, path: '/'});
    }

    private removeDepartmentId(): void {
        this._cookie.delete(environment.departmentId, '/');
    }

    private setDepartmentName(departmentId: string): void {
        const encryptedDepartmentName: string = this.encrypt(departmentId);
        this._cookie.set(environment.departmentName, encryptedDepartmentName, {expires: 1, path: '/'});
    }

    private removeDepartmentName(): void {
        this._cookie.delete(environment.departmentName, '/');
    }

    private compareIds(id: any, sid: any): boolean {
        if (typeof id === 'number') {
            const sidAsNumber: number = parseInt(sid, 10);
            return !isNaN(sidAsNumber) && id === sidAsNumber;
        }

        if (typeof id === 'string') {
            return id === sid || id.toLowerCase() === sid.toLowerCase();
        }

        return false;
    }

    private getUserNameFromServer(): Observable<string | null> {
        const token: string | null = this.getAccessToken();

        if (token) {
            const decoded: any = jwtDecode(token);
            const sid: string = decoded?.sid;

            return this._dictManager.getEmployees().pipe(
                map((employees: EmployeeDto[]): string | null => {
                    const employee = employees.find((emp: EmployeeDto): boolean => this.compareIds(emp.userId, sid));
                    return employee?.fullName || null;
                })
            );
        }

        return new Observable(observer => {
            observer.next(null);
            observer.complete();
        });
    }

    private getDepartmentIdFromServer(): Observable<string | null> {
        const token: string | null = this.getAccessToken();

        if (token) {
            const decoded: any = jwtDecode(token);
            const sid: string = decoded?.sid;

            return this._dictManager.getEmployees().pipe(
                map((employees: EmployeeDto[]): string | null => {
                    const employee = employees.find((emp: EmployeeDto): boolean => this.compareIds(emp.userId, sid));
                    return employee?.departmentId.toString() || null;
                })
            );
        }

        return new Observable(observer => {
            observer.next(null);
            observer.complete();
        });
    }

    private getDepartmentNameFromServer(departmentId: string | null): Observable<string | null> {
        if (!departmentId) {
            return new Observable(observer => {
                observer.next(null);
                observer.complete();
            });
        }

        return this._dictManager.getDepartments().pipe(
            map((departments: DepartmentDto[]): string | null => {
                const department = departments.find((dep: DepartmentDto): boolean =>
                    this.compareIds(dep.id, departmentId)
                );
                return department?.name || null;
            }),
            catchError(() => {
                return of(null);
            })
        );
    }

    private loadAndSaveUserNameAsObservable(): Observable<void> {
        return forkJoin([
            this.getUserNameFromServer(),
            this.getDepartmentIdFromServer()
        ]).pipe(
            switchMap(([fullName, departmentId]: [string | null, string | null]): Observable<[string | null, string | null, string | null]> => {
                if (departmentId) {
                    return this.getDepartmentNameFromServer(departmentId).pipe(
                        map((departmentName: string | null): [string | null, string | null, string | null] => [
                            fullName,
                            departmentId,
                            departmentName
                        ])
                    );
                } else {
                    return new Observable(observer => {
                        observer.next([fullName, departmentId, null]);
                        observer.complete();
                    });
                }
            }),
            tap(([fullName, departmentId, departmentName]: [string | null, string | null, string | null]): void => {
                if (fullName) this.setUserName(fullName);
                if (departmentId) this.setDepartmentId(departmentId);
                if (departmentName) this.setDepartmentName(departmentName);

                console.log('✅ Auth data saved:', {
                    fullName,
                    departmentId,
                    departmentName
                });
            }),
            map(() => void 0),
            catchError(() => of(void 0))
        );
    }

    private encrypt(data: string): string {
        try {
            const encrypted = CryptoJS.AES.encrypt(data, environment.encryptionKey);
            return encrypted.toString();
        } catch (error) {
            return data;
        }
    }

    private decrypt(encryptedData: string): string {
        try {
            const bytes = CryptoJS.AES.decrypt(encryptedData, environment.encryptionKey);
            const decrypted = bytes.toString(CryptoJS.enc.Utf8);

            if (!decrypted) {
                return '';
            }

            return decrypted;
        } catch (error) {
            return '';
        }
    }
}
