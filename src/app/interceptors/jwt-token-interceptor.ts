import {HttpInterceptorFn} from '@angular/common/http';

export const JwtTokenInterceptor: HttpInterceptorFn = (req, next) => {
    return next(req);
};
