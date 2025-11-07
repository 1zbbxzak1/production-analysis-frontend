import {ComponentFixture, TestBed} from '@angular/core/testing';
import {App} from './app';

describe('App', (): void => {
    beforeEach(async (): Promise<void> => {
        await TestBed.configureTestingModule({
            imports: [App],
        }).compileComponents();
    });

    it('should create the app', (): void => {
        const fixture: ComponentFixture<App> = TestBed.createComponent(App);
        const app: App = fixture.componentInstance;
        expect(app).toBeTruthy();
    });

    it('should render title', (): void => {
        const fixture: ComponentFixture<App> = TestBed.createComponent(App);
        fixture.detectChanges();
        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector('h1')?.textContent).toContain('Hello, production-analysis-frontend');
    });
});
