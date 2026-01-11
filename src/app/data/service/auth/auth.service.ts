import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {LoginRequest} from '../../models/auth/LoginRequest';
import {Observable} from 'rxjs';
import {LoginResponse} from '../../models/auth/LoginResponse';

@Injectable()
export class AuthService {

    private readonly _http: HttpClient = inject(HttpClient);
    private readonly _api: string = `${environment.api}/auth/login`;

    public login(loginReq: LoginRequest): Observable<LoginResponse> {
        return this._http.post<LoginResponse>(`${this._api}`, loginReq)
    }
}
