import {TestBed} from '@angular/core/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {AuthService} from '../auth.service';

describe('AuthService', (): void => {
    let service: AuthService;

    beforeEach((): void => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [AuthService]
        });
        service = TestBed.inject(AuthService);
    });

    it('should be created', (): void => {
        expect(service).toBeTruthy();
    });
});
