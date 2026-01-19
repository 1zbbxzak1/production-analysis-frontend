import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {NgIf} from '@angular/common';
import {BackHeader} from '../../../../../../components/back-header/back-header';
import {ProductFormComponent} from '../../../../components/product-form/product-form';
import {Loader} from '../../../../../../components/loader/loader';
import {ProductDto} from '../../../../../../../data/models/dictionaries/responses/ProductDto';
import {DictManagerService} from '../../../../../../../data/service/dictionaries/dict.manager.service';
import {ActivatedRoute, Router} from '@angular/router';
import {TuiAlertService} from '@taiga-ui/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {CreateProductRequest} from '../../../../../../../data/models/dictionaries/requests/CreateProductRequest';
import {UpdateProductRequest} from '../../../../../../../data/models/dictionaries/requests/UpdateProductRequest';

@Component({
    selector: 'app-update-product-admin',
    imports: [
        BackHeader,
        ProductFormComponent,
        Loader,
        NgIf
    ],
    templateUrl: './update-product-admin.html',
    styleUrl: './update-product-admin.css',
})
export class UpdateProductAdmin implements OnInit {
    public isLoading: boolean = true;
    public product: ProductDto | undefined;
    private productId: number | null = null;

    private readonly _dictManager: DictManagerService = inject(DictManagerService);
    private readonly _router: Router = inject(Router);
    private readonly _route: ActivatedRoute = inject(ActivatedRoute);
    private readonly _destroyRef: DestroyRef = inject(DestroyRef);
    private readonly alerts: TuiAlertService = inject(TuiAlertService);

    public ngOnInit(): void {
        this.productId = Number(this._route.snapshot.paramMap.get('id'));

        if (!this.productId) {
            this.goBack();
            return;
        }

        this._dictManager.getProducts().pipe(
            takeUntilDestroyed(this._destroyRef)
        ).subscribe({
            next: (products: ProductDto[]): void => {
                this.product = products.find((p: ProductDto): boolean => p.id === this.productId);
                this.isLoading = false;

                if (!this.product) {
                    this.alerts.open('Продукт не найден', {appearance: 'negative'}).subscribe();
                    this.goBack();
                }
            },
            error: (): void => {
                this.isLoading = false;
                this.alerts.open('Не удалось загрузить данные', {appearance: 'negative'}).subscribe();
                this.goBack();
            }
        });
    }

    protected goBack(): void {
        this._router.navigate(['admin/dictionaries/products']);
    }

    protected onSave(request: CreateProductRequest): void {
        if (!this.productId) {
            return;
        }

        const updateRequest: UpdateProductRequest = {
            name: request.name,
            tactTimeInSeconds: request.tactTimeInSeconds,
            enterpriseId: request.enterpriseId
        };

        this._dictManager.updateProduct(this.productId, updateRequest).pipe(
            takeUntilDestroyed(this._destroyRef)
        ).subscribe({
            next: (): void => {
                this.alerts
                    .open('<strong>Продукт обновлен</strong>', {
                        appearance: 'positive',
                    })
                    .subscribe();

                this.goBack();
            }
        });
    }

    protected onCancel(): void {
        this.goBack();
    }
}
