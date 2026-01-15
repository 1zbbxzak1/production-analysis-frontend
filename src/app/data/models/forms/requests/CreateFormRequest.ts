import {PaTypeDto} from '../enums/PaTypeDto';
import {ProductContextRequest} from './ProductContextRequest';
import {OperationOrProductContextRequest} from './OperationOrProductContextRequest';

export interface CreateFormRequest {
    paType: PaTypeDto;
    shiftId: number;
    assigneeId: number;
    formDate: string; // на беке 0001-01-01T00:00:00
    product: ProductContextRequest | null;
    products: ProductContextRequest[] | null;
    operationOrProduct: OperationOrProductContextRequest | null;
}
