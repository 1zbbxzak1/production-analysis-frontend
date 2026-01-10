import {ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject, OnInit} from '@angular/core';
import {NgIf} from '@angular/common';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {LoginRequest} from '../../data/models/auth/LoginRequest';
import {Router} from '@angular/router';
import {AuthManagerService} from '../../data/service/auth/auth.manager.service';
import {TuiButton, TuiIcon, TuiTextfield, TuiTextfieldComponent, TuiTextfieldDirective} from '@taiga-ui/core';
import {TuiPassword} from '@taiga-ui/kit';

@Component({
    selector: 'app-auth',
    imports: [
        ReactiveFormsModule,
        NgIf,
        TuiTextfieldComponent,
        TuiTextfieldDirective,
        FormsModule,
        TuiPassword,
        TuiButton,
        TuiIcon,
        TuiTextfield,
    ],
    templateUrl: './auth.html',
    styleUrl: './auth.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Auth implements OnInit {

    protected formAuth: FormGroup = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]),
    });

    protected loginError: string | null = null;

    private readonly _router: Router = inject(Router);
    private readonly _destroyRef: DestroyRef = inject(DestroyRef);
    private readonly _cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

    private _authManagerService: AuthManagerService = inject(AuthManagerService);

    public ngOnInit(): void {
        this.formAuth.valueChanges.pipe(
            takeUntilDestroyed(this._destroyRef)
        ).subscribe((): void => {
            this.loginError = null;
        });
    }

    protected loginUser(): void {
        const email: string = this.formAuth.get("email")?.value;
        const password: string = this.formAuth.get("password")?.value;

        if (email && password) {
            const user: LoginRequest = {
                email,
                password
            };

            this._authManagerService.login(user).pipe(
                takeUntilDestroyed(this._destroyRef)
            ).subscribe({
                next: (): void => {
                    this.loginError = null;
                    const roles: string[] = this._authManagerService.getUserRoles() || [];

                    if (roles.includes('Admin')) {
                        this._router.navigate(['admin']);
                    } else if (roles.includes('DepartmentHead')) {
                        this._router.navigate(['department-head/forms']);
                    } else if (roles.includes('Operator')) {
                        this._router.navigate(['operator']);
                    } else {
                        this._router.navigate(['/']);
                    }
                },
                error: (err): void => {
                    this.loginError = err.message;
                    this._cdr.markForCheck();
                }
            });
        }
    }
}
