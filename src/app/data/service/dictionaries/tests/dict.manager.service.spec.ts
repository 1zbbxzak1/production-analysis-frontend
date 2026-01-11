import {TestBed} from '@angular/core/testing';

import {DictManagerService} from '../dict.manager.service';

describe('DictManagerService', () => {
    let service: DictManagerService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(DictManagerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
