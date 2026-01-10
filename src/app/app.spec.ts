import {ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {App} from './app';

describe('App', (): void => {
    beforeEach(async (): Promise<void> => {
        await TestBed.configureTestingModule({
            imports: [App, RouterTestingModule],
        }).compileComponents();
    });

    it('should create the app', (): void => {
        const fixture: ComponentFixture<App> = TestBed.createComponent(App);
        const app: App = fixture.componentInstance;
        expect(app).toBeTruthy();
    });

    it('should render router outlet', (): void => {
        const fixture: ComponentFixture<App> = TestBed.createComponent(App);
        fixture.detectChanges();
        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector('router-outlet')).toBeTruthy();
    });
});
