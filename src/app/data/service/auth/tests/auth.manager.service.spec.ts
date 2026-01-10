import {TestBed} from '@angular/core/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {CookieService} from 'ngx-cookie-service';
import {AuthManagerService} from '../auth.manager.service';
import {AuthService} from '../auth.service';

describe('AuthManagerService', (): void => {
    let service: AuthManagerService;

    beforeEach((): void => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, RouterTestingModule],
            providers: [AuthManagerService, AuthService, CookieService]
        });
        service = TestBed.inject(AuthManagerService);
    });

    it('should be created', (): void => {
        expect(service).toBeTruthy();
    });
});
