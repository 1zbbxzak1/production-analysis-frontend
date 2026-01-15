import {Component, inject, Input, OnInit} from '@angular/core';
import {NgIf} from "@angular/common";
import {TuiBadge} from "@taiga-ui/kit";
import {FormDto} from '../../../../../data/models/forms/responses/FormDto';
import {PA_TYPE_DESCRIPTIONS} from '../../../../../data/models/forms/enums/PaTypeDescriptions';
import {AuthManagerService} from '../../../../../data/service/auth/auth.manager.service';
import {ProductContextDto} from '../../../../../data/models/forms/ProductContextDto';

@Component({
    selector: 'app-header-form',
    imports: [
        NgIf,
        TuiBadge
    ],
    templateUrl: './header-form.html',
    styleUrl: './header-form.css',
})
export class HeaderForm implements OnInit {
    @Input()
    public isLoading: boolean = true;

    @Input()
    public formInfo: FormDto | null = null;

    protected depName: string | null = null;
    protected assigneeName: string | null = null;

    private readonly _authManager: AuthManagerService = inject(AuthManagerService);

    public ngOnInit(): void {
        this.depName = this._authManager.getDepartmentName();
        this.assigneeName = this.formatFullName(this._authManager.getUserName());
    }

    protected getPaTypeDescription(paType?: number): string {
        if (!paType && paType !== 0) {
            return 'Неизвестный тип';
        }
        return PA_TYPE_DESCRIPTIONS[paType] || 'Неизвестный тип';
    }

    protected getProductsName(): string {
        if (!this.formInfo?.context) {
            return '';
        }

        const productNames: string[] = [];

        // Вариант 1: один product
        if (this.formInfo.context.product?.productName) {
            productNames.push(this.formInfo.context.product.productName);
        }

        // Вариант 2: массив products
        if (this.formInfo.context.products && this.formInfo.context.products.length > 0) {
            this.formInfo.context.products.forEach((product: ProductContextDto): void => {
                if (product.productName) {
                    productNames.push(product.productName);
                }
            });
        }

        // Вариант 3: operationOrProduct
        if (this.formInfo.context.operationOrProduct) {
            const name: string | null = this.formInfo.context.operationOrProduct.productName
                || this.formInfo.context.operationOrProduct.operationName;

            if (name) {
                productNames.push(name);
            }
        }

        return productNames.join(', ');
    }

    protected getContextProduct(): ProductContextDto | null {
        if (!this.formInfo?.context) {
            return null;
        }

        // Если есть products - объединяем все в один объект
        if (this.formInfo.context.products && this.formInfo.context.products.length > 0) {
            return this.mergeProducts(this.formInfo.context.products);
        }

        // Иначе берем product
        return this.formInfo.context.product;
    }


    protected shouldShowCycleTime(): boolean {
        const product: ProductContextDto | null = this.getContextProduct();
        return product?.cycleTime !== null && product?.cycleTime !== undefined;
    }

    protected shouldShowWorkstationCapacity(): boolean {
        const product: ProductContextDto | null = this.getContextProduct();
        return product?.workstationCapacity !== null && product?.workstationCapacity !== undefined;
    }

    protected getDateShiftTitle(): string {
        if (!this.formInfo) {
            return '';
        }
        return `${this.formatDate(this.formInfo.formDate)} / ${this.formInfo.shift.name}`;
    }

    protected getCycleTime(): number | string {
        return this.getContextProduct()?.cycleTime || 'Нет данных';
    }

    protected getWorkstationCapacity(): number | string {
        return this.getContextProduct()?.workstationCapacity || 'Нет данных';
    }

    protected getDailyRate(): number | string {
        return this.getContextProduct()?.dailyRate || 'Нет данных';
    }

    protected formatDate(dateString: string): string {
        if (!dateString) {
            return '';
        }

        try {
            const date = new Date(dateString);
            const day: string = String(date.getDate()).padStart(2, '0');
            const month: string = String(date.getMonth() + 1).padStart(2, '0');
            const year: number = date.getFullYear();

            return `${day}.${month}.${year}`;
        } catch (error) {
            return dateString;
        }
    }

    private mergeProducts(products: ProductContextDto[]): ProductContextDto {
        return {
            productId: products[0]?.productId || 0,
            productName: this.mergeStringValues(products.map((p: ProductContextDto): string | null => p.productName)),
            cycleTime: this.formatMergedNumbers(products.map((p: ProductContextDto): number | null => p.cycleTime)),
            workstationCapacity: this.formatMergedNumbers(products.map((p: ProductContextDto): number | null => p.workstationCapacity)),
            dailyRate: this.formatMergedNumbers(products.map((p: ProductContextDto): number => p.dailyRate))
        };
    }

    private mergeStringValues(values: (string | null)[]): string | null {
        const filtered: (string | null)[] = values.filter(Boolean);
        return filtered.length > 0 ? filtered.join(' / ') : null;
    }

    private formatMergedNumbers(values: (number | null)[]): any {
        const filtered: (number | null)[] = values.filter((v: number | null): v is number => v !== null && v !== undefined);
        return filtered.length > 0 ? filtered.join(' / ') : null;
    }

    private formatFullName(fullName: string | null): string {
        if (!fullName) {
            return '';
        }

        const parts: string[] = fullName.trim().split(/\s+/);

        if (parts.length === 0) {
            return '';
        }

        if (parts.length === 1) {
            return parts[0];
        }

        if (parts.length === 2) {
            return `${parts[0]} ${parts[1].charAt(0)}.`;
        }

        if (parts.length >= 3) {
            return `${parts[0]} ${parts[1].charAt(0)}.${parts[2].charAt(0)}.`;
        }

        return fullName;
    }
}
