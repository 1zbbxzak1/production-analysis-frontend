import {inject, Injectable} from '@angular/core';
import {AuthService} from './auth.service';
import {CookieService} from 'ngx-cookie-service';
import {LoginRequest} from '../../models/auth/LoginRequest';
import {catchError, map, Observable, of, switchMap, tap, throwError} from 'rxjs';
import {LoginResponse} from '../../models/auth/LoginResponse';
import {HttpErrorResponse} from '@angular/common/http';
import {jwtDecode} from 'jwt-decode';
import {environment} from '../../../../environments/environment';
import {Router} from '@angular/router';
import {EmployeeDto} from '../../models/dictionaries/responses/EmployeeDto';
import {DictManagerService} from '../dictionaries/dict.manager.service';
import CryptoJS from 'crypto-js';

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

    private compareIds(id: any, sid: string): boolean {
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

    private loadAndSaveUserNameAsObservable(): Observable<void> {
        return this.getUserNameFromServer().pipe(
            tap((fullName: string | null): void => {
                if (fullName) {
                    this.setUserName(fullName);
                }
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
