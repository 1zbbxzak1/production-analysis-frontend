import {inject, Injectable} from '@angular/core';
import {AuthService} from './auth.service';
import {CookieService} from 'ngx-cookie-service';
import {LoginRequest} from '../../models/auth/LoginRequest';
import {catchError, map, Observable, throwError} from 'rxjs';
import {LoginResponse} from '../../models/auth/LoginResponse';
import {HttpErrorResponse} from '@angular/common/http';
import {jwtDecode} from 'jwt-decode';
import {environment} from '../../../../environments/environment';
import {Router} from '@angular/router';

@Injectable()
export class AuthManagerService {

    private readonly _auth: AuthService = inject(AuthService);
    private readonly _router: Router = inject(Router);
    private readonly _cookie: CookieService = inject(CookieService);

    public login(loginReq: LoginRequest): Observable<boolean> {
        return this._auth.login(loginReq).pipe(
            map((loginRes: LoginResponse): boolean => {
                this.setAccessToken(loginRes.token);
                return true;
            }),
            catchError(err => this.handleLoginError(err))
        );
    }

    public logout(): void {
        this.removeAccessToken();
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

    public getUserName(): string | null {
        const token: string | null = this.getAccessToken();

        if (token) {
            const decoded: any = jwtDecode(token);
            const givenName = decoded?.given_name || '';
            const familyName = decoded?.family_name || '';

            return `${familyName} ${givenName}`.trim() || null;
        }

        return null;
    }

    public getAccessToken(): string | null {
        const accessToken: string = this._cookie.get(environment.tokenName);
        if (accessToken && this.isTokenExpired(accessToken)) {
            this.logout();
            return null;
        }
        return accessToken || null;
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
            this._cookie.set(environment.tokenName, token, {expires: 1, path: '/'});
        }
    }

    private removeAccessToken(): void {
        this._cookie.delete(environment.tokenName, '/');
    }
}
