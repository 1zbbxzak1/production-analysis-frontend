import {provideEventPlugins} from "@taiga-ui/event-plugins";
import {provideAnimations} from "@angular/platform-browser/animations";
import {
    ApplicationConfig,
    isDevMode,
    LOCALE_ID,
    provideBrowserGlobalErrorListeners,
    provideZoneChangeDetection
} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideClientHydration, withEventReplay} from '@angular/platform-browser';
import {provideServiceWorker} from '@angular/service-worker';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {JwtTokenInterceptor} from './interceptors/jwt-token-interceptor';
import {AuthManagerService} from './data/service/auth/auth.manager.service';
import {AuthService} from './data/service/auth/auth.service';
import {TUI_LANGUAGE, TUI_RUSSIAN_LANGUAGE} from '@taiga-ui/i18n';
import {of} from 'rxjs';
import {DictService} from './data/service/dictionaries/dict.service';
import {DictManagerService} from './data/service/dictionaries/dict.manager.service';

export const appConfig: ApplicationConfig = {
    providers: [
        provideAnimations(),
        provideEventPlugins(),
        provideBrowserGlobalErrorListeners(),
        provideZoneChangeDetection({eventCoalescing: true}),
        provideRouter(routes),
        provideClientHydration(withEventReplay()),
        provideHttpClient(withInterceptors([JwtTokenInterceptor])),
        {
            provide: LOCALE_ID,
            useValue: 'ru'
        },
        {
            provide: TUI_LANGUAGE,
            useValue: of(TUI_RUSSIAN_LANGUAGE),
        },
        provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000'
        }),

        AuthService,
        AuthManagerService,

        DictService,
        DictManagerService,
    ]
};
