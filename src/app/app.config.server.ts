import {ApplicationConfig, mergeApplicationConfig} from '@angular/core';
import {provideServerRendering, withRoutes} from '@angular/ssr';
import {appConfig} from './app.config';
import {serverRoutes} from './app.routes.server';
import {UNIVERSAL_PROVIDERS} from '@ng-web-apis/universal';

const serverConfig: ApplicationConfig = {
    providers: [
        provideServerRendering(withRoutes(serverRoutes)),
        UNIVERSAL_PROVIDERS,
    ]
};

export const config: ApplicationConfig = mergeApplicationConfig(appConfig, serverConfig);
