import {ProductContextDto} from './ProductContextDto';
import {OperationOrProductContextDto} from './OperationOrProductContextDto';

export interface FormContextDto {
    product: ProductContextDto | null;
    products: ProductContextDto[] | null;
    operationOrProduct: OperationOrProductContextDto | null;
}
