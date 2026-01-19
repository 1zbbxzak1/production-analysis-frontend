import {Component, DestroyRef, inject} from '@angular/core';
import {BackHeader} from "../../../../../../components/back-header/back-header";
import {TuiAlertService} from "@taiga-ui/core";
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {DictManagerService} from '../../../../../../../data/service/dictionaries/dict.manager.service';
import {Router} from '@angular/router';
import {CreateProductRequest} from '../../../../../../../data/models/dictionaries/requests/CreateProductRequest';
import {ProductFormComponent} from '../../../../components/product-form/product-form';

@Component({
    selector: 'app-create-product-admin',
    imports: [
        BackHeader,
        ProductFormComponent
    ],
    templateUrl: './create-product-admin.html',
    styleUrl: './create-product-admin.css',
})
export class CreateProductAdmin {
    private readonly _dictManager: DictManagerService = inject(DictManagerService);
    private readonly _router: Router = inject(Router);
    private readonly _destroyRef: DestroyRef = inject(DestroyRef);
    private readonly alerts: TuiAlertService = inject(TuiAlertService);

    protected goBack(): void {
        this._router.navigate(['admin/dictionaries/products']);
    }

    protected onSave(request: CreateProductRequest): void {
        this._dictManager.createProduct(request).pipe(
            takeUntilDestroyed(this._destroyRef)
        ).subscribe({
            next: (): void => {
                this.alerts
                    .open('<strong>Продукция добавлена</strong>', {
                        appearance: 'positive',
                    })
                    .subscribe();

                this.goBack();
            },
            error: (): void => {
                this.alerts
                    .open('Ошибка при создании', {
                        appearance: 'negative',
                    })
                    .subscribe();
            }
        });
    }

    protected onCancel(): void {
        this.goBack();
    }
}
